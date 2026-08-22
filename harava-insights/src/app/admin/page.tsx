"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { platformApi, platformGodApi, accountApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import {
  Users, Shield, Settings, Activity,
  ArrowRight, BarChart3,
  Building2, Key, Wallet, FileText, AlertTriangle,
  CheckCircle, Server, TrendingUp,
  Cpu, CreditCard, ShieldCheck, GraduationCap, Loader2,
} from "lucide-react";
import { TrendChart, DonutChart, ChartCard } from "@/components/ui/charts";
import { PageLoader, PageError } from "@/components/ui/page-loader";

export default function AdminDashboard() {
  const router = useRouter();

  const tenants = useApi(() => platformApi.listTenants(), []);
  const users = useApi(() => platformGodApi.listUsers(), []);
  const audit = useApi(() => accountApi.audit({ page: 0, size: 20 }), []);

  const isLoading = tenants.loading || users.loading || audit.loading;
  const pageError = tenants.error || users.error || audit.error;

  const tenantList = tenants.data ?? [];
  const userList = users.data ?? [];
  const auditEvents = (audit.data?.content ?? []) as Array<Record<string, unknown>>;

  const activeTenants = tenantList.filter((t) => t.status?.toUpperCase() === "ACTIVE").length;
  const suspendedTenants = tenantList.filter((t) => t.status?.toUpperCase() === "SUSPENDED").length;
  const activeUsers = userList.filter((u) => u.enabled).length;

  const recentAudit = auditEvents.slice(0, 8);

  const moduleStatus = [
    { name: "FinSight AI", icon: BarChart3, status: "operational", health: 99.9 },
    { name: "AccrediAI", icon: ShieldCheck, status: "operational", health: 99.8 },
    { name: "ProEd AI", icon: GraduationCap, status: "operational", health: 100 },
  ];

  const pendingActions = [
    { title: "Manage staff roles", href: "/admin/roles", icon: Key, priority: "high" },
    { title: "Review billing", href: "/admin/billing", icon: CreditCard, priority: "medium" },
    { title: "Payroll review", href: "/admin/payroll", icon: Wallet, priority: "high" },
    { title: "IoT devices", href: "/admin/iot", icon: Cpu, priority: "low" },
    { title: "Quarterly compliance report", href: "/admin/reports", icon: FileText, priority: "medium" },
  ];

  const stats = [
    { label: "Total Tenants", value: tenants.loading ? "…" : String(tenantList.length), icon: Building2, href: "/admin/clients" },
    { label: "Active Tenants", value: tenants.loading ? "…" : String(activeTenants), icon: TrendingUp, href: "/admin/clients" },
    { label: "Suspended", value: tenants.loading ? "…" : String(suspendedTenants), icon: AlertTriangle, href: "/admin/clients" },
    { label: "Total Users", value: users.loading ? "…" : String(userList.length), icon: Users, href: "/admin/users" },
    { label: "Active Users", value: users.loading ? "…" : String(activeUsers), icon: Activity, href: "/admin/users" },
    { label: "Audit Events", value: audit.loading ? "…" : String(audit.data?.totalElements ?? 0), icon: Shield, href: "/admin/audit" },
  ];

  if (isLoading) return <><DashboardHeader title="Admin Command Center" subtitle="Full platform oversight and control" /><PageLoader message="Loading platform data…" /></>;
  if (pageError) return <><DashboardHeader title="Admin Command Center" subtitle="Full platform oversight and control" /><PageError message={pageError} onRetry={() => { tenants.refetch(); users.refetch(); audit.refetch(); }} /></>;

  return (
    <div>
      <DashboardHeader title="Admin Command Center" subtitle="Full platform oversight and control" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 stagger-children">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="stat-card p-4 cursor-pointer group" onClick={() => router.push(stat.href)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-bold text-navy mt-1.5 tracking-tight">{stat.value}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-4 h-4 text-navy/50" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tenant breakdown + Module Status */}
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <ChartCard
              title="Tenant Status Breakdown"
              subtitle="Active vs suspended tenants"
              action={<Button variant="ghost" size="xs" onClick={() => router.push("/admin/clients")}>View All <ArrowRight className="w-3 h-3" /></Button>}
            >
              <TrendChart
                  data={tenantList.slice(0, 12).map((t, i) => ({
                    name: t.subdomain?.slice(0, 8) ?? `T${i}`,
                    active: t.status?.toUpperCase() === "ACTIVE" ? 1 : 0,
                    suspended: t.status?.toUpperCase() === "SUSPENDED" ? 1 : 0,
                  }))}
                  dataKeys={[
                    { key: "active", label: "Active", color: "#059669" },
                    { key: "suspended", label: "Suspended", color: "#C19B3F" },
                  ]}
                  height={240}
                />
            </ChartCard>
          </div>

          <ChartCard title="Tenant Distribution" subtitle="By status">
            <DonutChart
                data={[
                  { name: "Active", value: activeTenants || 1, color: "#059669" },
                  { name: "Suspended", value: suspendedTenants || 0, color: "#C19B3F" },
                ]}
                centerValue={String(tenantList.length)}
                centerLabel="Total"
                height={210}
                innerRadius={50}
                outerRadius={80}
              />
          </ChartCard>
        </div>

        {/* Module Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Server className="w-4 h-4 text-gold" /> Module Status
            </CardTitle>
            <Button variant="ghost" size="xs" onClick={() => router.push("/admin/health")}>
              System Health <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {moduleStatus.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div key={mod.name} className="p-4 rounded-xl border border-navy/6 hover:border-gold/15 hover:shadow-md transition-all duration-300 bg-white dark:bg-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-navy/60" />
                        </div>
                        <p className="text-[13px] font-semibold text-navy">{mod.name}</p>
                      </div>
                      <Badge variant="success" size="sm">Live</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-navy/6 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-linear-to-r from-navy to-navy-light" style={{ width: `${mod.health}%` }} />
                      </div>
                      <span className="text-[11px] font-semibold text-navy/60">{mod.health}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Live Audit Feed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Live Audit Feed</CardTitle>
              <Button variant="ghost" size="xs" onClick={() => router.push("/admin/audit")}>
                Audit Log <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-navy/4 max-h-80 overflow-y-auto">
                  {recentAudit.length > 0 ? recentAudit.map((e, i) => (
                    <div key={String(e.id ?? i)} className="flex items-center gap-3 px-6 py-3 hover:bg-navy/[0.015] transition-colors">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${String(e.outcome) === "SUCCESS" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-navy truncate">{String(e.eventType ?? "—")}</p>
                        <p className="text-[10px] text-navy/35 mt-0.5">{String(e.actorEmail ?? e.actorUserId ?? "—")}</p>
                      </div>
                      <span className="text-[10px] text-navy/30 shrink-0">
                        {e.occurredAt ? new Date(String(e.occurredAt)).toLocaleTimeString() : "—"}
                      </span>
                    </div>
                  )) : (
                    <div className="text-center py-10 text-[13px] text-navy/30">No audit events</div>
                  )}
                </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Pending Actions
              </CardTitle>
              <Badge variant="warning" size="sm">{pendingActions.length} pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.href}
                      className="flex items-center gap-3.5 p-3.5 rounded-xl border border-navy/5 hover:border-gold/15 hover:bg-navy/[0.01] cursor-pointer transition-all duration-200"
                      onClick={() => router.push(item.href)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.priority === "high" ? "bg-red-50" : item.priority === "medium" ? "bg-amber-50" : "bg-navy/5"}`}>
                        <Icon className={`w-4 h-4 ${item.priority === "high" ? "text-red-500" : item.priority === "medium" ? "text-amber-500" : "text-navy/50"}`} />
                      </div>
                      <p className="text-[12px] font-medium text-navy flex-1">{item.title}</p>
                      <Badge variant={item.priority === "high" ? "error" : item.priority === "medium" ? "warning" : "default"} size="sm">
                        {item.priority}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Manage Users", desc: "Add, edit, suspend users", icon: Users, href: "/admin/users" },
            { title: "Roles & Permissions", desc: "Configure access control", icon: Key, href: "/admin/roles" },
            { title: "Client Tenants", desc: "Manage accounting firms", icon: Building2, href: "/admin/clients" },
            { title: "Run Payroll", desc: "Process employee payments", icon: Wallet, href: "/admin/payroll" },
            { title: "IoT Dashboard", desc: "Monitor connected devices", icon: Cpu, href: "/admin/iot" },
            { title: "Generate Reports", desc: "Custom report builder", icon: FileText, href: "/admin/reports" },
            { title: "Security Center", desc: "Threats & compliance", icon: Shield, href: "/admin/security" },
            { title: "System Settings", desc: "Platform configuration", icon: Settings, href: "/admin/settings" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.href}
                className="group relative p-5 rounded-2xl border border-navy/6 bg-white dark:bg-white/5 hover:border-gold/20 hover:shadow-(--shadow-card-hover) transition-all duration-300 cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-gold/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-navy/50" />
                  </div>
                  <p className="text-[13px] font-semibold text-navy">{action.title}</p>
                  <p className="text-[11px] text-navy/40 mt-0.5">{action.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
