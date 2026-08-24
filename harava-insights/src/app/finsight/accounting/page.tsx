"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCompanyContext } from "@/lib/company-context";
import { companiesApi, quickbooksApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { RefreshCw } from "lucide-react";
import { PageLoader, PageError } from "@/components/ui/page-loader";
import { formatMoney } from "@/lib/currency";
import { ChartCard, MetricBarChart } from "@/components/ui/charts";

const ENTITY_TABS = [
  { slug: "invoices", label: "Invoices" },
  { slug: "bills", label: "Bills" },
  { slug: "payments", label: "Payments" },
  { slug: "bill-payments", label: "Bill Payments" },
  { slug: "purchases", label: "Purchases" },
  { slug: "journal-entries", label: "Journal Entries" },
] as const;

type Slug = typeof ENTITY_TABS[number]["slug"];

function dateStr(v: unknown) {
  if (!v) return "—";
  try { return new Date(String(v)).toLocaleDateString(); } catch { return String(v); }
}

type Column = { key: string; label: string; value: (row: Record<string, unknown>) => unknown; amount?: boolean; date?: boolean };

function refValue(row: Record<string, unknown>, key: string) {
  const ref = row[key] as { name?: string; value?: string } | undefined;
  return ref?.name ?? ref?.value ?? "—";
}

const COLUMNS: Record<Slug, Column[]> = {
  invoices: [
    { key: "date", label: "Date", value: (r) => r.TxnDate, date: true },
    { key: "number", label: "Invoice", value: (r) => r.DocNumber },
    { key: "customer", label: "Customer", value: (r) => refValue(r, "CustomerRef") },
    { key: "total", label: "Total", value: (r) => r.TotalAmt, amount: true },
    { key: "balance", label: "Balance", value: (r) => r.Balance, amount: true },
  ],
  bills: [
    { key: "date", label: "Date", value: (r) => r.TxnDate, date: true },
    { key: "number", label: "Bill", value: (r) => r.DocNumber },
    { key: "vendor", label: "Vendor", value: (r) => refValue(r, "VendorRef") },
    { key: "total", label: "Total", value: (r) => r.TotalAmt, amount: true },
    { key: "balance", label: "Balance", value: (r) => r.Balance, amount: true },
  ],
  payments: [
    { key: "date", label: "Date", value: (r) => r.TxnDate, date: true },
    { key: "customer", label: "Customer", value: (r) => refValue(r, "CustomerRef") },
    { key: "total", label: "Amount", value: (r) => r.TotalAmt, amount: true },
    { key: "unapplied", label: "Unapplied", value: (r) => r.UnappliedAmt, amount: true },
  ],
  "bill-payments": [
    { key: "date", label: "Date", value: (r) => r.TxnDate, date: true },
    { key: "vendor", label: "Vendor", value: (r) => refValue(r, "VendorRef") },
    { key: "total", label: "Amount", value: (r) => r.TotalAmt, amount: true },
    { key: "type", label: "Payment type", value: (r) => r.PayType },
  ],
  purchases: [
    { key: "date", label: "Date", value: (r) => r.TxnDate, date: true },
    { key: "vendor", label: "Vendor", value: (r) => refValue(r, "EntityRef") },
    { key: "total", label: "Amount", value: (r) => r.TotalAmt, amount: true },
    { key: "type", label: "Payment type", value: (r) => r.PaymentType },
  ],
  "journal-entries": [
    { key: "date", label: "Date", value: (r) => r.TxnDate, date: true },
    { key: "number", label: "Entry", value: (r) => r.DocNumber },
    { key: "total", label: "Amount", value: (r) => r.TotalAmt, amount: true },
    { key: "adjustment", label: "Adjustment", value: (r) => r.Adjustment },
  ],
};

export default function AccountingPage() {
  const { user } = useAuth();
  const { selectedCompanyId } = useCompanyContext();
  const companyId = selectedCompanyId ?? user?.companyId ?? "";
  const [slug, setSlug] = useState<Slug>("invoices");
  const company = useApi(() => companyId ? companiesApi.get(companyId) : Promise.resolve(null), [companyId], { skip: !companyId });

  const data = useApi(
    () => companyId ? quickbooksApi.list(companyId, slug, 0, 50) : Promise.resolve(null),
    [companyId, slug],
    { skip: !companyId },
  );

  const rows = (data.data?.items ?? data.data?.content ?? []) as Record<string, unknown>[];
  const rowCurrency = rows.find((row) => {
    const reference = row.CurrencyRef as { value?: string } | undefined;
    return Boolean(reference?.value);
  })?.CurrencyRef as { value?: string } | undefined;
  const currency = company.data?.currency ?? rowCurrency?.value;

  if (data.loading) return <><DashboardHeader title="Accounting" subtitle="Live transaction data from QuickBooks" /><PageLoader message="Loading transactions…" /></>;
  if (data.error) return <><DashboardHeader title="Accounting" subtitle="Live transaction data from QuickBooks" /><PageError message={data.error} onRetry={data.refetch} /></>;

  const columns = COLUMNS[slug];
  const totalAmount = rows.reduce((sum, row) => sum + (Number(row.TotalAmt) || 0), 0);
  const outstanding = rows.reduce((sum, row) => sum + (Number(row.Balance) || 0), 0);
  const chartData = rows.slice(0, 8).map((row, index) => ({
    name: String(row.DocNumber ?? row.Id ?? index + 1),
    amount: Number(row.TotalAmt) || 0,
  }));

  return (
    <div>
      <DashboardHeader title="Accounting" subtitle="Live transaction data from QuickBooks" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {!companyId && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            No company linked. Connect a QuickBooks company from the Clients page.
          </div>
        )}

        {/* Entity navigation */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
        <aside className="w-full lg:w-56 shrink-0 bg-white border border-navy/6 rounded-xl p-2">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-navy/35">QuickBooks data</p>
          <nav className="space-y-0.5">
          {ENTITY_TABS.map((t) => (
            <button
              key={t.slug}
              onClick={() => setSlug(t.slug)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left text-[12px] font-medium transition-all ${
                slug === t.slug ? "bg-navy text-white shadow-sm" : "text-navy/50 hover:text-navy hover:bg-navy/5"
              }`}
            >
              {t.label}
            </button>
          ))}
          </nav>
          <Button variant="ghost" size="sm" className="w-full justify-start mt-2" onClick={() => data.refetch()} disabled={data.loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${data.loading ? "animate-spin" : ""}`} />
            Refresh data
          </Button>
        </aside>
        <div className="min-w-0 flex-1 w-full">

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Records</p>
            <p className="text-2xl font-bold text-navy mt-1">{data.data?.total ?? data.data?.totalElements ?? "—"}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Loaded Records</p>
            <p className="text-2xl font-bold text-navy mt-1">{rows.length}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Page Total</p>
            <p className="text-[15px] font-bold text-navy mt-1">{formatMoney(totalAmount, currency)}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Outstanding</p>
            <p className="text-[15px] font-bold text-amber-600 mt-1">{formatMoney(outstanding, currency)}</p>
          </div>
        </div>

        <div className="mb-6">
          <ChartCard title={`${slug.replace("-", " ")} activity`} subtitle="Largest records on this page">
            {chartData.length > 0 ? <MetricBarChart data={chartData} dataKeys={[{ key: "amount", label: "Amount", color: "#182954" }]} valuePrefix={currency ? `${currency} ` : ""} height={190} showLegend={false} /> : <div className="h-48 flex items-center justify-center text-sm text-navy/30">No financial activity to chart</div>}
          </ChartCard>
        </div>

        {/* Table */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="capitalize">{slug.replace("-", " ")}</CardTitle>
            <Badge variant="default" size="sm">{data.data?.total ?? data.data?.totalElements ?? 0} total</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {rows.length === 0 ? (
              <div className="text-center py-12 text-[13px] text-navy/30">
                {companyId ? "No records found." : "Connect QuickBooks to view data."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-navy/2 border-b border-navy/6">
                    <tr>
                      {columns.map((column) => (
                        <th key={column.key} className="text-left px-5 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider whitespace-nowrap">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/4">
                    {rows.map((row, i) => (
                      <tr key={String(row.Id ?? i)} className="hover:bg-navy/1.5 transition-colors">
                        {columns.map((column) => {
                          const v = column.value(row);
                          return (
                            <td key={column.key} className="px-5 py-3 text-[12px] text-navy/70 whitespace-nowrap">
                              {column.amount ? formatMoney(v, currency) : column.date ? dateStr(v) : typeof v === "object" ? JSON.stringify(v).slice(0, 40) : String(v ?? "—")}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
        </div>
      </div>
    </div>
  );
}
