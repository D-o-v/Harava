"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { useCompanyContext } from "@/lib/company-context";
import { dashboardApi, quickbooksApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";
import { CheckCircle, RefreshCw, AlertTriangle, Loader2, TrendingUp } from "lucide-react";
import { TrendChart, ChartCard } from "@/components/ui/charts";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function ReconciliationPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { selectedCompanyId, selectedCompanyQuickbooksConnected } = useCompanyContext();
  const companyId = selectedCompanyId ?? user?.companyId ?? "";

  const cashFlow = useApi(
    () => (companyId ? dashboardApi.cashFlow(companyId, 6) : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const qbStatus = useApi(
    () => (companyId ? quickbooksApi.status(companyId) : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const entities = useApi(
    () => (companyId ? quickbooksApi.entities(companyId) : Promise.resolve([])),
    [companyId], { skip: !companyId },
  );

  const cfPoints = (cashFlow.data as { points?: { period: string; inflow: number; outflow: number; net: number }[] } | null)?.points ?? [];
  const qb = qbStatus.data;
  const isQbConnected = qb?.connected === true || selectedCompanyQuickbooksConnected === true;
  const entityList = (entities.data as { slug: string; name: string; count: number }[] | null) ?? [];

  if (cashFlow.loading || qbStatus.loading) return <><DashboardHeader title="Reconciliation" subtitle="Bank reconciliation and account matching" /><PageLoader message="Loading reconciliation data…" /></>;
  if (cashFlow.error) return <><DashboardHeader title="Reconciliation" subtitle="Bank reconciliation and account matching" /><PageError message={cashFlow.error} onRetry={cashFlow.refetch} /></>;

  const syncPct = qb?.totalEntities
    ? Math.round(((qb.entitiesSynced ?? 0) / qb.totalEntities) * 100)
    : null;

  return (
    <div>
      <DashboardHeader title="Reconciliation" subtitle="Bank reconciliation and account matching" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* QB Sync Status */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] text-navy/40 uppercase tracking-wider font-medium">QB Connection</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isQbConnected ? "bg-emerald-500" : "bg-amber-400"}`} />
                <p className="text-[15px] font-bold text-navy">{isQbConnected ? "Connected" : "Disconnected"}</p>
              </div>
              {qb?.realmId && <p className="text-[11px] text-navy/35 mt-1">Realm: {qb.realmId}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] text-navy/40 uppercase tracking-wider font-medium">Last Sync</p>
              <p className="text-[15px] font-bold text-navy mt-2">
                {qb?.lastSyncAt ? new Date(qb.lastSyncAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
              </p>
              <p className="text-[11px] text-navy/35 mt-1">{qb?.syncState ?? "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] text-navy/40 uppercase tracking-wider font-medium">Entities Synced</p>
              <p className="text-[15px] font-bold text-navy mt-2">
                {qb?.entitiesSynced ?? 0} / {qb?.totalEntities ?? 0}
              </p>
              {syncPct != null && (
                <div className="mt-2">
                  <div className="h-1.5 bg-navy/8 rounded-full overflow-hidden">
                    <div className="h-full bg-navy rounded-full transition-all" style={{ width: `${syncPct}%` }} />
                  </div>
                  <p className="text-[10px] text-navy/35 mt-1">{syncPct}% complete</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cash Flow Chart */}
        <ChartCard
          title="Cash Flow Reconciliation"
          subtitle="Inflow vs outflow over 6 months"
          action={
            <Button variant="ghost" size="xs" onClick={() => cashFlow.refetch()} disabled={cashFlow.loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${cashFlow.loading ? "animate-spin" : ""}`} />
            </Button>
          }
        >
          {cfPoints.length > 0
              ? <TrendChart
                  data={cfPoints.map(p => ({ name: p.period, Inflow: p.inflow, Outflow: p.outflow, Net: p.net }))}
                  dataKeys={[
                    { key: "Inflow", label: "Inflow", color: "#182954" },
                    { key: "Outflow", label: "Outflow", color: "#C19B3F" },
                    { key: "Net", label: "Net", color: "#059669" },
                  ]}
                  valuePrefix="$"
                  height={260}
                />
              : <div className="h-64 flex items-center justify-center text-sm text-navy/30">
                  {companyId ? "No cash flow data available" : "Connect QuickBooks to view data"}
                </div>
          }
        </ChartCard>

        {/* QB Entities */}
        {entityList.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>QuickBooks Entities</CardTitle>
              <Badge variant="info" size="sm">{entityList.length} types</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {entityList.map((e) => (
                  <div key={e.slug} className="flex items-center justify-between p-3.5 border border-navy/5 rounded-xl">
                    <div>
                      <p className="text-[13px] font-medium text-navy capitalize">{e.name}</p>
                      <p className="text-[11px] text-navy/40 mt-0.5">{e.slug}</p>
                    </div>
                    <span className="text-[13px] font-bold text-navy">{e.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Month-End Checklist */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Month-End Close Status</CardTitle>
            <Button variant="primary" size="sm" onClick={() => toast("Running AI auto-reconciliation…", "info")}>
              <RefreshCw className="w-3.5 h-3.5" /> Auto-Reconcile
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { task: "Bank Reconciliation", status: isQbConnected ? "complete" : "pending" },
                { task: "AR Aging Review", status: "complete" },
                { task: "AP Verification", status: "in-progress" },
                { task: "Journal Entries", status: "pending" },
              ].map((item, i) => (
                <div key={i} className="p-4 border border-navy/5 rounded-xl text-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                    item.status === "complete" ? "bg-emerald-50" : item.status === "in-progress" ? "bg-amber-50" : "bg-navy/5"
                  }`}>
                    {item.status === "complete"
                      ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                      : item.status === "in-progress"
                        ? <TrendingUp className="w-5 h-5 text-amber-500" />
                        : <AlertTriangle className="w-5 h-5 text-navy/30" />
                    }
                  </div>
                  <Badge variant={item.status === "complete" ? "success" : item.status === "in-progress" ? "warning" : "default"} size="sm">
                    {item.status}
                  </Badge>
                  <p className="text-[12px] text-navy/60 mt-2 font-medium">{item.task}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
