"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { useCompanyContext } from "@/lib/company-context";
import { dashboardApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { MetricBarChart, ChartCard } from "@/components/ui/charts";
import { PageLoader } from "@/components/ui/page-loader";
import { formatMoney } from "@/lib/currency";
import {
  BarChart3, FileText, PieChart, Download, TrendingUp,
  DollarSign, Loader2, RefreshCw, CheckCircle2, ArrowUpRight,
} from "lucide-react";

const REPORT_TYPES = [
  { slug: "profit-loss", title: "Profit & Loss", desc: "Revenue, expenses & net income", icon: BarChart3 },
  { slug: "balance-sheet", title: "Balance Sheet", desc: "Assets, liabilities & equity", icon: FileText },
  { slug: "cash-flow", title: "Cash Flow", desc: "Operating, investing & financing", icon: PieChart },
  { slug: "aged-receivables", title: "Aged Receivables", desc: "Outstanding customer invoices", icon: DollarSign },
  { slug: "aged-payables", title: "Aged Payables", desc: "Outstanding vendor bills", icon: TrendingUp },
  { slug: "trial-balance", title: "Trial Balance", desc: "Debit and credit balances", icon: BarChart3 },
  { slug: "general-ledger", title: "General Ledger", desc: "Account activity and balances", icon: FileText },
  { slug: "transaction-list", title: "Transaction List", desc: "QuickBooks transaction register", icon: FileText },
];

type ReportColumn = { ColTitle?: string; MetaData?: { Name?: string; Value?: string }[] };
type ReportRow = { type?: string; group?: string; ColData?: { value?: string }[]; Rows?: { Row?: ReportRow[] }; Header?: { ColData?: { value?: string }[] }; Summary?: { ColData?: { value?: string }[] } };
type ReportPayload = { Rows?: { Row?: ReportRow[] }; Columns?: { Column?: ReportColumn[] }; Header?: { Currency?: string; Option?: { Name?: string; Value?: string }[] } };

function flattenRows(rows: ReportRow[] = [], section = ""): { row: ReportRow; section: string }[] {
  return rows.flatMap((row) => {
    const nextSection = row.Header?.ColData?.[0]?.value || section;
    const current = row.ColData || row.Summary?.ColData ? [{ row, section: nextSection }] : [];
    return [...current, ...flattenRows(row.Rows?.Row, nextSection)];
  });
}

function reportPayload(value: unknown): ReportPayload | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const data = record.data as Record<string, unknown> | undefined;
  const candidates = [record.data, data?.data, record.report, data?.report, value];
  return candidates.find((candidate) => {
    if (!candidate || typeof candidate !== "object") return false;
    const item = candidate as Record<string, unknown>;
    return Boolean(item.Rows || item.Columns || item.Header);
  }) as ReportPayload | undefined ?? null;
}

function rowCells(row: ReportRow) {
  return row.ColData ?? row.Summary?.ColData ?? [];
}

function reportNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return NaN;
  const normalized = String(value).trim().replace(/[$,\s]/g, "").replace(/^\((.*)\)$/, "-$1");
  return Number(normalized);
}

function formatReportValue(value: unknown, currency?: string) {
  if (value === undefined || value === null || value === "") return "—";
  const text = String(value).trim();
  const amount = reportNumber(text);
  return Number.isFinite(amount) ? formatMoney(amount, currency) : text;
}

export default function ReportsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { selectedCompanyId } = useCompanyContext();
  const companyId = selectedCompanyId ?? user?.companyId ?? "";
  const [active, setActive] = useState("profit-loss");

  const pnl = useApi(
    () => (companyId ? dashboardApi.report(companyId, "profit-loss") : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const cashFlow = useApi(
    () => (companyId ? dashboardApi.report(companyId, "cash-flow") : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const balanceSheet = useApi(
    () => (companyId ? dashboardApi.report(companyId, "balance-sheet") : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const receivables = useApi(
    () => (companyId ? dashboardApi.report(companyId, "aged-receivables") : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const payables = useApi(
    () => (companyId ? dashboardApi.report(companyId, "aged-payables") : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const sales = useApi(
    () => (companyId ? dashboardApi.report(companyId, "trial-balance") : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );

  const expenses = useApi(
    () => (companyId ? dashboardApi.report(companyId, "general-ledger") : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );
  const inventory = useApi(
    () => (companyId ? dashboardApi.report(companyId, "transaction-list") : Promise.resolve(null)),
    [companyId], { skip: !companyId },
  );

  const dataMap: Record<string, { data: unknown; loading: boolean; error: string | null; refetch: () => Promise<void> }> = {
    "profit-loss": pnl, "cash-flow": cashFlow, "balance-sheet": balanceSheet,
    "aged-receivables": receivables, "aged-payables": payables, "trial-balance": sales,
    "general-ledger": expenses, "transaction-list": inventory,
  };

  const current = dataMap[active];
  const d = current?.data as Record<string, unknown> | null;

  if (current?.loading && !d) return <><DashboardHeader title="Financial Reports" subtitle="Generate and view financial statements" /><PageLoader message="Loading report…" /></>;

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

    const payload = reportPayload(d);
    const currency = payload?.Header?.Currency;
    const columns = payload?.Columns?.Column ?? [];
    const rows = flattenRows(payload?.Rows?.Row);
    const columnCount = Math.max(columns.length, ...rows.map(({ row }) => rowCells(row).length), 1);
    const noReportData = payload?.Header?.Option?.some((option) => option.Name === "NoReportData" && option.Value === "true");
    if (rows.length === 0) return <div className="h-64 flex flex-col items-center justify-center gap-2 text-center"><p className="text-sm font-medium text-navy/60">{noReportData ? "No transactions for this period" : "No data available for this period"}</p><p className="text-xs text-navy/35">Try refreshing or select another report.</p></div>;
    const chartData = rows.map(({ row }, index) => {
      const cells = rowCells(row);
      const label = String(cells[0]?.value ?? `Row ${index + 1}`).slice(0, 16);
      const amount = reportNumber(cells[cells.length - 1]?.value);
      return { name: label, amount: Number.isFinite(amount) ? amount : 0 };
    }).filter((item) => item.amount !== 0).slice(0, 8);
    return (
      <div className="space-y-5">
        {chartData.length > 0 && <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3"><MetricBarChart data={chartData} dataKeys={[{ key: "amount", label: "Amount", color: "#059669" }]} valuePrefix={currency ? `${currency} ` : ""} height={190} showLegend={false} /></div>}
        <div className="overflow-x-auto"><table className="w-full min-w-max text-sm"><thead className="bg-emerald-50/60 border-b border-emerald-100"><tr>{Array.from({ length: columnCount }, (_, index) => <th key={index} className={`px-4 py-3 text-[11px] font-semibold text-emerald-900/55 uppercase tracking-wider whitespace-nowrap ${index > 0 ? "text-right" : "text-left"}`}>{columns[index]?.ColTitle || (index === 0 ? "Description" : "Value")}</th>)}</tr></thead><tbody className="divide-y divide-navy/4">{rows.map(({ row, section }, index) => { const cells = rowCells(row); return <tr key={index} className="hover:bg-emerald-50/40">{Array.from({ length: columnCount }, (_, cellIndex) => { const cell = cells[cellIndex]; return <td key={cellIndex} className={`px-4 py-3 text-[12px] whitespace-nowrap ${cellIndex === 0 ? "font-medium text-navy" : "text-navy/70 text-right"}`}>{cellIndex === 0 && section ? <span className="mr-4 text-navy/40">{section}</span> : null}{formatReportValue(cell?.value, currency)}</td>; })}</tr>; })}</tbody></table></div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="Financial Reports" subtitle="Generate and view financial statements" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-white px-5 py-5 sm:px-7 sm:py-6">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Connected reporting</div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-navy sm:text-2xl">A clearer view of your company&apos;s money.</h2>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-navy/55">Explore live statements and account activity from QuickBooks in one focused workspace.</p>
          </div>
          <ArrowUpRight className="absolute -right-2 -top-5 h-36 w-36 rotate-12 text-emerald-100/80" strokeWidth={1} aria-hidden="true" />
        </div>

        {d && <ReportSummary data={d} />}

        {/* Report type selector */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <aside className="w-full lg:w-56 shrink-0 bg-white border border-emerald-100 rounded-xl p-2 shadow-sm">
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-navy/35">Reports</p>
            <nav className="space-y-0.5">
          {REPORT_TYPES.map(({ slug, title, icon: Icon }) => (
            <button
              key={slug}
              onClick={() => setActive(slug)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                active === slug ? "bg-emerald-700 text-white shadow-sm" : "text-navy/60 hover:bg-emerald-50 hover:text-emerald-900"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active === slug ? "text-emerald-100" : "text-navy/35"}`} />
              <span className="text-[12px] font-medium">{title}</span>
            </button>
          ))}
            </nav>
          </aside>

          <div className="min-w-0 flex-1 w-full">
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
          </div>
        </div>

      </div>
    </div>
  );
}

function ReportSummary({ data }: { data: Record<string, unknown> }) {
  const payload = reportPayload(data);
  const currency = payload?.Header?.Currency;
  const rows = flattenRows(payload?.Rows?.Row);
  const highlights = rows.map(({ row }) => {
    const cells = rowCells(row);
    const label = cells[0]?.value;
    const value = cells[cells.length - 1]?.value;
    return label && value !== undefined && Number.isFinite(reportNumber(value)) ? { label, value } : null;
  }).filter((entry): entry is { label: string; value: string } => Boolean(entry)).filter(({ label }) => /total income|total expenses|gross profit|net earnings|total assets|total liabilities|total shareholders|net cash|cash equivalents at end|total/i.test(label)).slice(0, 4);
  if (!highlights.length) return null;
  return <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{highlights.map(({ label, value }) => <Card key={label} className="border-emerald-100"><CardContent className="p-5"><p className="text-[11px] text-emerald-700/65 uppercase tracking-wider font-medium">{label}</p><p className="text-2xl font-bold text-navy mt-1">{formatMoney(value, currency)}</p></CardContent></Card>)}</div>;
}
