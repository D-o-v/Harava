"use client";

import { use, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import {
  Loader2, ArrowLeft, Link2, Unlink, RefreshCw,
  LayoutDashboard, TrendingUp, Waves, Scale, ArrowDownLeft,
  ArrowUpRight as ArrowUpRightIcon, ShoppingCart, Receipt,
  Zap, Users, Wallet, CheckCircle, XCircle, Play, Download, Plus,
} from "lucide-react";
import Link from "next/link";
import { companiesApi, dashboardApi, payrollApi, quickbooksApi, rolesApi, type PayrollEmployee, type PayrollRun } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { TrendChart, MetricBarChart, DonutChart, ChartCard, MetricLineChart } from "@/components/ui/charts";
import { formatMoney } from "@/lib/currency";

const SIDEBAR_ITEMS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "pnl", label: "P&L", icon: TrendingUp },
  { key: "cashflow", label: "Cash Flow", icon: Waves },
  { key: "balance", label: "Balance Sheet", icon: Scale },
  { key: "ar", label: "Receivables", icon: ArrowDownLeft },
  { key: "ap", label: "Payables", icon: ArrowUpRightIcon },
  { key: "sales", label: "Sales", icon: ShoppingCart },
  { key: "expenses", label: "Expenses", icon: Receipt },
  { key: "payroll", label: "Payroll", icon: Wallet },
  { key: "quickbooks", label: "QuickBooks", icon: Zap },
  { key: "users", label: "Users", icon: Users },
] as const;
type TabKey = typeof SIDEBAR_ITEMS[number]["key"];

const QB_ENTITIES = [
  "accounts","customers","vendors","employees","items","invoices","bills","payments","bill-payments",
  "sales-receipts","credit-memos","estimates","purchase-orders","deposits","transfers","journal-entries",
];

function fmt(n: unknown, currency?: string) {
  const v = Number(n);
  return formatMoney(v, currency, 0);
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tab, setTab] = useState<TabKey>("overview");
  const { toast } = useToast();
  const { can } = useAuth();

  const company = useApi(() => companiesApi.get(id), [id]);
  const qbStatus = useApi(() => quickbooksApi.status(id), [id]);

  const reconnectMut = useMutation(() => quickbooksApi.reconnect(id));
  const disconnectMut = useMutation(() => quickbooksApi.disconnect(id));

  const isConnected = qbStatus.data?.connected === true || company.data?.quickbooksConnected === true;

  return (
    <div>
      <DashboardHeader title={company.data?.name ?? "Client"} subtitle={company.data?.externalRef ?? ""} />
      <div className="p-4 sm:p-6 lg:p-8">
        <Link href="/finsight/clients" className="inline-flex items-center gap-1 text-xs text-navy/50 hover:text-navy mb-5">
          <ArrowLeft className="w-3 h-3" /> Back to clients
        </Link>

        {/* Company header card */}
        <div className="flex items-center gap-4 p-5 bg-white border border-navy/6 rounded-2xl shadow-sm mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy/10 to-gold/8 flex items-center justify-center text-navy font-bold text-xl">
            {company.data?.name?.[0] ?? "C"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-[16px] font-bold text-navy">{company.data?.name ?? "—"}</h2>
              <Badge variant={company.data?.status?.toUpperCase() === "ACTIVE" ? "success" : "error"} size="sm">{company.data?.status}</Badge>
              {isConnected && <Badge variant="info" size="sm">QuickBooks Connected</Badge>}
            </div>
            <p className="text-[12px] text-navy/45 mt-0.5">
              {qbStatus.data?.lastSyncAt ? `Last sync: ${new Date(qbStatus.data.lastSyncAt).toLocaleString()}` : "QuickBooks not synced"}
            </p>
          </div>
        </div>

        {/* Layout: sidebar + content */}
        <div className="flex gap-6">
          {/* Sidebar nav */}
          <aside className="w-52 shrink-0">
            <nav className="bg-white border border-navy/6 rounded-2xl p-2 space-y-0.5 sticky top-6">
              {SIDEBAR_ITEMS.filter(({ key }) => {
                if (key === "quickbooks") return can(PERMISSIONS.QUICKBOOKS_READ);
                if (key === "users") return can(PERMISSIONS.COMPANY_USER_READ);
                if (key === "payroll") return can(PERMISSIONS.PAYROLL_READ);
                return can(PERMISSIONS.INSIGHTS_VIEW);
              }).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                    tab === key
                      ? "bg-gradient-to-r from-gold/10 to-navy/5 text-navy font-semibold border-l-[3px] border-l-gold"
                      : "text-navy/50 hover:bg-navy/3 hover:text-navy border-l-[3px] border-l-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${tab === key ? "text-gold" : "text-navy/30"}`} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-5">
            {tab === "overview" && <OverviewTab companyId={id} currency={company.data?.currency} />}
            {tab === "pnl" && <PnlTab companyId={id} currency={company.data?.currency} />}
            {tab === "cashflow" && <CashFlowTab companyId={id} currency={company.data?.currency} />}
            {tab === "balance" && <BalanceTab companyId={id} currency={company.data?.currency} />}
            {tab === "ar" && <ArTab companyId={id} currency={company.data?.currency} />}
            {tab === "ap" && <ApTab companyId={id} currency={company.data?.currency} />}
            {tab === "sales" && <SalesTab companyId={id} currency={company.data?.currency} />}
            {tab === "expenses" && <ExpensesTab companyId={id} currency={company.data?.currency} />}
            {tab === "payroll" && <PayrollTab companyId={id} />}
            {tab === "users" && <UsersTab companyId={id} />}
            {tab === "quickbooks" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>QuickBooks Connection</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {qbStatus.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-400"}`} />
                          <span className="text-[13px] font-medium text-navy">{isConnected ? "Connected" : "Not connected"}</span>
                          {qbStatus.data?.realmId && <span className="text-[11px] text-navy/40 font-mono">Realm: {qbStatus.data.realmId}</span>}
                        </div>
                        {qbStatus.data?.lastSyncAt && (
                          <p className="text-[12px] text-navy/50">Last synced: {new Date(qbStatus.data.lastSyncAt).toLocaleString()}</p>
                        )}
                        <div className="flex gap-2">
                          {can(PERMISSIONS.QUICKBOOKS_MANAGE) && <>
                          <Button variant="outline" size="sm" onClick={async () => {
                            try { const r = await reconnectMut.mutate(); if ((r as {authorizationUrl?:string}).authorizationUrl) window.open((r as {authorizationUrl:string}).authorizationUrl,"_blank"); }
                            catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
                          }}><RefreshCw className="w-3 h-3" /> Reconnect</Button>
                          <Button variant="outline" size="sm" onClick={async () => {
                            try { await disconnectMut.mutate(); toast("Disconnected", "success"); qbStatus.refetch(); }
                            catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
                          }}><Unlink className="w-3 h-3 text-red-500" /> Disconnect</Button>
                          </>}
                          <Button variant="ghost" size="sm" onClick={() => qbStatus.refetch()}><Link2 className="w-3 h-3" /> Refresh</Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <QbBrowser companyId={id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="stat-card p-4">
      <p className="text-[10px] font-medium text-navy/45 uppercase tracking-wider">{label}</p>
      <p className={`text-xl font-bold mt-1 ${color ?? "text-navy"}`}>{value}</p>
      {sub && <p className="text-[10px] text-navy/35 mt-0.5">{sub}</p>}
    </div>
  );
}

function OverviewTab({ companyId, currency = "USD" }: { companyId: string; currency?: string }) {
  const kpis = useApi(() => dashboardApi.kpis(companyId), [companyId]);
  const activity = useApi(() => dashboardApi.activity(companyId, 10), [companyId]);
  const k = kpis.data as Record<string, unknown> | null;
  const acts = (activity.data ?? []) as Array<Record<string, unknown>>;
  return (
    <div className="space-y-5">
      {kpis.loading ? <div className="flex items-center gap-2 text-navy/40 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading KPIs…</div> : kpis.error ? <ErrorNote msg={kpis.error} /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Cash on Hand" value={fmt(k?.cashOnHand, currency)} />
          <KpiCard label="Revenue YTD" value={fmt(k?.revenueYtd, currency)} />
          <KpiCard label="AR Outstanding" value={fmt(k?.arOutstanding, currency)} color="text-amber-600" sub={`${fmt(k?.arOverdue, currency)} overdue`} />
          <KpiCard label="AP Outstanding" value={fmt(k?.apOutstanding, currency)} sub={`${fmt(k?.apDueSoon, currency)} due soon`} />
          <KpiCard label="Revenue (MTD)" value={fmt(k?.revenueThisMonth, currency)} />
          <KpiCard label="Expenses (MTD)" value={fmt(k?.expensesThisMonth, currency)} />
          <KpiCard label="Net Profit (MTD)" value={fmt(k?.netProfitThisMonth, currency)} color={Number(k?.netProfitThisMonth) >= 0 ? "text-emerald-600" : "text-red-500"} />
          <KpiCard label="Gross Margin" value={k?.grossMarginPct != null ? `${Number(k.grossMarginPct).toFixed(1)}%` : "—"} />
        </div>
      )}
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent className="p-0">
          {activity.loading ? <div className="flex items-center gap-2 p-5 text-navy/40 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div> : (
            <div className="divide-y divide-navy/4">
              {acts.slice(0, 10).map((a, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-navy/[0.015]">
                  <div>
                    <p className="text-[13px] font-medium text-navy">{String(a.type ?? "Transaction")} {a.reference ? `#${a.reference}` : ""}</p>
                    <p className="text-[11px] text-navy/40">{String(a.party ?? "")} {a.date ? `· ${String(a.date)}` : ""}</p>
                  </div>
                  <span className="text-[13px] font-semibold text-navy">{fmt(a.amount, currency)}</span>
                </div>
              ))}
              {acts.length === 0 && <p className="text-center py-8 text-[13px] text-navy/30">No recent activity</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PnlTab({ companyId, currency = "USD" }: { companyId: string; currency?: string }) {
  const q = useApi(() => dashboardApi.pnl(companyId, 12), [companyId]);
  const d = q.data as Record<string, unknown> | null;
  const trend = (d?.trend as Array<Record<string, unknown>> ?? []);
  const marginTrend = (d?.marginTrend as Array<Record<string, unknown>> ?? []);
  return (
    <div className="space-y-5">
      {q.loading ? <div className="flex items-center gap-2 text-navy/40 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div> : q.error ? <ErrorNote msg={q.error} /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="Income" value={fmt(d?.income, currency)} />
            <KpiCard label="Gross Profit" value={fmt(d?.grossProfit, currency)} />
            <KpiCard label="Operating Expenses" value={fmt(d?.operatingExpenses, currency)} />
            <KpiCard label="Net Profit" value={fmt(d?.netProfit, currency)} color={Number(d?.netProfit) >= 0 ? "text-emerald-600" : "text-red-500"} sub={`${Number(d?.netMarginPct ?? 0).toFixed(1)}% margin`} />
          </div>
          {trend.length > 0 && (
            <ChartCard title="Revenue vs Expenses" subtitle="12-month trend">
              <TrendChart
                data={trend.map(p => ({ name: String(p.period), revenue: Number(p.revenue), expenses: Number(p.expenses) }))}
                dataKeys={[{ key: "revenue", label: "Revenue", color: "#182954" }, { key: "expenses", label: "Expenses", color: "#C19B3F" }]}
                valuePrefix={currency ? `${currency} ` : ""} height={260}
              />
            </ChartCard>
          )}
          {marginTrend.length > 0 && (
            <ChartCard title="Margin Trend" subtitle="Gross & net margin %">
              <MetricLineChart
                data={marginTrend.map(p => ({ name: String(p.period), gross: Number(p.grossMarginPct), net: Number(p.netMarginPct) }))}
                dataKeys={[{ key: "gross", label: "Gross Margin %", color: "#182954" }, { key: "net", label: "Net Margin %", color: "#C19B3F" }]}
                valueSuffix="%" height={220}
              />
            </ChartCard>
          )}
          {d?.authoritative && (
            <Card>
              <CardHeader><CardTitle>Authoritative P&L</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(d.authoritative as Record<string, unknown>).filter(([k]) => k !== "generatedAt").map(([k, v]) => (
                    <KpiCard key={k} label={k.replace(/([A-Z])/g, " $1")} value={fmt(v, currency)} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function CashFlowTab({ companyId, currency = "USD" }: { companyId: string; currency?: string }) {
  const q = useApi(() => dashboardApi.cashFlow(companyId, 12), [companyId]);
  const d = q.data as Record<string, unknown> | null;
  const trend = (d?.trend as Array<Record<string, unknown>> ?? []);
  const balances = (d?.balances as Array<Record<string, unknown>> ?? []);
  return (
    <div className="space-y-5">
      {q.loading ? <div className="flex items-center gap-2 text-navy/40 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div> : q.error ? <ErrorNote msg={q.error} /> : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="Cash on Hand" value={fmt(d?.cashOnHand, currency)} />
            <KpiCard label="Runway" value={d?.runwayMonths != null ? `${Number(d.runwayMonths).toFixed(1)} months` : "—"} />
          </div>
          {trend.length > 0 && (
            <ChartCard title="Cash Flow Trend" subtitle="Monthly inflow vs outflow">
              <MetricBarChart
                data={trend.map(p => ({ name: String(p.period), inflow: Number(p.inflow), outflow: Number(p.outflow) }))}
                dataKeys={[{ key: "inflow", label: "Inflow", color: "#182954" }, { key: "outflow", label: "Outflow", color: "#C19B3F" }]}
                valuePrefix={currency ? `${currency} ` : ""} height={260}
              />
            </ChartCard>
          )}
          {balances.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Bank Accounts</CardTitle></CardHeader>
              <CardContent>
                <div className="divide-y divide-navy/4">
                  {balances.map((b, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-[13px] font-medium text-navy">{String(b.name)}</p>
                        <p className="text-[11px] text-navy/40">{String(b.type)}</p>
                      </div>
                      <span className="text-[14px] font-bold text-navy">{fmt(b.balance, currency)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function BalanceTab({ companyId, currency = "USD" }: { companyId: string; currency?: string }) {
  const q = useApi(() => dashboardApi.balanceSheet(companyId), [companyId]);
  const d = q.data as Record<string, unknown> | null;
  const assets = (d?.assetAccounts as Array<Record<string, unknown>> ?? []);
  const liabilities = (d?.liabilityAccounts as Array<Record<string, unknown>> ?? []);
  const equity = (d?.equityAccounts as Array<Record<string, unknown>> ?? []);
  return (
    <div className="space-y-5">
      {q.loading ? <div className="flex items-center gap-2 text-navy/40 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div> : q.error ? <ErrorNote msg={q.error} /> : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Total Assets" value={fmt(d?.assets, currency)} color="text-emerald-600" />
            <KpiCard label="Total Liabilities" value={fmt(Math.abs(Number(d?.liabilities)), currency)} color="text-red-500" />
            <KpiCard label="Equity" value={fmt(d?.equity, currency)} />
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            {[{ title: "Assets", rows: assets, color: "text-emerald-600" }, { title: "Liabilities", rows: liabilities, color: "text-red-500" }, { title: "Equity", rows: equity, color: "text-navy" }].map(({ title, rows, color }) => (
              <Card key={title}>
                <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-navy/4">
                    {rows.filter(r => Number(r.amount) !== 0).map((r, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-2.5">
                        <p className="text-[12px] text-navy/70 truncate pr-2">{String(r.name)}</p>
                        <span className={`text-[12px] font-semibold shrink-0 ${color}`}>{fmt(Math.abs(Number(r.amount)), currency)}</span>
                      </div>
                    ))}
                    {rows.filter(r => Number(r.amount) !== 0).length === 0 && <p className="text-center py-4 text-[12px] text-navy/30">No data</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ArTab({ companyId, currency = "USD" }: { companyId: string; currency?: string }) {
  const q = useApi(() => dashboardApi.receivables(companyId), [companyId]);
  const d = q.data as Record<string, unknown> | null;
  const aging = d?.aging as Record<string, unknown> | null;
  const debtors = (d?.topDebtors as Array<Record<string, unknown>> ?? []);
  return (
    <div className="space-y-5">
      {q.loading ? <div className="flex items-center gap-2 text-navy/40 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div> : q.error ? <ErrorNote msg={q.error} /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="Total Outstanding" value={fmt(d?.totalOutstanding, currency)} />
            <KpiCard label="Overdue" value={fmt(d?.overdue, currency)} color="text-red-500" />
            <KpiCard label="DSO" value={d?.daysSalesOutstanding != null ? `${d.daysSalesOutstanding} days` : "—"} />
            <KpiCard label="Open Invoices" value={String(d?.openCount ?? "—")} sub={`${d?.overdueCount ?? 0} overdue`} />
          </div>
          {aging && (
            <ChartCard title="Aging Buckets" subtitle="Days outstanding">
              <MetricBarChart
                data={[
                  { name: "Current", amount: Number(aging.current) },
                  { name: "1-30d", amount: Number(aging.days1to30) },
                  { name: "31-60d", amount: Number(aging.days31to60) },
                  { name: "61-90d", amount: Number(aging.days61to90) },
                  { name: "90d+", amount: Number(aging.days90plus) },
                ]}
                dataKeys={[{ key: "amount", label: "Amount", color: "#C19B3F" }]}
                valuePrefix={currency ? `${currency} ` : ""} height={220} showLegend={false}
              />
            </ChartCard>
          )}
          {debtors.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Top Debtors</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-navy/4">
                  {debtors.map((d, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3">
                      <p className="text-[13px] font-medium text-navy">{String(d.name)}</p>
                      <span className="text-[13px] font-bold text-amber-600">{fmt(d.amount, currency)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function ApTab({ companyId, currency = "USD" }: { companyId: string; currency?: string }) {
  const q = useApi(() => dashboardApi.payables(companyId), [companyId]);
  const d = q.data as Record<string, unknown> | null;
  const aging = d?.aging as Record<string, unknown> | null;
  const creditors = (d?.topCreditors as Array<Record<string, unknown>> ?? []);
  return (
    <div className="space-y-5">
      {q.loading ? <div className="flex items-center gap-2 text-navy/40 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div> : q.error ? <ErrorNote msg={q.error} /> : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Total Outstanding" value={fmt(d?.totalOutstanding, currency)} />
            <KpiCard label="Due Soon" value={fmt(d?.dueSoon, currency)} color="text-amber-600" />
            <KpiCard label="DPO" value={d?.daysPayableOutstanding != null ? `${d.daysPayableOutstanding} days` : "—"} />
          </div>
          {aging && (
            <ChartCard title="Payables Aging" subtitle="Days outstanding">
              <MetricBarChart
                data={[
                  { name: "Current", amount: Number(aging.current) },
                  { name: "1-30d", amount: Number(aging.days1to30) },
                  { name: "31-60d", amount: Number(aging.days31to60) },
                  { name: "61-90d", amount: Number(aging.days61to90) },
                  { name: "90d+", amount: Number(aging.days90plus) },
                ]}
                dataKeys={[{ key: "amount", label: "Amount", color: "#182954" }]}
                valuePrefix={currency ? `${currency} ` : ""} height={220} showLegend={false}
              />
            </ChartCard>
          )}
          {creditors.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Top Creditors</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-navy/4">
                  {creditors.map((c, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3">
                      <p className="text-[13px] font-medium text-navy">{String(c.name)}</p>
                      <span className="text-[13px] font-bold text-navy">{fmt(c.amount, currency)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function SalesTab({ companyId, currency = "USD" }: { companyId: string; currency?: string }) {
  const q = useApi(() => dashboardApi.sales(companyId, 12), [companyId]);
  const d = q.data as Record<string, unknown> | null;
  const revTrend = (d?.revenueTrend as Array<Record<string, unknown>> ?? []);
  const customers = (d?.topCustomers as Array<Record<string, unknown>> ?? []);
  const items = (d?.topItems as Array<Record<string, unknown>> ?? []);
  return (
    <div className="space-y-5">
      {q.loading ? <div className="flex items-center gap-2 text-navy/40 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div> : q.error ? <ErrorNote msg={q.error} /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard label="Invoices" value={String(d?.invoiceCount ?? "—")} />
            <KpiCard label="Avg Invoice" value={fmt(d?.averageInvoiceValue, currency)} />
            <KpiCard label="Conversion Rate" value={d?.conversionRatePct != null ? `${d.conversionRatePct}%` : "—"} />
            <KpiCard label="Open Pipeline" value={fmt(d?.openPipeline, currency)} />
          </div>
          {revTrend.length > 0 && (
            <ChartCard title="Revenue Trend" subtitle="Monthly revenue">
              <TrendChart
                data={revTrend.map(p => ({ name: String(p.period), revenue: Number(p.revenue) }))}
                dataKeys={[{ key: "revenue", label: "Revenue", color: "#182954" }]}
                valuePrefix={currency ? `${currency} ` : ""} height={240}
              />
            </ChartCard>
          )}
          <div className="grid lg:grid-cols-2 gap-5">
            {customers.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Top Customers</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-navy/4">
                    {customers.slice(0, 8).map((c, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-2.5">
                        <p className="text-[12px] font-medium text-navy">{String(c.name)}</p>
                        <span className="text-[12px] font-bold text-navy">{fmt(c.amount, currency)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {items.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Top Items</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-navy/4">
                    {items.slice(0, 8).map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-2.5">
                        <div>
                          <p className="text-[12px] font-medium text-navy">{String(item.name)}</p>
                          <p className="text-[10px] text-navy/40">Qty: {String(item.quantity)}</p>
                        </div>
                        <span className="text-[12px] font-bold text-navy">{fmt(item.revenue, currency)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ExpensesTab({ companyId, currency = "USD" }: { companyId: string; currency?: string }) {
  const q = useApi(() => dashboardApi.expenses(companyId, 12), [companyId]);
  const d = q.data as Record<string, unknown> | null;
  const trend = (d?.expenseTrend as Array<Record<string, unknown>> ?? []);
  const byCategory = (d?.byCategory as Array<Record<string, unknown>> ?? []);
  const vendors = (d?.topVendors as Array<Record<string, unknown>> ?? []);
  const largest = (d?.largest as Array<Record<string, unknown>> ?? []);
  const COLORS = ["#182954","#C19B3F","#4A9EFF","#059669","#7c3aed","#d97706","#e11d48"];
  return (
    <div className="space-y-5">
      {q.loading ? <div className="flex items-center gap-2 text-navy/40 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div> : q.error ? <ErrorNote msg={q.error} /> : (
        <>
          {trend.length > 0 && (
            <ChartCard title="Expense Trend" subtitle="Monthly expenses">
              <MetricBarChart
                data={trend.map(p => ({ name: String(p.period), expenses: Number(p.expenses) }))}
                dataKeys={[{ key: "expenses", label: "Expenses", color: "#C19B3F" }]}
                valuePrefix={currency ? `${currency} ` : ""} height={240} showLegend={false}
              />
            </ChartCard>
          )}
          <div className="grid lg:grid-cols-2 gap-5">
            {byCategory.length > 0 && (
              <ChartCard title="By Category" subtitle="Expense breakdown">
                <DonutChart
                  data={byCategory.slice(0, 7).map((c, i) => ({ name: String(c.name), value: Number(c.amount), color: COLORS[i % COLORS.length] }))}
                  centerValue={fmt(byCategory.reduce((s, c) => s + Number(c.amount), 0), currency)}
                  centerLabel="Total"
                  height={220} innerRadius={55} outerRadius={85}
                />
              </ChartCard>
            )}
            {vendors.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Top Vendors</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-navy/4">
                    {vendors.slice(0, 8).map((v, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-2.5">
                        <p className="text-[12px] font-medium text-navy">{String(v.name)}</p>
                        <span className="text-[12px] font-bold text-navy">{fmt(v.amount, currency)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          {largest.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Largest Expenses</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-navy/4">
                  {largest.map((e, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-[13px] font-medium text-navy">{String(e.party ?? e.type)}</p>
                        <p className="text-[11px] text-navy/40">{String(e.type)} {e.date ? `· ${String(e.date)}` : ""}</p>
                      </div>
                      <span className="text-[13px] font-bold text-red-500">{fmt(e.amount, currency)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}


function UsersTab({ companyId }: { companyId: string }) {
  const users = useApi(() => companiesApi.listUsers(companyId), [companyId]);
  const companyRoles = useApi(() => rolesApi.company(), []);
  const inviteMut = useMutation((email: string, roleId: string) => companiesApi.inviteUser(companyId, { email, roleId }));
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const { toast } = useToast();
  const { can } = useAuth();

  useEffect(() => {
    if (!roleId && companyRoles.data?.[0]?.id) setRoleId(companyRoles.data[0].id);
  }, [companyRoles.data, roleId]);

  return (
    <Card>
      <CardHeader><CardTitle>Company Users</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {can(PERMISSIONS.COMPANY_USER_INVITE) && <div className="flex flex-col sm:flex-row gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-white sm:w-48" disabled={companyRoles.loading || !companyRoles.data?.length}>
            <option value="">{companyRoles.loading ? "Loading roles…" : "Select role"}</option>
            {(companyRoles.data ?? []).map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
          </select>
          <Button variant="primary" size="sm" onClick={async () => {
            if (!email || !roleId) return;
            try { await inviteMut.mutate(email, roleId); toast("Invitation sent", "success"); setEmail(""); setRoleId(""); users.refetch(); }

            catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
          }} disabled={!email || !roleId || inviteMut.loading}>Invite</Button>
        </div>}
        {!companyRoles.loading && !companyRoles.data?.length && <p className="text-[11px] text-red-500">No company roles are available.</p>}
        {users.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {(users.data ?? []).map((u) => (
                <tr key={u.id}>
                  <td className="py-2">{u.firstName} {u.lastName}</td>
                  <td className="py-2 text-navy/60">{u.email}</td>
                  <td className="py-2 text-right"><Badge variant="default">{u.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

const STATUS_VARIANT: Record<string, "default" | "warning" | "success" | "error" | "info"> = {
  DRAFT: "default", PENDING_APPROVAL: "warning", APPROVED: "info", REJECTED: "error", PAID: "success",
};

function PayrollTab({ companyId }: { companyId: string }) {
  const { toast } = useToast();
  const { can } = useAuth();
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ label: "", periodStart: "", periodEnd: "", currency: "" });

  const runs = useApi(() => payrollApi.listRuns({ companyId }), [companyId]);
  const employees = useApi(() => payrollApi.listEmployees({ companyId }), [companyId]);
  const [addEmpModal, setAddEmpModal] = useState(false);
  const [empForm, setEmpForm] = useState({ fullName: "", email: "", jobTitle: "", baseSalary: "", currency: "" });

  const createRunMut = useMutation(() => payrollApi.createRun({ ...form, companyId, periodStart: form.periodStart, periodEnd: form.periodEnd }));
  const createEmpMut = useMutation(() => payrollApi.createEmployee({ ...empForm, baseSalary: Number(empForm.baseSalary), companyId }));
  const submitMut = useMutation((id: string) => payrollApi.submit(id));
  const approveMut = useMutation((id: string) => payrollApi.approve(id));
  const payMut = useMutation((id: string) => payrollApi.markPaid(id));

  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try { await fn(); toast(msg, "success"); runs.refetch(); }
    catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
  };

  const runList = runs.data ?? [];
  const empList = employees.data ?? [];

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Employees", value: empList.length },
          { label: "Paid Runs", value: runList.filter(r => r.status === "PAID").length },
          { label: "Pending Approval", value: runList.filter(r => r.status === "PENDING_APPROVAL").length },
          { label: "Approved", value: runList.filter(r => r.status === "APPROVED").length },
        ].map(({ label, value }) => (
          <div key={label} className="stat-card p-4">
            <p className="text-2xl font-bold text-navy">{value}</p>
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Runs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payroll Runs</CardTitle>
          {can(PERMISSIONS.PAYROLL_MANAGE) && <Button variant="primary" size="sm" onClick={() => setCreateModal(true)}>
            <Plus className="w-3.5 h-3.5" /> New Run
          </Button>}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-navy/[0.02] border-b border-navy/6">
                <tr>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Label</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Period</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Gross</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Net</th>
                  <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/4">
                {runList.map((r) => (
                  <tr key={r.id} className="hover:bg-navy/[0.015]">
                    <td className="px-5 py-3 text-[13px] font-medium text-navy">{r.label || `Run ${r.id.slice(0,8)}`}</td>
                    <td className="px-4 py-3 text-[12px] text-navy/60">{r.periodStart} → {r.periodEnd}</td>
                    <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{r.totalGross != null ? fmt(r.totalGross, r.currency) : "—"}</td>
                    <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{r.totalNet != null ? fmt(r.totalNet, r.currency) : "—"}</td>
                    <td className="px-4 py-3 text-center"><Badge variant={STATUS_VARIANT[r.status] ?? "default"} size="sm">{r.status}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {can(PERMISSIONS.PAYROLL_MANAGE) && r.status === "DRAFT" && <Button variant="ghost" size="xs" onClick={() => act(() => submitMut.mutate(r.id), "Submitted")}><Play className="w-3 h-3" /> Submit</Button>}
                        {can(PERMISSIONS.PAYROLL_APPROVE) && r.status === "PENDING_APPROVAL" && <Button variant="primary" size="xs" onClick={() => act(() => approveMut.mutate(r.id), "Approved")}><CheckCircle className="w-3 h-3" /> Approve</Button>}
                        {can(PERMISSIONS.PAYROLL_PAY) && r.status === "APPROVED" && <Button variant="primary" size="xs" onClick={() => act(() => payMut.mutate(r.id), "Marked paid")}><CheckCircle className="w-3 h-3" /> Mark Paid</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
                {runList.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-[13px] text-navy/30">No payroll runs yet</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Employees */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Employees ({empList.length})</CardTitle>
          {can(PERMISSIONS.PAYROLL_MANAGE) && <Button variant="primary" size="sm" onClick={() => setAddEmpModal(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Employee
          </Button>}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-navy/[0.02] border-b border-navy/6">
                <tr>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Title</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Base Salary</th>
                  <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/4">
                {empList.map((e: PayrollEmployee) => (
                  <tr key={e.id} className="hover:bg-navy/[0.015]">
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-medium text-navy">{e.fullName}</p>
                      <p className="text-[11px] text-navy/40">{e.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-navy/60">{e.jobTitle || "—"}</td>
                    <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{fmt(e.baseSalary, e.currency)}</td>
                    <td className="px-4 py-3 text-center"><Badge variant={e.active ? "success" : "error"} size="sm">{e.active ? "Active" : "Inactive"}</Badge></td>
                  </tr>
                ))}
                {empList.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-[13px] text-navy/30">No employees found</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create run modal */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-[15px] font-bold text-navy">New Payroll Run</h3>
            <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} placeholder="Label (optional)" className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[11px] text-navy/50 block mb-1">Period Start</label><input type="date" value={form.periodStart} onChange={e => setForm({...form, periodStart: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              <div><label className="text-[11px] text-navy/50 block mb-1">Period End</label><input type="date" value={form.periodEnd} onChange={e => setForm({...form, periodEnd: e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
            </div>
            <input value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} placeholder="Currency (USD)" className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setCreateModal(false)}>Cancel</Button>
              <Button variant="primary" disabled={!form.periodStart || !form.periodEnd || createRunMut.loading} onClick={async () => { try { await createRunMut.mutate(); toast("Run created", "success"); setCreateModal(false); runs.refetch(); } catch(e) { toast(e instanceof Error ? e.message : "Failed", "error"); } }}>
                {createRunMut.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add employee modal */}
      {addEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-[15px] font-bold text-navy">Add Employee</h3>
            <input value={empForm.fullName} onChange={e => setEmpForm({...empForm, fullName: e.target.value})} placeholder="Full name" className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <input value={empForm.email} onChange={e => setEmpForm({...empForm, email: e.target.value})} placeholder="Email" className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <input value={empForm.jobTitle} onChange={e => setEmpForm({...empForm, jobTitle: e.target.value})} placeholder="Job title" className="w-full border rounded-xl px-3 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input value={empForm.baseSalary} onChange={e => setEmpForm({...empForm, baseSalary: e.target.value})} placeholder="Base salary" type="number" className="w-full border rounded-xl px-3 py-2 text-sm" />
              <input value={empForm.currency} onChange={e => setEmpForm({...empForm, currency: e.target.value})} placeholder="Currency" className="w-full border rounded-xl px-3 py-2 text-sm" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAddEmpModal(false)}>Cancel</Button>
              <Button variant="primary" disabled={!empForm.fullName || !empForm.baseSalary || createEmpMut.loading} onClick={async () => { try { await createEmpMut.mutate(); toast("Employee added", "success"); setAddEmpModal(false); employees.refetch(); } catch(e) { toast(e instanceof Error ? e.message : "Failed", "error"); } }}>
                {createEmpMut.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QbBrowser({ companyId }: { companyId: string }) {
  const [slug, setSlug] = useState("accounts");
  const data = useApi(() => quickbooksApi.list(companyId, slug, 0, 25), [companyId, slug]);
  const items = (data.data as { items?: Record<string, unknown>[] } | null)?.items
    ?? (Array.isArray(data.data) ? data.data as Record<string, unknown>[] : []);

  const cols = items.length > 0
    ? Object.keys(items[0]).filter(k => typeof items[0][k] !== "object").slice(0, 6)
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>QuickBooks Data</CardTitle>
        <div className="flex items-center gap-2">
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className="border border-navy/10 rounded-xl px-3 py-1.5 text-[12px] bg-white">
            {QB_ENTITIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button variant="ghost" size="sm" onClick={() => data.refetch()} disabled={data.loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${data.loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {data.loading ? (
          <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-navy/30" /></div>
        ) : data.error ? (
          <div className="p-5"><ErrorNote msg={data.error} /></div>
        ) : items.length === 0 ? (
          <p className="text-center py-10 text-[13px] text-navy/30">No {slug} found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-navy/[0.02] border-b border-navy/6">
                <tr>
                  {cols.map(c => (
                    <th key={c} className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider whitespace-nowrap">
                      {c.replace(/([A-Z])/g, " $1").trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/4">
                {items.slice(0, 50).map((row, i) => (
                  <tr key={i} className="hover:bg-navy/[0.015] transition-colors">
                    {cols.map(c => (
                      <td key={c} className="px-4 py-2.5 text-[12px] text-navy/70 whitespace-nowrap max-w-[200px] truncate">
                        {String(row[c] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {(data.data as { totalElements?: number } | null)?.totalElements != null && (
              <p className="text-[11px] text-navy/35 px-4 py-2.5 border-t border-navy/4">
                Showing {Math.min(items.length, 50)} of {(data.data as { totalElements: number }).totalElements} records
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ErrorNote({ msg }: { msg: string }) {
  return <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">{msg}</div>;
}
