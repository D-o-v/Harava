"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCompanyContext } from "@/lib/company-context";
import { quickbooksApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { RefreshCw, Loader2 } from "lucide-react";
import { PageLoader, PageError } from "@/components/ui/page-loader";

const ENTITY_TABS = [
  { slug: "invoices", label: "Invoices" },
  { slug: "bills", label: "Bills" },
  { slug: "payments", label: "Payments" },
  { slug: "bill-payments", label: "Bill Payments" },
  { slug: "purchases", label: "Purchases" },
  { slug: "journal-entries", label: "Journal Entries" },
] as const;

type Slug = typeof ENTITY_TABS[number]["slug"];

function fmt(n: unknown) {
  const v = Number(n);
  if (isNaN(v)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);
}

function dateStr(v: unknown) {
  if (!v) return "—";
  try { return new Date(String(v)).toLocaleDateString(); } catch { return String(v); }
}

export default function AccountingPage() {
  const { user } = useAuth();
  const { selectedCompanyId } = useCompanyContext();
  const companyId = selectedCompanyId ?? user?.companyId ?? "";
  const [slug, setSlug] = useState<Slug>("invoices");

  const data = useApi(
    () => companyId ? quickbooksApi.list(companyId, slug, 0, 50) : Promise.resolve(null),
    [companyId, slug],
    { skip: !companyId },
  );

  const rows = (data.data?.content ?? []) as Record<string, unknown>[];

  if (data.loading) return <><DashboardHeader title="Accounting" subtitle="Live transaction data from QuickBooks" /><PageLoader message="Loading transactions…" /></>;
  if (data.error) return <><DashboardHeader title="Accounting" subtitle="Live transaction data from QuickBooks" /><PageError message={data.error} onRetry={data.refetch} /></>;

  // Derive columns from first row keys, capped at 6
  const cols = rows.length > 0
    ? Object.keys(rows[0]).filter(k => !["Id", "SyncToken", "MetaData", "Line", "LinkedTxn", "CustomField"].includes(k)).slice(0, 6)
    : [];

  return (
    <div>
      <DashboardHeader title="Accounting" subtitle="Live transaction data from QuickBooks" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {!companyId && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            No company linked. Connect a QuickBooks company from the Clients page.
          </div>
        )}

        {/* Entity tabs */}
        <div className="flex items-center gap-1 bg-white border border-navy/8 rounded-xl p-1 flex-wrap">
          {ENTITY_TABS.map((t) => (
            <button
              key={t.slug}
              onClick={() => setSlug(t.slug)}
              className={`text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all ${
                slug === t.slug ? "bg-navy text-white shadow-sm" : "text-navy/50 hover:text-navy hover:bg-navy/5"
              }`}
            >
              {t.label}
            </button>
          ))}
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => data.refetch()} disabled={data.loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${data.loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Records</p>
            <p className="text-2xl font-bold text-navy mt-1">{data.data?.totalElements ?? "—"}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">This Page</p>
            <p className="text-2xl font-bold text-navy mt-1">{rows.length}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Entity</p>
            <p className="text-[15px] font-bold text-navy mt-1 capitalize">{slug.replace("-", " ")}</p>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="capitalize">{slug.replace("-", " ")}</CardTitle>
            <Badge variant="default" size="sm">{data.data?.totalElements ?? 0} total</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {rows.length === 0 ? (
              <div className="text-center py-12 text-[13px] text-navy/30">
                {companyId ? "No records found." : "Connect QuickBooks to view data."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-navy/[0.02] border-b border-navy/6">
                    <tr>
                      {cols.map((c) => (
                        <th key={c} className="text-left px-5 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider whitespace-nowrap">
                          {c.replace(/([A-Z])/g, " $1").trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/4">
                    {rows.map((row, i) => (
                      <tr key={String(row.Id ?? i)} className="hover:bg-navy/[0.015] transition-colors">
                        {cols.map((c) => {
                          const v = row[c];
                          const isAmt = c.toLowerCase().includes("amount") || c.toLowerCase().includes("balance") || c.toLowerCase().includes("total");
                          const isDate = c.toLowerCase().includes("date") || c.toLowerCase().includes("time");
                          return (
                            <td key={c} className="px-5 py-3 text-[12px] text-navy/70 whitespace-nowrap">
                              {isAmt ? fmt(v) : isDate ? dateStr(v) : typeof v === "object" ? JSON.stringify(v).slice(0, 40) : String(v ?? "—")}
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
  );
}
