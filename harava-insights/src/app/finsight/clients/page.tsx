"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { Building2, Plus, Search, Loader2, ExternalLink, Ban, PlayCircle } from "lucide-react";
import { companiesApi, quickbooksApi, type Company } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";

export default function FinsightClientsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ACTIVE" | "SUSPENDED">("all");
  const [inviteFor, setInviteFor] = useState<Company | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const companies = useApi(() => companiesApi.list(), []);
  const inviteMut = useMutation((id: string, email: string) => companiesApi.inviteUser(id, { email }));
  const startQb = useMutation(() => quickbooksApi.startConnect());
  const suspendMut = useMutation((id: string) => companiesApi.suspend(id));
  const activateMut = useMutation((id: string) => companiesApi.activate(id));

  const list = (companies.data ?? []).filter((c) => {
    if (filter !== "all" && c.status?.toUpperCase() !== filter) return false;
    const q = search.toLowerCase();
    return !q || c.name?.toLowerCase().includes(q) || c.externalRef?.toLowerCase().includes(q);
  });

  const connectQuickBooks = async () => {
    try {
      const res = await startQb.mutate();
      if (res.authorizationUrl) window.open(res.authorizationUrl, "_blank", "width=780,height=760");
    } catch (e) {
      toast(e instanceof Error ? e.message : "QuickBooks start failed", "error");
    }
  };

  const submitInvite = async () => {
    if (!inviteFor) return;
    try {
      await inviteMut.mutate(inviteFor.id, inviteEmail);
      toast("Invitation sent", "success");
      setInviteFor(null);
      setInviteEmail("");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  const setStatus = async (c: Company, next: "suspend" | "activate") => {
    try {
      if (next === "suspend") await suspendMut.mutate(c.id);
      else await activateMut.mutate(c.id);
      toast(`Company ${next}d`, "success");
      companies.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  if (companies.loading) return <><DashboardHeader title="Clients" subtitle="Client companies connected via QuickBooks" /><PageLoader message="Loading clients…" /></>;
  if (companies.error) return <><DashboardHeader title="Clients" subtitle="Client companies connected via QuickBooks" /><PageError message={companies.error} onRetry={companies.refetch} /></>;

  return (
    <div>
      <DashboardHeader title="Clients" subtitle="Client companies connected via QuickBooks" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-navy/8 rounded-xl px-3.5 py-2.5 w-72">
              <Search className="w-4 h-4 text-navy/30" />
              <input type="text" placeholder="Search companies…" value={search} onChange={(e) => setSearch(e.target.value)} className="text-[13px] outline-none flex-1 bg-transparent" />
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-navy/8 rounded-xl p-1">
              {(["all", "ACTIVE", "SUSPENDED"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`text-[11px] font-medium px-3 py-1.5 rounded-lg capitalize ${filter === f ? "bg-navy text-white" : "text-navy/50 hover:text-navy"}`}>{f.toLowerCase()}</button>
              ))}
            </div>
          </div>
          <Button variant="primary" onClick={connectQuickBooks} disabled={startQb.loading}>
            {startQb.loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Starting…</> : <><Plus className="w-3.5 h-3.5" /> Connect QuickBooks</>}
          </Button>
        </div>

        <div className="grid gap-4">
            {list.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-5 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-navy/8 to-gold/6 flex items-center justify-center"><Building2 className="w-6 h-6 text-navy/50" /></div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-[14px] font-semibold text-navy">{c.name}</h3>
                        <Badge variant={c.status?.toUpperCase() === "ACTIVE" ? "success" : "error"} size="sm">{c.status}</Badge>
                        {c.quickbooksConnected && <Badge variant="info" size="sm">QuickBooks</Badge>}
                      </div>
                      <div className="text-[11px] text-navy/50">{c.externalRef || "—"} · {c.countryCode || "—"} · {c.currency || "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="xs" onClick={() => { setInviteFor(c); setInviteEmail(""); }}>Invite user</Button>
                    <Link href={`/finsight/clients/${c.id}`}><Button variant="ghost" size="xs"><ExternalLink className="w-3 h-3" /> Open</Button></Link>
                    {c.status?.toUpperCase() === "ACTIVE" ? (
                      <Button variant="ghost" size="xs" onClick={() => setStatus(c, "suspend")}><Ban className="w-3 h-3 text-amber-500" /></Button>
                    ) : (
                      <Button variant="ghost" size="xs" onClick={() => setStatus(c, "activate")}><PlayCircle className="w-3 h-3 text-emerald-500" /></Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {list.length === 0 && (
              <div className="text-center text-sm text-navy/40 py-12">
                No companies yet. Click <b>Connect QuickBooks</b> to add your first one.
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
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setInviteFor(null)}>Cancel</Button>
            <Button variant="primary" onClick={submitInvite} disabled={inviteMut.loading || !inviteEmail}>Send invite</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
