"use client";

import { use, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/toast";
import { Loader2, ArrowLeft, Link2, Unlink, RefreshCw } from "lucide-react";
import Link from "next/link";
import { companiesApi, dashboardApi, quickbooksApi } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";

const TABS = ["Overview", "P&L", "Cash Flow", "Balance", "A/R", "A/P", "Sales", "Expenses", "QuickBooks", "Users"] as const;
type Tab = typeof TABS[number];

const QB_ENTITIES = [
  "accounts","customers","vendors","employees","items","invoices","bills","payments","bill-payments",
  "sales-receipts","credit-memos","estimates","purchase-orders","deposits","transfers","journal-entries",
];

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tab, setTab] = useState<Tab>("Overview");
  const { toast } = useToast();

  const company = useApi(() => companiesApi.get(id), [id]);
  const qbStatus = useApi(() => quickbooksApi.status(id), [id]);

  const reconnectMut = useMutation(() => quickbooksApi.reconnect(id));
  const disconnectMut = useMutation(() => quickbooksApi.disconnect(id));

  return (
    <div>
      <DashboardHeader title={company.data?.name ?? "Client"} subtitle={company.data?.externalRef ?? ""} />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Link href="/finsight/clients" className="inline-flex items-center gap-1 text-xs text-navy/50 hover:text-navy"><ArrowLeft className="w-3 h-3" /> Back to clients</Link>

        <div className="flex items-center gap-2 border-b border-navy/8 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-xs font-semibold border-b-2 -mb-px whitespace-nowrap ${tab === t ? "border-gold text-navy" : "border-transparent text-navy/40 hover:text-navy"}`}>{t}</button>
          ))}
        </div>

        {tab === "Overview" && <OverviewTab companyId={id} />}
        {tab === "P&L" && <PnlTab companyId={id} />}
        {tab === "Cash Flow" && <CashTab companyId={id} />}
        {tab === "Balance" && <BalanceTab companyId={id} />}
        {tab === "A/R" && <ArTab companyId={id} />}
        {tab === "A/P" && <ApTab companyId={id} />}
        {tab === "Sales" && <SalesTab companyId={id} />}
        {tab === "Expenses" && <ExpensesTab companyId={id} />}
        {tab === "Users" && <UsersTab companyId={id} />}
        {tab === "QuickBooks" && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Connection</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {qbStatus.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge variant={qbStatus.data?.connected ? "success" : "error"}>{qbStatus.data?.connected ? "Connected" : "Not connected"}</Badge>
                      {qbStatus.data?.lastSyncAt && <span className="text-xs text-navy/50">Last sync: {new Date(qbStatus.data.lastSyncAt).toLocaleString()}</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={async () => {
                        try { const r = await reconnectMut.mutate(); if ((r as {authorizationUrl?:string}).authorizationUrl) window.open((r as {authorizationUrl:string}).authorizationUrl,"_blank"); }
                        catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
                      }}><RefreshCw className="w-3 h-3" /> Reconnect</Button>
                      <Button variant="outline" size="sm" onClick={async () => {
                        try { await disconnectMut.mutate(); toast("Disconnected", "success"); qbStatus.refetch(); }
                        catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
                      }}><Unlink className="w-3 h-3 text-red-500" /> Disconnect</Button>
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
  );
}

function StatGrid({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  const entries = Object.entries(data).filter(([, v]) => typeof v === "number" || typeof v === "string");
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {entries.slice(0, 12).map(([k, v]) => (
        <div key={k} className="stat-card p-4">
          <p className="text-[10px] font-medium text-navy/45 uppercase tracking-wider">{k.replace(/([A-Z])/g, " $1")}</p>
          <p className="text-lg font-bold text-navy mt-1 truncate">{String(v)}</p>
        </div>
      ))}
    </div>
  );
}

function OverviewTab({ companyId }: { companyId: string }) {
  const kpis = useApi(() => dashboardApi.kpis(companyId), [companyId]);
  const activity = useApi(() => dashboardApi.activity(companyId, 10), [companyId]);
  return (
    <div className="space-y-6">
      {kpis.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : kpis.error ? <ErrorNote msg={kpis.error} /> : <StatGrid data={kpis.data} />}
      <Card>
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent>
          {activity.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <ul className="text-sm text-navy/70 space-y-2 max-h-96 overflow-auto">
              {(activity.data ?? []).map((a, i) => (
                <li key={i} className="border-b border-navy/5 pb-2">
                  <pre className="whitespace-pre-wrap font-mono text-[11px]">{JSON.stringify(a, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function JsonCard({ title, load }: { title: string; load: () => Promise<unknown> }) {
  const q = useApi(load as () => Promise<Record<string, unknown>>, [title]);
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {q.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : q.error ? <ErrorNote msg={q.error} /> : (
          <>
            <StatGrid data={q.data} />
            <pre className="mt-3 text-[11px] font-mono text-navy/60 whitespace-pre-wrap max-h-80 overflow-auto bg-navy/2 p-3 rounded-lg">{JSON.stringify(q.data, null, 2)}</pre>
          </>
        )}
      </CardContent>
    </Card>
  );
}

const PnlTab = ({ companyId }: { companyId: string }) => <JsonCard title="Profit & Loss" load={() => dashboardApi.pnl(companyId)} />;
const CashTab = ({ companyId }: { companyId: string }) => <JsonCard title="Cash Flow" load={() => dashboardApi.cashFlow(companyId)} />;
const BalanceTab = ({ companyId }: { companyId: string }) => <JsonCard title="Balance Sheet" load={() => dashboardApi.balanceSheet(companyId)} />;
const ArTab = ({ companyId }: { companyId: string }) => <JsonCard title="Receivables" load={() => dashboardApi.receivables(companyId)} />;
const ApTab = ({ companyId }: { companyId: string }) => <JsonCard title="Payables" load={() => dashboardApi.payables(companyId)} />;
const SalesTab = ({ companyId }: { companyId: string }) => <JsonCard title="Sales" load={() => dashboardApi.sales(companyId)} />;
const ExpensesTab = ({ companyId }: { companyId: string }) => <JsonCard title="Expenses" load={() => dashboardApi.expenses(companyId)} />;

function UsersTab({ companyId }: { companyId: string }) {
  const users = useApi(() => companiesApi.listUsers(companyId), [companyId]);
  const inviteMut = useMutation((email: string) => companiesApi.inviteUser(companyId, email));
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  return (
    <Card>
      <CardHeader><CardTitle>Company users</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <Button variant="primary" size="sm" onClick={async () => {
            try { await inviteMut.mutate(email); toast("Invitation sent", "success"); setEmail(""); users.refetch(); }
            catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
          }} disabled={!email || inviteMut.loading}>Invite</Button>
        </div>
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

function QbBrowser({ companyId }: { companyId: string }) {
  const [slug, setSlug] = useState("accounts");
  const data = useApi(() => quickbooksApi.list(companyId, slug, 0, 25), [companyId, slug]);
  return (
    <Card>
      <CardHeader><CardTitle>QuickBooks data</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <label className="text-xs text-navy/60">Entity</label>
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm">
            {QB_ENTITIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {data.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : data.error ? <ErrorNote msg={data.error} /> : (
          <pre className="text-[11px] font-mono text-navy/60 whitespace-pre-wrap max-h-96 overflow-auto bg-navy/2 p-3 rounded-lg">{JSON.stringify(data.data, null, 2)}</pre>
        )}
      </CardContent>
    </Card>
  );
}

function ErrorNote({ msg }: { msg: string }) {
  return <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">{msg}</div>;
}
