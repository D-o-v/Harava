"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { MetricBarChart, ChartCard } from "@/components/ui/charts";
import { payrollApi, type PayrollEmployee, type PayrollRun } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";
import { Wallet, DollarSign, Users, Calendar, Download, Play, CheckCircle, XCircle, Plus, Loader2, RefreshCw } from "lucide-react";

const STATUS_VARIANT: Record<string, "default" | "warning" | "success" | "error" | "info"> = {
  DRAFT: "default", PENDING_APPROVAL: "warning", APPROVED: "info", REJECTED: "error", PAID: "success",
};

function fmt(n: number | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function PayrollPage() {
  const { toast } = useToast();
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ label: "", periodStart: "", periodEnd: "", currency: "NGN" });

  const runs = useApi(() => payrollApi.listRuns(), []);
  const pending = useApi(() => payrollApi.pendingApproval(), []);
  const employees = useApi(() => payrollApi.listEmployees(), []);

  const createMut = useMutation(() => payrollApi.createRun(form));
  const submitMut = useMutation((id: string) => payrollApi.submit(id));
  const approveMut = useMutation((id: string) => payrollApi.approve(id));
  const rejectMut = useMutation((id: string) => payrollApi.reject(id));
  const payMut = useMutation((id: string) => payrollApi.markPaid(id));

  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try { await fn(); toast(msg, "success"); runs.refetch(); pending.refetch(); }
    catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
  };

  const downloadBankFile = async (id: string) => {
    try {
      const res = await payrollApi.bankFile(id) as Response;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `payroll-${id}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { toast(e instanceof Error ? e.message : "Download failed", "error"); }
  };

  const handleCreate = async () => {
    if (!form.periodStart || !form.periodEnd) return;
    try {
      await createMut.mutate();
      toast("Payroll run created", "success");
      setCreateModal(false);
      setForm({ label: "", periodStart: "", periodEnd: "", currency: "NGN" });
      runs.refetch();
    } catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
  };

  const runList = runs.data ?? [];
  const empList = employees.data ?? [];
  const pendingList = pending.data ?? [];

  if (runs.loading || employees.loading) return <><DashboardHeader title="Payroll Management" subtitle="Process payments, manage compensation, and track expenses" /><PageLoader message="Loading payroll data…" /></>;
  if (runs.error) return <><DashboardHeader title="Payroll Management" subtitle="Process payments, manage compensation, and track expenses" /><PageError message={runs.error} onRetry={runs.refetch} /></>;
  const paidRuns = runList.filter(r => r.status === "PAID");
  const totalNet = paidRuns.reduce((s, r) => s + (r.totalNet ?? 0), 0);
  const totalGross = paidRuns.reduce((s, r) => s + (r.totalGross ?? 0), 0);

  // Build chart data from last 6 paid runs
  const chartData = paidRuns.slice(-6).map(r => ({
    name: r.label?.slice(0, 8) || r.periodStart?.slice(0, 7) || r.id.slice(0, 6),
    gross: r.totalGross ?? 0,
    net: r.totalNet ?? 0,
  }));

  return (
    <div>
      <DashboardHeader title="Payroll Management" subtitle="Process payments, manage compensation, and track expenses" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <div className="stat-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Employees</p>
                <p className="text-2xl font-bold text-navy mt-1">{employees.loading ? "—" : empList.length}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center">
                <Users className="w-4 h-4 text-navy/50" />
              </div>
            </div>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Gross Paid</p>
                <p className="text-2xl font-bold text-navy mt-1">{fmt(totalGross)}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-navy/50" />
              </div>
            </div>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Net Paid</p>
                <p className="text-2xl font-bold text-navy mt-1">{fmt(totalNet)}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-navy/50" />
              </div>
            </div>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Pending Approval</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{pendingList.length}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-navy/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-[13px] font-semibold text-navy">{runList.length} total runs</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { runs.refetch(); pending.refetch(); employees.refetch(); }} disabled={runs.loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${runs.loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="primary" onClick={() => setCreateModal(true)}>
              <Plus className="w-3.5 h-3.5" /> New Run
            </Button>
          </div>
        </div>

        {/* Payroll Trend */}
        {chartData.length > 0 && (
          <ChartCard title="Payroll Expense Trend" subtitle="Gross vs net across paid runs">
            <MetricBarChart
              data={chartData}
              dataKeys={[
                { key: "gross", label: "Gross", color: "#182954" },
                { key: "net", label: "Net", color: "#C19B3F" },
              ]}
              valuePrefix="$"
              height={200}
            />
          </ChartCard>
        )}

        {/* Pending approvals */}
        {pendingList.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-amber-600">Awaiting Approval ({pendingList.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-navy/4">
                {pendingList.map((r) => (
                  <div key={r.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-[13px] font-semibold text-navy">{r.label || `Run ${r.id.slice(0, 8)}`}</p>
                      <p className="text-[11px] text-navy/45">{r.periodStart} → {r.periodEnd}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="primary" size="xs" onClick={() => act(() => approveMut.mutate(r.id), "Approved")}>
                        <CheckCircle className="w-3 h-3" /> Approve
                      </Button>
                      <Button variant="ghost" size="xs" onClick={() => act(() => rejectMut.mutate(r.id), "Rejected")}>
                        <XCircle className="w-3 h-3 text-red-500" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Runs Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payroll Runs</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="success">{runList.filter(r => r.status === "PAID").length} paid</Badge>
              <Badge variant="warning">{runList.filter(r => r.status === "PENDING_APPROVAL").length} pending</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-navy/2 border-b border-navy/6">
                    <tr>
                      <th className="text-left px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Label</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Period</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Gross</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Net</th>
                      <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/4">
                    {runList.map((r: PayrollRun) => (
                      <tr key={r.id} className="hover:bg-navy/1.5 transition-colors duration-150">
                        <td className="px-6 py-3 text-[13px] font-medium text-navy">{r.label || `Run ${r.id.slice(0, 8)}`}</td>
                        <td className="px-4 py-3 text-[12px] text-navy/60">{r.periodStart} → {r.periodEnd}</td>
                        <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{fmt(r.totalGross)}</td>
                        <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{fmt(r.totalNet)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={STATUS_VARIANT[r.status] ?? "default"} size="sm">{r.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {r.status === "DRAFT" && (
                              <Button variant="ghost" size="xs" onClick={() => act(() => submitMut.mutate(r.id), "Submitted for approval")}>
                                <Play className="w-3 h-3" /> Submit
                              </Button>
                            )}
                            {r.status === "APPROVED" && (
                              <Button variant="primary" size="xs" onClick={() => act(() => payMut.mutate(r.id), "Marked as paid")}>
                                <CheckCircle className="w-3 h-3" /> Mark Paid
                              </Button>
                            )}
                            {(r.status === "APPROVED" || r.status === "PAID") && (
                              <Button variant="ghost" size="xs" onClick={() => downloadBankFile(r.id)}>
                                <Download className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {runList.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-12 text-[13px] text-navy/30">No payroll runs yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Employees</CardTitle>
            <Badge variant="default">{empList.length} total</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-navy/2 border-b border-navy/6">
                    <tr>
                      <th className="text-left px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Employee</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Title</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Bank</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Base Salary</th>
                      <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/4">
                    {empList.map((e: PayrollEmployee) => (
                      <tr key={e.id} className="hover:bg-navy/1.5 transition-colors duration-150">
                        <td className="px-6 py-3">
                          <p className="text-[13px] font-medium text-navy">{e.fullName}</p>
                          <p className="text-[11px] text-navy/40">{e.email}</p>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-navy/60">{e.jobTitle || "—"}</td>
                        <td className="px-4 py-3 text-[12px] text-navy/60">{e.bankName || "—"}</td>
                        <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{fmt(e.baseSalary)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={e.active ? "success" : "error"} size="sm">{e.active ? "Active" : "Inactive"}</Badge>
                        </td>
                      </tr>
                    ))}
                    {empList.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-10 text-[13px] text-navy/30">No employees found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create Payroll Run">
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Label (optional)</label>
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. August 2026 — Firm staff" className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Period start</label>
              <input type="date" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Period end</label>
              <input type="date" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Currency</label>
            <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} placeholder="NGN" className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate} disabled={createMut.loading || !form.periodStart || !form.periodEnd}>
              {createMut.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : "Create Run"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
