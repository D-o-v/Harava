"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCompanyContext } from "@/lib/company-context";
import { dashboardApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { Sparkles, TrendingUp, AlertTriangle, Send, Loader2, RefreshCw } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { formatMoney } from "@/lib/currency";

export default function AiIntelligencePage() {
  const { user } = useAuth();
  const { selectedCompanyId } = useCompanyContext();
  const companyId = selectedCompanyId ?? user?.companyId ?? "";
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<{ q: string; a: string }[]>([]);

  const kpis = useApi(
    () => companyId ? dashboardApi.kpis(companyId) : Promise.resolve(null),
    [companyId], { skip: !companyId },
  );
  const receivables = useApi(
    () => companyId ? dashboardApi.receivables(companyId) : Promise.resolve(null),
    [companyId], { skip: !companyId },
  );
  const payables = useApi(
    () => companyId ? dashboardApi.payables(companyId) : Promise.resolve(null),
    [companyId], { skip: !companyId },
  );
  const activity = useApi(
    () => companyId ? dashboardApi.activity(companyId, 10) : Promise.resolve([]),
    [companyId], { skip: !companyId },
  );

  if (kpis.loading && !kpis.data) return <><DashboardHeader title="AI Intelligence" subtitle="AI-powered financial analytics and anomaly detection" /><PageLoader message="Loading intelligence data…" /></>;

  const k = kpis.data as Record<string, unknown> | null;
  const currency = typeof k?.currency === "string" ? k.currency : undefined;
  const r = receivables.data as Record<string, unknown> | null;
  const p = payables.data as Record<string, unknown> | null;
  const acts = (activity.data as Record<string, unknown>[] | null) ?? [];

  // Build insight cards from live KPI data
  const insights: { title: string; message: string; severity: "warning" | "info" }[] = [];
  if (k) {
    const revenue = Number(k.revenueThisMonth ?? k.revenue ?? 0);
    const expenses = Number(k.expensesThisMonth ?? k.expenses ?? 0);
    const margin = revenue > 0 ? ((revenue - expenses) / revenue) * 100 : null;
    if (margin !== null && margin < 15) insights.push({ title: "Low Profit Margin", message: `Current margin is ${margin.toFixed(1)}% — below the 15% benchmark. Review expense categories.`, severity: "warning" });
    if (margin !== null && margin >= 15) insights.push({ title: "Healthy Margin", message: `Profit margin is ${margin.toFixed(1)}% — on track. Revenue: ${formatMoney(revenue, currency)}, Expenses: ${formatMoney(expenses, currency)}.`, severity: "info" });
  }
  if (r) {
    const overdue = Number(r.overdueAmount ?? r.over90 ?? 0);
    if (overdue > 0) insights.push({ title: "Overdue Receivables", message: `${formatMoney(overdue, currency)} in overdue invoices. DSO: ${r.dso ?? "—"} days. Follow up recommended.`, severity: "warning" });
  }
  if (p) {
    const due = Number(p.dueThisWeek ?? p.currentAmount ?? 0);
    if (due > 0) insights.push({ title: "Payables Due Soon", message: `${formatMoney(due, currency)} in bills due this week. DPO: ${p.dpo ?? "—"} days.`, severity: "info" });
  }
  if (insights.length === 0 && !kpis.loading) {
    insights.push({ title: "No Anomalies Detected", message: "All financial metrics are within normal ranges.", severity: "info" });
  }

  // Build predictions from KPI data
  const predictions = k ? [
    { metric: "Revenue (MTD)", value: formatMoney(k.revenueThisMonth ?? k.revenue, currency), label: "Current" },
    { metric: "Expenses (MTD)", value: formatMoney(k.expensesThisMonth ?? k.expenses, currency), label: "Current" },
    { metric: "Cash Position", value: formatMoney(k.cashPosition ?? k.cash, currency), label: "Current" },
    { metric: "Net Profit", value: formatMoney(k.netProfitThisMonth ?? k.netIncome, currency), label: "Current" },
  ] : [];

  const handleAsk = () => {
    if (!query.trim()) return;
    const context = k
      ? `Revenue: ${formatMoney(k.revenueThisMonth ?? k.revenue, currency)}, Expenses: ${formatMoney(k.expensesThisMonth ?? k.expenses, currency)}, Cash: ${formatMoney(k.cashPosition ?? k.cash, currency)}.`
      : "No financial data loaded yet.";
    setResponses((prev) => [...prev, {
      q: query,
      a: `Based on your current data — ${context} For deeper analysis, review the Reports section or connect your QuickBooks account.`,
    }]);
    setQuery("");
  };

  return (
    <div>
      <DashboardHeader title="AI Intelligence" subtitle="AI-powered financial analytics and anomaly detection" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {!companyId && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            No company linked. Connect a QuickBooks company to see live insights.
          </div>
        )}

        {/* Ask AI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" /> Ask AI About Your Finances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text" value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Ask anything about your financial data…"
                className="flex-1 border border-navy/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gold/40"
              />
              <Button variant="primary" onClick={handleAsk} disabled={!query.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {responses.length > 0 && (
              <div className="mt-4 space-y-3">
                {responses.map((r, i) => (
                  <div key={i} className="border border-navy/6 rounded-xl p-3.5">
                    <p className="text-[11px] text-navy/40 mb-1">Q: {r.q}</p>
                    <p className="text-[13px] text-navy/80">{r.a}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Live Insights / Anomalies */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Live Insights
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { kpis.refetch(); receivables.refetch(); payables.refetch(); }} disabled={kpis.loading}>
                <RefreshCw className={`w-3.5 h-3.5 ${kpis.loading ? "animate-spin" : ""}`} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {kpis.loading ? (
                <div className="flex items-center justify-center py-8 text-navy/40 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…
                </div>
              ) : insights.map((ins, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 border border-navy/5 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ins.severity === "warning" ? "bg-amber-50" : "bg-navy/5"}`}>
                    <AlertTriangle className={`w-4 h-4 ${ins.severity === "warning" ? "text-amber-500" : "text-navy/30"}`} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-navy">{ins.title}</p>
                    <p className="text-[12px] text-navy/50 mt-0.5 leading-relaxed">{ins.message}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Live KPI Snapshot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold" /> Financial Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {kpis.loading ? (
                <div className="flex items-center justify-center py-8 text-navy/40 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…
                </div>
              ) : predictions.length === 0 ? (
                <p className="text-[13px] text-navy/30 text-center py-6">Connect QuickBooks to see live metrics.</p>
              ) : predictions.map((pred, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 border border-navy/5 rounded-xl">
                  <p className="text-[13px] font-medium text-navy">{pred.metric}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-navy/50">{pred.label}</span>
                    <Badge variant="info" size="sm">{pred.value}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {acts.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-navy/4">
                {acts.map((a, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-[13px] font-medium text-navy">{String(a.description ?? a.type ?? "Activity")}</p>
                      <p className="text-[11px] text-navy/40 mt-0.5">
                        {a.occurredAt ? new Date(String(a.occurredAt)).toLocaleString() : "—"}
                      </p>
                    </div>
                    {a.amount != null && (
                      <span className="text-[13px] font-semibold text-navy">{formatMoney(a.amount, currency)}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
