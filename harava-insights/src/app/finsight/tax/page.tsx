"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCompanyContext } from "@/lib/company-context";
import { dashboardApi, quickbooksApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { AlertTriangle, Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";

function fmt(n: unknown) {
  const v = Number(n);
  if (isNaN(v)) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toLocaleString()}`;
}

const REPORT_SLUGS = [
  { slug: "profit-loss", label: "Profit & Loss" },
  { slug: "trial-balance", label: "Trial Balance" },
  { slug: "general-ledger", label: "General Ledger" },
  { slug: "transaction-list", label: "Transaction List" },
] as const;

export default function TaxPage() {
  const { user } = useAuth();
  const { selectedCompanyId, selectedCompanyQuickbooksConnected } = useCompanyContext();
  const companyId = selectedCompanyId ?? user?.companyId ?? "";

  const qbStatus = useApi(
    () => companyId ? quickbooksApi.status(companyId) : Promise.resolve(null),
    [companyId], { skip: !companyId },
  );
  const isConnected = qbStatus.data?.connected === true || selectedCompanyQuickbooksConnected === true;
  const isConfirmedDisconnected = selectedCompanyQuickbooksConnected === false && qbStatus.data?.connected === false;

  const kpis = useApi(
    () => companyId ? dashboardApi.kpis(companyId) : Promise.resolve(null),
    [companyId], { skip: !companyId },
  );
  const pnl = useApi(
    () => companyId ? dashboardApi.report(companyId, "profit-loss") : Promise.resolve(null),
    [companyId], { skip: !companyId },
  );

  const k = kpis.data as Record<string, unknown> | null;
  const revenue = Number(k?.revenueThisMonth ?? k?.revenue ?? 0);
  const expenses = Number(k?.expensesThisMonth ?? k?.expenses ?? 0);
  const estTax = revenue > 0 ? (revenue - expenses) * 0.21 : 0; // rough 21% corp rate

  const insights = [
    {
      title: "Estimated Tax Liability",
      message: `Based on current P&L, estimated tax at 21% corp rate: ${fmt(estTax)}. Consult your tax advisor for exact figures.`,
    },
    {
      title: "Profit & Loss Summary",
      message: `Revenue: ${fmt(revenue)} · Expenses: ${fmt(expenses)} · Net: ${fmt(revenue - expenses)}`,
    },
  ];

  return (
    <div>
      <DashboardHeader title="Tax & Compliance" subtitle="Tax insights and financial reports from QuickBooks" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {!companyId && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" /> No company linked. Go to Clients to connect a QuickBooks company.
          </div>
        )}
        {companyId && isConnected && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
            <Wifi className="w-4 h-4" /> QuickBooks connected
            {qbStatus.data?.lastSyncAt && <span className="text-emerald-600">· Last sync {new Date(qbStatus.data.lastSyncAt).toLocaleDateString()}</span>}
          </div>
        )}
        {companyId && isConfirmedDisconnected && !qbStatus.loading && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-center gap-2">
            <WifiOff className="w-4 h-4" /> QuickBooks not connected for this company.
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Revenue (MTD)</p>
            <p className="text-2xl font-bold text-navy mt-1">{kpis.loading ? "—" : fmt(revenue)}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Expenses (MTD)</p>
            <p className="text-2xl font-bold text-navy mt-1">{kpis.loading ? "—" : fmt(expenses)}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Est. Tax Liability</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{kpis.loading ? "—" : fmt(estTax)}</p>
          </div>
        </div>

        {/* AI Tax Insights */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tax Insights</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => kpis.refetch()} disabled={kpis.loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${kpis.loading ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {kpis.loading ? (
              <div className="flex items-center justify-center py-8 text-navy/40 text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…
              </div>
            ) : insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-navy/[0.015] border border-navy/5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-navy">{ins.title}</p>
                  <p className="text-[12px] text-navy/50 mt-0.5 leading-relaxed">{ins.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* QB Reports */}
        <Card>
          <CardHeader><CardTitle>QuickBooks Reports</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {REPORT_SLUGS.map(({ slug, label }) => (
                <ReportCard key={slug} companyId={companyId} slug={slug} label={label} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportCard({ companyId, slug, label }: { companyId: string; slug: string; label: string }) {
  const report = useApi(
    () => companyId ? dashboardApi.report(companyId, slug) : Promise.resolve(null),
    [companyId, slug], { skip: !companyId },
  );

  const d = report.data as Record<string, unknown> | null;
  const entries = d ? Object.entries(d).filter(([, v]) => typeof v === "number").slice(0, 3) : [];

  return (
    <div className="p-4 border border-navy/6 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold text-navy">{label}</p>
        <Button variant="ghost" size="xs" onClick={() => report.refetch()} disabled={report.loading}>
          <RefreshCw className={`w-3 h-3 ${report.loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      {report.loading ? (
        <div className="flex items-center gap-2 text-[12px] text-navy/40">
          <Loader2 className="w-3 h-3 animate-spin" /> Loading…
        </div>
      ) : report.error ? (
        <p className="text-[11px] text-red-500">{report.error}</p>
      ) : entries.length > 0 ? (
        <div className="space-y-1.5">
          {entries.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[11px] text-navy/50 capitalize">{k.replace(/([A-Z])/g, " $1").trim()}</span>
              <span className="text-[12px] font-semibold text-navy">{fmt(v)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-navy/30">{companyId ? "No data" : "Connect QuickBooks"}</p>
      )}
    </div>
  );
}
