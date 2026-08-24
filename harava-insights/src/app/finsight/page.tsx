"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCompanyContext } from "@/lib/company-context";
import { dashboardApi, quickbooksApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import {
  TrendingUp, DollarSign, Receipt, Clock, ArrowRight,
  ArrowUpRight, ArrowDownRight, Sparkles, AlertTriangle,
  CheckCircle, Loader2, Wifi, WifiOff,
} from "lucide-react";
import { TrendChart, MetricBarChart, DonutChart, ChartCard } from "@/components/ui/charts";
import { PageLoader } from "@/components/ui/page-loader";

function fmt(n: number, currency?: string) {
  if (!currency) return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0, notation: "compact" }).format(n);
}

function pct(a: number, b: number) {
  if (!b) return null;
  const v = ((a - b) / b) * 100;
  return { value: Math.abs(v).toFixed(1), up: v >= 0 };
}

export default function FinSightDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedCompanyId, selectedCompanyQuickbooksConnected, isCompanyContextReady } = useCompanyContext();
  const companyId = selectedCompanyId ?? user?.companyId ?? "";

  const kpis = useApi(
    () => (companyId ? dashboardApi.kpis(companyId) : Promise.resolve(null)),
    [companyId],
    { skip: !companyId },
  );
  const pnl = useApi(
    () => (companyId ? dashboardApi.pnl(companyId, 6) : Promise.resolve(null)),
    [companyId],
    { skip: !companyId },
  );
  const cashFlow = useApi(
    () => (companyId ? dashboardApi.cashFlow(companyId, 6) : Promise.resolve(null)),
    [companyId],
    { skip: !companyId },
  );
  const expenses = useApi(
    () => (companyId ? dashboardApi.expenses(companyId, 1) : Promise.resolve(null)),
    [companyId],
    { skip: !companyId },
  );
  const activity = useApi(
    () => (companyId ? dashboardApi.activity(companyId, 5) : Promise.resolve([])),
    [companyId],
    { skip: !companyId },
  );
  const qbStatus = useApi(
    () => (companyId ? quickbooksApi.status(companyId) : Promise.resolve(null)),
    [companyId],
    { skip: !companyId },
  );

  const k = kpis.data as Record<string, number> | null;
  const pnlData = pnl.data as { trend?: { period: string; revenue: number; expenses: number; net: number }[]; currency?: string } | null;
  const cashFlowData = cashFlow.data as { trend?: { period: string; inflow: number; outflow: number; net: number }[]; currency?: string } | null;
  const expensesData = expenses.data as { byCategory?: { name: string; amount: number }[]; currency?: string } | null;
  const pnlPoints = pnlData?.trend ?? [];
  const cfPoints = cashFlowData?.trend ?? [];
  const expBreakdown = expensesData?.byCategory ?? [];
  const activityItems = (activity.data as { type?: string; reference?: string | null; party?: string | null; amount?: number; date?: string }[] | null) ?? [];
  const currency = (k?.currency as string | undefined) ?? pnlData?.currency ?? cashFlowData?.currency ?? expensesData?.currency;

  const revenue = k?.revenueThisMonth ?? k?.revenue ?? 0;
  const expTotal = k?.expensesThisMonth ?? k?.expenses ?? 0;
  const netIncome = k?.netProfitThisMonth ?? k?.netIncome ?? revenue - expTotal;
  const cashPos = k?.cashOnHand ?? k?.cashPosition ?? k?.cash ?? 0;

  const revPct = pct(revenue, k?.revenueLastMonth ?? 0);
  const expPct = pct(expTotal, k?.expensesLastMonth ?? 0);
  const netPct = pct(netIncome, k?.netProfitLastMonth ?? 0);

  const isLoading = kpis.loading || pnl.loading;
  const noCompany = !companyId;

  // Platform admin with no company selected → send to clients picker
  if (isCompanyContextReady && !isLoading && noCompany && user?.scope === "platform") {
    router.replace("/finsight/clients");
    return null;
  }
  const qbRaw = qbStatus.data as Record<string, unknown> | null;
  const isQbConnected = qbRaw?.connected === true || String(qbRaw?.status).toUpperCase() === "CONNECTED" || selectedCompanyQuickbooksConnected === true;
  const isConfirmedDisconnected = selectedCompanyQuickbooksConnected === false && !isQbConnected;
  const qbLastSync = (qbRaw?.lastSyncAt ?? qbRaw?.lastSyncedAt) as string | undefined;

  if (isLoading) return <><DashboardHeader title={`Welcome back, ${user?.firstName || "User"}`} subtitle="Here's your financial overview" /><PageLoader message="Loading financial data…" /></>;

  const COLORS = ["#182954", "#C19B3F", "#4A9EFF", "#059669", "#64748b", "#f59e0b"];

  return (
    <div>
      <DashboardHeader
        title={`Welcome back, ${user?.firstName || "User"}`}
        subtitle="Here's your financial overview"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* QB connection banner */}
        {qbStatus.data && (isQbConnected || isConfirmedDisconnected) && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${
            isQbConnected
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}>
            {isQbConnected
              ? <><Wifi className="w-4 h-4" /> QuickBooks connected{qbLastSync ? ` · Last sync ${new Date(qbLastSync).toLocaleDateString()}` : ""}</>
              : <><WifiOff className="w-4 h-4" /> QuickBooks not connected — <button className="underline ml-1" onClick={() => router.push("/finsight/clients")}>connect now</button></>
            }
          </div>
        )}

        {noCompany && user?.scope !== "platform" && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border bg-navy/4 border-navy/8 text-navy/60">
            <AlertTriangle className="w-4 h-4 text-gold" />
            No client selected. <button className="underline ml-1 font-semibold text-navy" onClick={() => router.push("/finsight/clients")}>Go to Clients to select a company</button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 stagger-children">
          {[
            { label: "Revenue (MTD)", value: revenue, pct: revPct, icon: DollarSign, href: "/finsight/reports" },
            { label: "Expenses (MTD)", value: expTotal, pct: expPct, icon: Receipt, href: "/finsight/accounting", invert: true },
            { label: "Net Income", value: netIncome, pct: netPct, icon: TrendingUp, href: "/finsight/reports" },
            { label: "Cash Position", value: cashPos, pct: null, icon: Clock, href: "/finsight/reports" },
          ].map(({ label, value, pct: p, icon: Icon, href, invert }) => (
            <div key={label} className="stat-card p-5 cursor-pointer group" onClick={() => router.push(href)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">{label}</p>
                  {isLoading
                    ? <p className="text-2xl font-bold text-navy mt-2 tracking-tight">—</p>
                    : <p className="text-2xl font-bold text-navy mt-2 tracking-tight">{fmt(value, currency)}</p>
                  }
                  {p && !isLoading && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                        (p.up && !invert) || (!p.up && invert) ? "text-navy bg-navy/5" : "text-red-600 bg-red-50"
                      }`}>
                        {p.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {p.value}%
                      </span>
                      <span className="text-[11px] text-navy/35">vs last month</span>
                    </div>
                  )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-navy/50" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue & Expense Trends */}
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <ChartCard
              title="Revenue vs Expenses"
              subtitle="6-month trend"
              action={<Button variant="ghost" size="xs" onClick={() => router.push("/finsight/reports")}>Details <ArrowRight className="w-3 h-3" /></Button>}
            >
              {pnl.loading
                ? <div className="h-64 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-navy/30" /></div>
                : <TrendChart
                    data={pnlPoints.map(p => ({ name: p.period, revenue: p.revenue, expenses: p.expenses }))}
                    dataKeys={[
                      { key: "revenue", label: "Revenue", color: "#182954" },
                      { key: "expenses", label: "Expenses", color: "#C19B3F" },
                    ]}
                    valuePrefix={currency ? `${currency} ` : ""}
                    height={260}
                  />
              }
            </ChartCard>
          </div>

          <ChartCard title="Expense Breakdown" subtitle="Current month">
            {expenses.loading
              ? <div className="h-56 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-navy/30" /></div>
              : expBreakdown.length > 0
                ? <DonutChart
                    data={expBreakdown.map((e, i) => ({ name: e.name, value: e.amount, color: COLORS[i % COLORS.length] }))}
                    centerValue={fmt(expTotal, currency)}
                    centerLabel="Total"
                    height={220}
                    innerRadius={55}
                    outerRadius={85}
                  />
                : <div className="h-56 flex items-center justify-center text-sm text-navy/30">No expense data available</div>
            }
          </ChartCard>
        </div>

        {/* Cash Flow */}
        <ChartCard
          title="Monthly Cash Flow"
          subtitle="Net income trend"
          action={<Button variant="ghost" size="xs" onClick={() => router.push("/finsight/reports")}>Financial reports <ArrowRight className="w-3 h-3" /></Button>}
        >
          {cashFlow.loading
            ? <div className="h-56 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-navy/30" /></div>
            : <MetricBarChart
                data={cfPoints.map(p => ({ name: p.period, inflow: p.inflow, outflow: p.outflow }))}
                dataKeys={[
                  { key: "inflow", label: "Inflow", color: "#182954" },
                  { key: "outflow", label: "Outflow", color: "#d4b366" },
                ]}
                valuePrefix={currency ? `${currency} ` : ""}
                height={220}
              />
          }
        </ChartCard>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="xs" onClick={() => router.push("/finsight/accounting")}>
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {activity.loading
                ? <div className="flex items-center justify-center py-10"><Loader2 className="w-4 h-4 animate-spin text-navy/30" /></div>
                : activityItems.length > 0
                  ? <div className="divide-y divide-navy/4">
                      {activityItems.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between px-6 py-3.5 hover:bg-navy/1.5 cursor-pointer transition-colors" onClick={() => router.push("/finsight/accounting")}>
                          <div>
                            <p className="text-[13px] font-medium text-navy">{tx.party ?? tx.type ?? "Transaction"}{tx.reference ? ` · #${tx.reference}` : ""}</p>
                            <p className="text-[11px] text-navy/35 mt-0.5">{tx.date ? new Date(tx.date).toLocaleDateString() : "—"}</p>
                          </div>
                          {tx.amount != null && (
                            <span className={`text-[13px] font-semibold ${(tx.type ?? "").toLowerCase().includes("invoice") || (tx.type ?? "").toLowerCase().includes("receipt") ? "text-navy" : "text-red-500"}`}>
                              {tx.type === "Invoice" || tx.type === "Sales Receipt" ? "+" : "-"}{fmt(Math.abs(tx.amount ?? 0), currency)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  : <div className="py-10 text-center text-sm text-navy/30">No activity available</div>
              }
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "View Financial Reports", sub: "Income, balance sheet, cash flow", href: "/finsight/reports", badge: null },
                { label: "Manage Clients", sub: "Connect & manage QuickBooks companies", href: "/finsight/clients", badge: isQbConnected ? "Connected" : isConfirmedDisconnected ? "Setup needed" : "Checking connection" },
                { label: "AI Intelligence", sub: "Insights, anomalies & forecasts", href: "/finsight/ai-intelligence", badge: "New" },
                { label: "Financial News", sub: "Latest business & market headlines", href: "/finsight/news", badge: null },
              ].map((item) => (
                <div key={item.href} className="flex items-center justify-between p-3.5 border border-navy/5 rounded-xl hover:border-navy/10 hover:bg-navy/1 transition-all cursor-pointer" onClick={() => router.push(item.href)}>
                  <div>
                    <p className="text-[13px] font-medium text-navy">{item.label}</p>
                    <p className="text-[11px] text-navy/40 mt-0.5">{item.sub}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && <Badge variant={item.badge === "Connected" ? "success" : item.badge === "New" ? "info" : "warning"} size="sm">{item.badge}</Badge>}
                    <ArrowRight className="w-3.5 h-3.5 text-navy/25" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-gold/60 via-gold-light/40 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
              </div>
              <CardTitle>AI Insights</CardTitle>
            </div>
            <Button variant="ghost" size="xs" onClick={() => router.push("/finsight/ai-intelligence")}>
              View All <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Unusual Expense Detected", message: "Marketing spend is 34% above 3-month average. Review recommended.", severity: "warning" },
                { title: "Cash Flow Forecast", message: "Projected cash position dips in 2 weeks. Consider delaying non-essential payments.", severity: "warning" },
                { title: "Month-End Ready", message: "All reconciliations complete. 98% of transactions categorized automatically.", severity: "success" },
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-3.5 p-4 rounded-xl bg-navy/1.5 border border-navy/4 cursor-pointer hover:bg-navy/2.5 hover:border-navy/7 transition-all" onClick={() => router.push("/finsight/ai-intelligence")}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${insight.severity === "warning" ? "bg-amber-50" : "bg-navy/5"}`}>
                    {insight.severity === "warning"
                      ? <AlertTriangle className="w-4 h-4 text-amber-500" />
                      : <CheckCircle className="w-4 h-4 text-gold" />
                    }
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-navy">{insight.title}</p>
                    <p className="text-[12px] text-navy/45 mt-0.5 leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
