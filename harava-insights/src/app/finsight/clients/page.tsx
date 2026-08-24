"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { useCompanyContext } from "@/lib/company-context";
import { useAuth } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { Can } from "@/components/auth/permission-guard";
import { Building2, Plus, Search, Loader2, Ban, PlayCircle, Wifi, WifiOff, Users, ArrowRight, RefreshCw, LayoutGrid, List, AlertTriangle } from "lucide-react";
import { companiesApi, quickbooksApi, rolesApi, type Company } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";

export default function FinsightClientsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { can } = useAuth();
  const { setSelectedCompanyId } = useCompanyContext();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ACTIVE" | "SUSPENDED">("all");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [inviteFor, setInviteFor] = useState<Company | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState("");
  const [suspendTarget, setSuspendTarget] = useState<Company | null>(null);

  const companies = useApi(() => companiesApi.list(), []);
  const companyRoles = useApi(() => rolesApi.company(), []);
  const inviteMut = useMutation((id: string, email: string, roleId: string) => companiesApi.inviteUser(id, { email, roleId }));
  const startQb = useMutation(() => quickbooksApi.startConnect());
  const suspendMut = useMutation((id: string) => companiesApi.suspend(id));
  const activateMut = useMutation((id: string) => companiesApi.activate(id));

  const list = (companies.data ?? []).filter((c) => {
    if (filter !== "all" && c.status?.toUpperCase() !== filter) return false;
    const q = search.toLowerCase();
    return !q || c.name?.toLowerCase().includes(q) || c.externalRef?.toLowerCase().includes(q);
  });

  const connectQuickBooks = async () => {
    // Open synchronously from the click so browsers retain the opener link.
    // The OAuth URL is assigned once the server has created the state token.
    const popup = window.open("", "harava-quickbooks-oauth", "width=780,height=760");
    if (!popup) {
      toast("Your browser blocked the QuickBooks window. Please allow popups and try again.", "error");
      return;
    }
    try {
      const res = await startQb.mutate();
      if (res.authorizationUrl) {
        popup.location.href = res.authorizationUrl;
      } else {
        popup.close();
        toast("QuickBooks did not provide an authorization link. Please try again.", "error");
      }
    } catch (e) {
      popup.close();
      toast(e instanceof Error ? e.message : "QuickBooks start failed", "error");
    }
  };

  useEffect(() => {
    const handleQuickBooksResult = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== "harava:quickbooks-connected") return;
      toast("QuickBooks connected successfully.", "success");
      companies.refetch();
    };
    window.addEventListener("message", handleQuickBooksResult);
    return () => window.removeEventListener("message", handleQuickBooksResult);
  }, [companies, toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("quickbooks") === "connected" || params.get("status") === "success" || params.get("result") === "connected";
    if (!connected) return;

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: "harava:quickbooks-connected" }, window.location.origin);
      window.close();
      return;
    }

    toast("QuickBooks connected successfully.", "success");
    companies.refetch();
    params.delete("quickbooks");
    params.delete("status");
    params.delete("result");
    params.delete("companyId");
    router.replace(`/finsight/clients${params.size ? `?${params.toString()}` : ""}`);
  }, [companies, router, toast]);

  const submitInvite = async () => {
    if (!inviteFor || !inviteEmail || !inviteRoleId) return;
    try {
      await inviteMut.mutate(inviteFor.id, inviteEmail, inviteRoleId);
      toast("Invitation sent", "success");
      setInviteFor(null);
      setInviteEmail("");
      setInviteRoleId("");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  const setStatus = async (c: Company, next: "suspend" | "activate") => {
    try {
      if (next === "suspend") await suspendMut.mutate(c.id);
      else await activateMut.mutate(c.id);
      toast(`Company ${next}d`, "success");
      setSuspendTarget(null);
      companies.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  if (companies.loading) return <><DashboardHeader title="Clients" subtitle="Client companies connected via QuickBooks" /><PageLoader message="Loading clients…" /></>;
  if (companies.error) return <><DashboardHeader title="Clients" subtitle="Client companies connected via QuickBooks" /><PageError message={companies.error} onRetry={companies.refetch} /></>;

  const total = companies.data?.length ?? 0;
  const active = companies.data?.filter(c => c.status?.toUpperCase() === "ACTIVE").length ?? 0;
  const connected = companies.data?.filter(c => c.quickbooksConnected).length ?? 0;

  return (
    <div>
      <DashboardHeader title="Clients" subtitle="Client companies connected via QuickBooks" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Companies", value: total, icon: Building2 },
            { label: "Active", value: active, icon: Users },
            { label: "QB Connected", value: connected, icon: Wifi },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="stat-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-navy/50" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{value}</p>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-navy/8 rounded-xl px-3.5 py-2.5 w-72 shadow-sm">
              <Search className="w-4 h-4 text-navy/30" />
              <input type="text" placeholder="Search companies…" value={search} onChange={(e) => setSearch(e.target.value)} className="text-[13px] outline-none flex-1 bg-transparent" />
            </div>
            <div className="flex items-center gap-1 bg-white border border-navy/8 rounded-xl p-1 shadow-sm">
              {(["all", "ACTIVE", "SUSPENDED"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`text-[11px] font-medium px-3 py-1.5 rounded-lg capitalize transition-all ${
                  filter === f ? "bg-navy text-white shadow-sm" : "text-navy/50 hover:text-navy hover:bg-navy/4"
                }`}>{f.toLowerCase()}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => companies.refetch()} disabled={companies.loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${companies.loading ? "animate-spin" : ""}`} />
            </Button>
            <Can permission={PERMISSIONS.QUICKBOOKS_MANAGE}>
              <Button variant="primary" onClick={connectQuickBooks} disabled={startQb.loading}>
                {startQb.loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Starting…</> : <><Plus className="w-3.5 h-3.5" /> Connect QuickBooks</>}
              </Button>
            </Can>
          </div>
        </div>

        {/* Company grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((c) => {
            const initials = c.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() ?? "C";
            const isActive = c.status?.toUpperCase() === "ACTIVE";
            return (
              <div
                key={c.id}
                className="group relative bg-white border border-navy/6 rounded-2xl p-5 hover:border-gold/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => { setSelectedCompanyId(c.id, c.name, c.quickbooksConnected); router.push(`/finsight/clients/${c.id}`); }}
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-gold/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-navy to-navy-light flex items-center justify-center text-white font-bold text-[15px] shadow-sm">
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-[14px] font-semibold text-navy leading-tight">{c.name}</h3>
                        {c.externalRef && <p className="text-[11px] text-navy/40 mt-0.5 font-mono">{c.externalRef}</p>}
                      </div>
                    </div>
                    <Badge variant={isActive ? "success" : "error"} size="sm">{c.status}</Badge>
                  </div>

                  {/* QB status */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium mb-4 ${
                    c.quickbooksConnected
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-navy/3 text-navy/40 border border-navy/5"
                  }`}>
                    {c.quickbooksConnected
                      ? <><Wifi className="w-3.5 h-3.5" /> QuickBooks Connected</>
                      : <><WifiOff className="w-3.5 h-3.5" /> Not Connected</>
                    }
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[11px] text-navy/40 mb-4">
                    {c.countryCode && <span className="flex items-center gap-1">🏳️ {c.countryCode}</span>}
                    {c.currency && <span className="px-2 py-0.5 bg-navy/4 rounded-md font-mono">{c.currency}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-navy/5">
                    {can(PERMISSIONS.COMPANY_USER_INVITE) && <button
                      className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium text-navy/60 hover:text-navy py-1.5 rounded-lg hover:bg-navy/4 transition-all"
                      onClick={(e) => { e.stopPropagation(); setInviteFor(c); setInviteEmail(""); setInviteRoleId(companyRoles.data?.[0]?.id ?? ""); }}
                    >
                      <Users className="w-3.5 h-3.5" /> Invite
                    </button>}
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium text-navy bg-navy/5 hover:bg-navy/8 py-1.5 rounded-lg transition-all"
                      onClick={(e) => { e.stopPropagation(); setSelectedCompanyId(c.id, c.name, c.quickbooksConnected); router.push(`/finsight/clients/${c.id}`); }}
                    >
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {can(PERMISSIONS.COMPANY_MANAGE) && (isActive ? (
                      <button
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-all"
                        onClick={(e) => { e.stopPropagation(); setStatus(c, "suspend"); }}
                        title="Suspend"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition-all"
                        onClick={(e) => { e.stopPropagation(); setStatus(c, "activate"); }}
                        title="Activate"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {list.length === 0 && (
            <div className="sm:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-navy/4 flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-navy/25" />
              </div>
              <p className="text-[14px] font-semibold text-navy/50">No companies yet</p>
              <p className="text-[12px] text-navy/35 mt-1 mb-4">Connect a QuickBooks account to get started</p>
              <Can permission={PERMISSIONS.QUICKBOOKS_MANAGE}><Button variant="primary" onClick={connectQuickBooks} disabled={startQb.loading}><Plus className="w-3.5 h-3.5" /> Connect QuickBooks</Button></Can>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={!!inviteFor} onClose={() => setInviteFor(null)} title={`Invite user to ${inviteFor?.name ?? ""}`}>
        <div className="space-y-3">
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Email</label>
            <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="user@company.com" />
          </div>
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Role</label>
            <select value={inviteRoleId} onChange={(e) => setInviteRoleId(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm bg-white" disabled={companyRoles.loading || !companyRoles.data?.length}>
              <option value="">{companyRoles.loading ? "Loading roles…" : "Select a role"}</option>
              {(companyRoles.data ?? []).map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
            </select>
            {!companyRoles.loading && !companyRoles.data?.length && <p className="text-[11px] text-red-500 mt-1">No company roles are available.</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => { setInviteFor(null); setInviteRoleId(""); }}>Cancel</Button>
            <Button variant="primary" onClick={submitInvite} disabled={inviteMut.loading || !inviteEmail || !inviteRoleId}>Send invite</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
