"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { platformApi, platformGodApi, type Tenant } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { useTenantAdmin } from "@/lib/tenant-admin-context";
import { PageLoader } from "@/components/ui/page-loader";
import {
  ArrowLeft, Building2, Users, Shield, Activity,
  Ban, PlayCircle, Mail, Calendar, Globe, DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useMutation } from "@/lib/api/hooks";
import { useToast } from "@/lib/toast";

export default function AdminTenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { enterTenant, activeTenantId } = useTenantAdmin();
  const [tab, setTab] = useState<"overview" | "users" | "roles">("overview");

  const tenants = useApi(() => platformApi.listTenants(), []);
  const users = useApi(() => platformGodApi.listUsers({ tenantId: id }), [id]);
  const roles = useApi(() => platformGodApi.tenantRoles(id), [id]);

  const suspendMut = useMutation(() => platformApi.suspend(id));
  const activateMut = useMutation(() => platformApi.activate(id));

  const tenant = tenants.data?.find((t) => t.id === id);

  const disableMut = useMutation((uid: string) => platformGodApi.disableUser(uid));
  const enableMut = useMutation((uid: string) => platformGodApi.enableUser(uid));

  const setStatus = async (next: "suspend" | "activate") => {
    try {
      if (next === "suspend") await suspendMut.mutate();
      else await activateMut.mutate();
      toast(`Tenant ${next}d`, "success");
      tenants.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  const toggleUser = async (uid: string, enabled: boolean) => {
    try {
      if (enabled) await disableMut.mutate(uid);
      else await enableMut.mutate(uid);
      toast(enabled ? "User disabled" : "User enabled", "success");
      users.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  if (tenants.loading) return <><DashboardHeader title="Tenant Detail" /><PageLoader message="Loading tenant…" /></>;

  if (!tenant) {
    return (
      <div>
        <DashboardHeader title="Tenant not found" />
        <div className="p-8">
          <Link href="/admin/clients" className="inline-flex items-center gap-1 text-xs text-navy/50 hover:text-navy">
            <ArrowLeft className="w-3 h-3" /> Back to tenants
          </Link>
        </div>
      </div>
    );
  }

  const isActive = tenant.status?.toUpperCase() === "ACTIVE";

  // Ensure tenant admin context is set
  if (activeTenantId !== id) {
    enterTenant(id, tenant.organizationName);
  }

  const TABS = [
    { key: "overview" as const, label: "Overview", icon: Building2 },
    { key: "users" as const, label: "Users", icon: Users },
    { key: "roles" as const, label: "Roles", icon: Shield },
  ];

  return (
    <div>
      <DashboardHeader title={tenant.organizationName} subtitle={`${tenant.subdomain} · ${tenant.countryCode ?? ""}`} />
      <div className="p-4 sm:p-6 lg:p-8">
        <Link href="/admin/clients" className="inline-flex items-center gap-1 text-xs text-navy/50 hover:text-navy mb-5">
          <ArrowLeft className="w-3 h-3" /> Back to tenants
        </Link>

        {/* Tenant header */}
        <div className="flex items-center gap-4 p-5 bg-white border border-navy/6 rounded-2xl shadow-sm mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy/10 to-gold/8 flex items-center justify-center text-navy font-bold text-xl">
            {tenant.organizationName?.[0] ?? "T"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h2 className="text-[16px] font-bold text-navy">{tenant.organizationName}</h2>
              <Badge variant={isActive ? "success" : "error"} size="sm">{tenant.status}</Badge>
              <span className="text-[11px] font-mono text-navy/40">{tenant.subdomain}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-navy/50 flex-wrap">
              {tenant.ownerEmail && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{tenant.ownerEmail}</span>}
              {tenant.countryCode && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{tenant.countryCode}</span>}
              {tenant.defaultCurrency && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{tenant.defaultCurrency}</span>}
              {tenant.billingMode && <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{tenant.billingMode}</span>}
              {tenant.createdAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Created {new Date(tenant.createdAt).toLocaleDateString()}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isActive ? (
              <Button variant="ghost" size="sm" onClick={() => setStatus("suspend")}>
                <Ban className="w-3.5 h-3.5 text-amber-500" /> Suspend
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setStatus("activate")}>
                <PlayCircle className="w-3.5 h-3.5" /> Activate
              </Button>
            )}
          </div>
        </div>

        {/* Tabs + content */}
        <div className="flex gap-6">
          <aside className="w-44 shrink-0">
            <nav className="bg-white border border-navy/6 rounded-2xl p-2 space-y-0.5 sticky top-6">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                    tab === key
                      ? "bg-gradient-to-r from-gold/10 to-navy/5 text-navy font-semibold border-l-[3px] border-l-gold"
                      : "text-navy/50 hover:bg-navy/3 hover:text-navy border-l-[3px] border-l-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab === key ? "text-gold" : "text-navy/30"}`} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0 space-y-5">
            {tab === "overview" && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Users", value: users.loading ? "…" : String(users.data?.length ?? 0), icon: Users },
                    { label: "Active Users", value: users.loading ? "…" : String(users.data?.filter(u => u.enabled).length ?? 0), icon: Activity },
                    { label: "Roles", value: roles.loading ? "…" : String(roles.data?.length ?? 0), icon: Shield },
                    { label: "Billing", value: tenant.billingMode ?? "—", icon: DollarSign },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="stat-card p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-navy/50" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-navy">{value}</p>
                        <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Card>
                  <CardHeader><CardTitle>Tenant Details</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: "Tenant ID", value: tenant.id },
                        { label: "Subdomain", value: tenant.subdomain },
                        { label: "Owner Email", value: tenant.ownerEmail ?? "—" },
                        { label: "Country", value: tenant.countryCode ?? "—" },
                        { label: "Currency", value: tenant.defaultCurrency ?? "—" },
                        { label: "Billing Mode", value: tenant.billingMode ?? "—" },
                        { label: "Status", value: tenant.status },
                        { label: "Created", value: tenant.createdAt ? new Date(tenant.createdAt).toLocaleString() : "—" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-semibold text-navy/40 uppercase tracking-wider">{label}</span>
                          <span className="text-[13px] font-medium text-navy font-mono">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {tab === "users" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tenant Users ({users.data?.length ?? 0})</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => users.refetch()}>Refresh</Button>
                </CardHeader>
                <CardContent className="p-0">
                  {users.loading ? (
                    <div className="flex items-center justify-center py-10 text-navy/40 text-sm">Loading…</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-navy/[0.02] border-b border-navy/6">
                          <tr>
                            <th className="text-left px-5 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">User</th>
                            <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Roles</th>
                            <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                            <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/4">
                          {(users.data ?? []).map((u) => (
                            <tr key={u.id} className="hover:bg-navy/[0.015] transition-colors">
                              <td className="px-5 py-3">
                                <p className="text-[13px] font-medium text-navy">{u.firstName} {u.lastName}</p>
                                <p className="text-[11px] text-navy/40">{u.email}</p>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                  {(u.roles ?? []).map((r) => (
                                    <span key={r} className="text-[10px] px-2 py-0.5 bg-navy/5 rounded-md font-medium text-navy/60">{r}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge variant={u.enabled ? "success" : "error"} size="sm">{u.enabled ? "Active" : "Disabled"}</Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => toggleUser(u.id, u.enabled)}
                                >
                                  {u.enabled ? <><Ban className="w-3 h-3 text-amber-500" /> Disable</> : <><PlayCircle className="w-3 h-3 text-emerald-500" /> Enable</>}
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {(users.data ?? []).length === 0 && (
                            <tr><td colSpan={4} className="text-center py-10 text-[13px] text-navy/30">No users found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {tab === "roles" && (
              <Card>
                <CardHeader><CardTitle>Tenant Roles</CardTitle></CardHeader>
                <CardContent>
                  {roles.loading ? (
                    <div className="text-navy/40 text-sm">Loading…</div>
                  ) : (
                    <div className="space-y-2">
                      {(roles.data ?? []).map((r) => (
                        <div key={r.id} className="flex items-center justify-between p-3.5 border border-navy/6 rounded-xl">
                          <div>
                            <p className="text-[13px] font-semibold text-navy">{r.name}</p>
                            {r.description && <p className="text-[11px] text-navy/45 mt-0.5">{r.description}</p>}
                          </div>
                          <span className="text-[10px] font-mono text-navy/30">{r.id.slice(0, 8)}…</span>
                        </div>
                      ))}
                      {(roles.data ?? []).length === 0 && (
                        <p className="text-center py-8 text-[13px] text-navy/30">No roles configured</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
