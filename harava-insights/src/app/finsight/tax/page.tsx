"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartCard, MetricBarChart } from "@/components/ui/charts";
import { useAuth } from "@/lib/auth";
import { useCompanyContext } from "@/lib/company-context";
import { dashboardApi, quickbooksApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { AlertTriangle, Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { formatMoney } from "@/lib/currency";

const REPORT_SLUGS = [
  { slug: "profit-loss", label: "Profit & Loss" },
  { slug: "trial-balance", label: "Trial Balance" },
  { slug: "general-ledger", label: "General Ledger" },
  { slug: "transaction-list", label: "Transaction List" },
] as const;

type TaxReportRow = {
  Summary?: { ColData?: { value?: string }[] };
  ColData?: { value?: string }[];
  Rows?: { Row?: TaxReportRow[] };
};

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
  const k = kpis.data as Record<string, unknown> | null;
  const currency = typeof k?.currency === "string" ? k.currency : undefined;
  const revenue = Number(k?.revenueThisMonth ?? k?.revenue ?? 0);
  const expenses = Number(k?.expensesThisMonth ?? k?.expenses ?? 0);
  const estTax = revenue > 0 ? (revenue - expenses) * 0.21 : 0; // rough 21% corp rate
  const taxChartData = [
    { name: "Revenue", amount: revenue },
    { name: "Expenses", amount: expenses },
    { name: "Est. tax", amount: Math.max(estTax, 0) },
  ];

  const insights = [
    {
      title: "Estimated Tax Liability",
      message: `Based on current P&L, estimated tax at 21% corp rate: ${formatMoney(estTax, currency)}. Consult your tax advisor for exact figures.`,
    },
    {
      title: "Profit & Loss Summary",
      message: `Revenue: ${formatMoney(revenue, currency)} · Expenses: ${formatMoney(expenses, currency)} · Net: ${formatMoney(revenue - expenses, currency)}`,
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
            <p className="text-2xl font-bold text-navy mt-1">{kpis.loading ? "—" : formatMoney(revenue, currency)}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Expenses (MTD)</p>
            <p className="text-2xl font-bold text-navy mt-1">{kpis.loading ? "—" : formatMoney(expenses, currency)}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Est. Tax Liability</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{kpis.loading ? "—" : formatMoney(estTax, currency)}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5">
          <ChartCard title="Tax position overview" subtitle="Current month from QuickBooks">
            {kpis.loading ? (
              <div className="h-56 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-navy/30" /></div>
            ) : (
              <MetricBarChart
                data={taxChartData}
                dataKeys={[{ key: "amount", label: "Amount", color: "#059669" }]}
                valuePrefix={currency ? `${currency} ` : ""}
                height={220}
                showLegend={false}
              />
            )}
          </ChartCard>

          <Card className="border-emerald-100 bg-emerald-50/35">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700/70">Estimated tax rate</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-navy">21%</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm"><span className="text-lg font-semibold">%</span></div>
              </div>
              <div className="mt-6 border-t border-emerald-200/70 pt-4">
                <p className="text-[12px] leading-5 text-navy/55">This planning estimate uses current month net profit. Confirm your final liability with a tax advisor.</p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Based on live figures</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Tax Insights */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tax Insights</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => kpis.refetch()} disabled={kpis.loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${kpis.loading ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {kpis.loading ? (
              <div className="flex items-center justify-center py-8 text-navy/40 text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…
              </div>
            ) : insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/70 border border-navy/5">
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
                <ReportCard key={slug} companyId={companyId} slug={slug} label={label} currency={currency} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportCard({ companyId, slug, label, currency }: { companyId: string; slug: string; label: string; currency?: string }) {
  const report = useApi(
    () => companyId ? dashboardApi.report(companyId, slug) : Promise.resolve(null),
    [companyId, slug], { skip: !companyId },
  );

  const d = report.data as Record<string, unknown> | null;
  const payload = taxReportPayload(d);
  const collectRows = (rows: TaxReportRow[] = []): TaxReportRow[] => rows.flatMap((row) => [row, ...collectRows(row.Rows?.Row)]);
  const entries = collectRows(payload?.Rows?.Row).flatMap((row) => {
    const cells = row.ColData ?? row.Summary?.ColData ?? [];
    const labelCell = cells[0]?.value;
    const valueCell = cells[cells.length - 1]?.value;
    return labelCell && valueCell && Number.isFinite(parseTaxAmount(valueCell))
      ? [{ label: labelCell, value: valueCell }]
      : [];
  });

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
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {entries.map(({ label: entryLabel, value }) => (
            <div key={entryLabel} className="flex items-center justify-between">
              <span className="text-[11px] text-navy/50 capitalize">{entryLabel}</span>
              <span className="text-[12px] font-semibold text-navy">{formatMoney(value, currency)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-navy/30">{companyId ? "No data" : "Connect QuickBooks"}</p>
      )}
    </div>
  );
}

function taxReportPayload(value: Record<string, unknown> | null) {
  if (!value) return null;
  const data = value.data as Record<string, unknown> | undefined;
  const candidates = [data?.data, value.data, data?.report, value.report, value];
  return candidates.find((candidate) => {
    if (!candidate || typeof candidate !== "object") return false;
    const item = candidate as Record<string, unknown>;
    return Boolean(item.Rows || item.Columns || item.Header);
  }) as { Header?: { Option?: { Name?: string; Value?: string }[] }; Rows?: { Row?: TaxReportRow[] } } | null ?? null;
}

function parseTaxAmount(value: unknown) {
  return Number(String(value).trim().replace(/[$,\s]/g, "").replace(/^\((.*)\)$/, "-$1"));
}
