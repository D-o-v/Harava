"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { Building2, Plus, Search, Loader2, Ban, PlayCircle } from "lucide-react";
import { platformApi, referenceApi, type Tenant } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";

export default function AdminClientsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ACTIVE" | "SUSPENDED">("all");
  const [addModal, setAddModal] = useState(false);

  const tenants = useApi(() => platformApi.listTenants(), []);
  const countries = useApi(() => referenceApi.countries(), []);
  const timezones = useApi(() => referenceApi.timezones(), []);
  const currencies = useApi(() => referenceApi.currencies(), []);

  const suspendMut = useMutation((id: string) => platformApi.suspend(id));
  const activateMut = useMutation((id: string) => platformApi.activate(id));
  const provisionMut = useMutation(platformApi.provisionTenant);

  const list = (tenants.data ?? []).filter((t) => {
    if (filter !== "all" && t.status?.toUpperCase() !== filter) return false;
    const q = search.toLowerCase();
    return !q || t.organizationName?.toLowerCase().includes(q) || t.subdomain?.toLowerCase().includes(q) || t.ownerEmail?.toLowerCase().includes(q);
  });

  const [form, setForm] = useState({
    organizationName: "",
    subdomain: "",
    ownerEmail: "",
    billingMode: "OPEN",
    countryCode: "NG",
    defaultCurrency: "NGN",
    timezone: "Africa/Lagos",
  });

  const submit = async () => {
    try {
      await provisionMut.mutate(form);
      toast("Tenant provisioned. Owner invitation email sent.", "success");
      setAddModal(false);
      tenants.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  if (tenants.loading) return <><DashboardHeader title="Client Management" subtitle="Tenants (accounting firms) using the platform" /><PageLoader message="Loading tenants…" /></>;
  if (tenants.error) return <><DashboardHeader title="Client Management" subtitle="Tenants (accounting firms) using the platform" /><PageError message={tenants.error} onRetry={tenants.refetch} /></>;

  const setStatus = async (t: Tenant, next: "suspend" | "activate") => {
    try {
      if (next === "suspend") await suspendMut.mutate(t.id);
      else await activateMut.mutate(t.id);
      toast(`Tenant ${next}d`, "success");
      tenants.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  return (
    <div>
      <DashboardHeader title="Client Management" subtitle="Tenants (accounting firms) using the platform" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card p-4"><p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Tenants</p><p className="text-2xl font-bold text-navy mt-1">{tenants.data?.length ?? "—"}</p></div>
          <div className="stat-card p-4"><p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Active</p><p className="text-2xl font-bold text-navy mt-1">{tenants.data?.filter((t) => t.status?.toUpperCase() === "ACTIVE").length ?? "—"}</p></div>
          <div className="stat-card p-4"><p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Suspended</p><p className="text-2xl font-bold text-navy mt-1">{tenants.data?.filter((t) => t.status?.toUpperCase() === "SUSPENDED").length ?? "—"}</p></div>
          <div className="stat-card p-4"><p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Countries</p><p className="text-2xl font-bold text-navy mt-1">{new Set(tenants.data?.map((t) => t.countryCode)).size || "—"}</p></div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-navy/8 rounded-xl px-3.5 py-2.5 w-72">
              <Search className="w-4 h-4 text-navy/30" />
              <input type="text" placeholder="Search tenants…" value={search} onChange={(e) => setSearch(e.target.value)} className="text-[13px] outline-none flex-1 bg-transparent" />
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-navy/8 rounded-xl p-1">
              {(["all", "ACTIVE", "SUSPENDED"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`text-[11px] font-medium px-3 py-1.5 rounded-lg capitalize ${filter === f ? "bg-navy text-white" : "text-navy/50 hover:text-navy"}`}>{f.toLowerCase()}</button>
              ))}
            </div>
          </div>
          <Button variant="primary" onClick={() => setAddModal(true)}><Plus className="w-3.5 h-3.5" /> Provision Tenant</Button>
        </div>

        <div className="grid gap-4">
            {list.map((t) => (
              <Card key={t.id}>
                <CardContent className="p-5 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-navy/8 to-gold/6 flex items-center justify-center"><Building2 className="w-6 h-6 text-navy/50" /></div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-[14px] font-semibold text-navy">{t.organizationName}</h3>
                        <Badge variant={t.status?.toUpperCase() === "ACTIVE" ? "success" : "error"} size="sm">{t.status}</Badge>
                        <span className="text-[10px] text-navy/45 font-mono">{t.subdomain}</span>
                      </div>
                      <div className="text-[11px] text-navy/50">{t.ownerEmail} · {t.countryCode} · {t.defaultCurrency} · {t.billingMode}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.status?.toUpperCase() === "ACTIVE" ? (
                      <Button variant="ghost" size="xs" onClick={() => setStatus(t, "suspend")}><Ban className="w-3 h-3 text-amber-500" /> Suspend</Button>
                    ) : (
                      <Button variant="ghost" size="xs" onClick={() => setStatus(t, "activate")}><PlayCircle className="w-3 h-3 text-emerald-500" /> Activate</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {list.length === 0 && <div className="text-center text-sm text-navy/40 py-12">No tenants match.</div>}
          </div>
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Provision New Tenant">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Organization name</label>
              <input value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Acme Financials" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Subdomain</label>
              <input value={form.subdomain} onChange={(e) => setForm({ ...form, subdomain: e.target.value.toLowerCase() })} className="w-full border rounded-xl px-3 py-2 text-sm font-mono" placeholder="acme" />
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Owner email</label>
            <input type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="owner@acme.com" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Country</label>
              <select value={form.countryCode} onChange={(e) => setForm({ ...form, countryCode: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm">
                {(countries.data ?? [{ code: "NG", name: "Nigeria" }]).map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Currency</label>
              <select value={form.defaultCurrency} onChange={(e) => setForm({ ...form, defaultCurrency: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm">
                {(currencies.data ?? [{ code: "NGN", name: "Naira" }]).map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Billing</label>
              <select value={form.billingMode} onChange={(e) => setForm({ ...form, billingMode: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm">
                <option>OPEN</option><option>MANAGED</option><option>TRIAL</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Timezone</label>
            <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm">
              {(timezones.data ?? ["Africa/Lagos", "UTC"]).map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={submit} disabled={provisionMut.loading}>
              {provisionMut.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : "Provision"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
