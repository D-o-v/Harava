"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { dashboardApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { TrendChart, MetricBarChart, ChartCard } from "@/components/ui/charts";
import { PageLoader, PageError } from "@/components/ui/page-loader";
import {
  BarChart3, FileText, PieChart, Download, TrendingUp,
  DollarSign, Loader2, RefreshCw,
} from "lucide-react";

const REPORT_TYPES = [
  { slug: "pnl", title: "Income Statement", desc: "Revenue, expenses & net income", icon: BarChart3 },
  { slug: "balance-sheet", title: "Balance Sheet", desc: "Assets, liabilities & equity", icon: FileText },
  { slug: "cash-flow", title: "Cash Flow", desc: "Operating, investing & financing", icon: PieChart },
  { slug: "receivables", title: "Receivables", desc: "Outstanding customer invoices", icon: DollarSign },
  { slug: "payables", title: "Payables", desc: "Outstanding vendor bills", icon: TrendingUp },
  { slug: "sales", title: "Sales Report", desc: "Revenue by period & category", icon: BarChart3 },
  { slug: "expenses", title: "Expenses", desc: "Expense breakdown by category", icon: PieChart },
  { slug: "inventory", title: "Inventory", desc: "Stock levels and valuation", icon: FileText },
];

function fmt(n: unknown) {
  const v = Number(n);
  if (isNaN(v)) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toLocaleString()}`;
}

export default function ReportsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const companyId = user?.companyId ?? "";
  const [active, setActive] = useState("pnl");

  const pnl = useApi(
    () => (companyId ? dashboardApi.pnl(companyId, 12) : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const cashFlow = useApi(
    () => (companyId ? dashboardApi.cashFlow(companyId, 12) : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const balanceSheet = useApi(
    () => (companyId ? dashboardApi.balanceSheet(companyId) : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const receivables = useApi(
    () => (companyId ? dashboardApi.receivables(companyId) : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const payables = useApi(
    () => (companyId ? dashboardApi.payables(companyId) : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const sales = useApi(
    () => (companyId ? dashboardApi.sales(companyId, 12) : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );

  const expenses = useApi(
    () => (companyId ? dashboardApi.expenses(companyId, 12) : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const inventory = useApi(
    () => (companyId ? dashboardApi.inventory(companyId) : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );

  const dataMap: Record<string, { data: unknown; loading: boolean; error: string | null; refetch: () => Promise<void> }> = {
    pnl, "cash-flow": cashFlow, "balance-sheet": balanceSheet,
    receivables, payables, sales, expenses, inventory,
  };

  const current = dataMap[active];
  const d = current?.data as Record<string, unknown> | null;

  if (pnl.loading && active === "pnl") return <><DashboardHeader title="Financial Reports" subtitle="Generate and view financial statements" /><PageLoader message="Loading reports…" /></>;

  function renderChart() {
    if (current?.loading) return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-navy/30" />
      </div>
    );
    if (current?.error) return (
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-500">{current.error}</p>
        <Button variant="outline" size="sm" onClick={() => current.refetch()}>Retry</Button>
      </div>
    );
    if (!d) return (
      <div className="h-64 flex items-center justify-center text-sm text-navy/30">
        {companyId ? "No data available" : "Connect a QuickBooks company to view reports"}
      </div>
    );

    if (active === "pnl") {
      const points = (d.points as { period: string; revenue: number; costs: number; net: number }[]) ?? [];
      return (
        <TrendChart
          data={points.map(p => ({ name: p.period, Revenue: p.revenue, Expenses: p.costs, Net: p.net }))}
          dataKeys={[
            { key: "Revenue", label: "Revenue", color: "#182954" },
            { key: "Expenses", label: "Expenses", color: "#C19B3F" },
            { key: "Net", label: "Net Income", color: "#059669" },
          ]}
          valuePrefix="$"
          height={280}
        />
      );
    }
    if (active === "cash-flow") {
      const points = (d.points as { period: string; inflow: number; outflow: number; net: number }[]) ?? [];
      return (
        <MetricBarChart
          data={points.map(p => ({ name: p.period, Inflow: p.inflow, Outflow: p.outflow }))}
          dataKeys={[
            { key: "Inflow", label: "Inflow", color: "#182954" },
            { key: "Outflow", label: "Outflow", color: "#d4b366" },
          ]}
          valuePrefix="$"
          height={280}
        />
      );
    }
    if (active === "sales") {
      const points = (d.points as { period: string; amount: number }[]) ?? [];
      return (
        <MetricBarChart
          data={points.map(p => ({ name: p.period, Sales: p.amount }))}
          dataKeys={[{ key: "Sales", label: "Sales", color: "#182954" }]}
          valuePrefix="$"
          height={280}
        />
      );
    }

    // Balance sheet / receivables / payables — show key metrics
    const entries = Object.entries(d).filter(([, v]) => typeof v === "number");
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
        {entries.map(([key, val]) => (
          <div key={key} className="p-4 rounded-xl bg-navy/[0.02] border border-navy/5">
            <p className="text-[11px] text-navy/40 uppercase tracking-wider font-medium">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </p>
            <p className="text-xl font-bold text-navy mt-1">{fmt(val)}</p>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="col-span-full text-sm text-navy/30 text-center py-8">No data available</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="Financial Reports" subtitle="Generate and view financial statements" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Report type selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {REPORT_TYPES.map(({ slug, title, desc, icon: Icon }) => (
            <button
              key={slug}
              onClick={() => setActive(slug)}
              className={`p-4 rounded-xl border text-left transition-all ${
                active === slug
                  ? "border-navy bg-navy text-white shadow-md"
                  : "border-navy/8 bg-white hover:border-navy/20 hover:shadow-sm"
              }`}
            >
              <Icon className={`w-4 h-4 mb-2 ${active === slug ? "text-gold" : "text-navy/40"}`} />
              <p className={`text-[12px] font-semibold leading-tight ${active === slug ? "text-white" : "text-navy"}`}>{title}</p>
              <p className={`text-[10px] mt-0.5 leading-tight ${active === slug ? "text-white/60" : "text-navy/40"}`}>{desc}</p>
            </button>
          ))}
        </div>

        {/* Active report */}
        <ChartCard
          title={REPORT_TYPES.find(r => r.slug === active)?.title ?? "Report"}
          subtitle={companyId ? "Live data from QuickBooks" : "Connect QuickBooks to see live data"}
          action={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="xs" onClick={() => current?.refetch()} disabled={current?.loading}>
                <RefreshCw className={`w-3.5 h-3.5 ${current?.loading ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="outline" size="xs" onClick={() => toast(`Exporting ${REPORT_TYPES.find(r => r.slug === active)?.title}…`, "info")}>
                <Download className="w-3.5 h-3.5" /> Export
              </Button>
            </div>
          }
        >
          {renderChart()}
        </ChartCard>

        {/* Summary KPIs for PnL */}
        {active === "pnl" && d && (
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Total Revenue", key: "totalRevenue" },
              { label: "Total Expenses", key: "totalCosts" },
              { label: "Net Profit", key: "netProfit" },
            ].map(({ label, key }) => (
              <Card key={key}>
                <CardContent className="p-5">
                  <p className="text-[11px] text-navy/40 uppercase tracking-wider font-medium">{label}</p>
                  <p className="text-2xl font-bold text-navy mt-1">{fmt(d[key])}</p>
                  {d[`${key}Change`] != null && (
                    <Badge variant={(d[`${key}Change`] as number) >= 0 ? "success" : "error"} size="sm" className="mt-2">
                      {(d[`${key}Change`] as number) >= 0 ? "+" : ""}{fmt(d[`${key}Change`])} vs last period
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}


      </div>
    </div>
  );
}
