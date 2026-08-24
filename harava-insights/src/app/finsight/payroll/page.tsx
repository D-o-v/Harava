"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { Can } from "@/components/auth/permission-guard";
import { PERMISSIONS } from "@/lib/permissions";
import { useCompanyContext } from "@/lib/company-context";
import { payrollApi, type PayrollRun, type PayrollEmployee } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { DollarSign, Users, Calendar, Plus, Loader2, RefreshCw, CheckCircle, XCircle, Play, Download, Pencil, Trash2 } from "lucide-react";
import { PageLoader, PageError } from "@/components/ui/page-loader";
import { formatMoney } from "@/lib/currency";

const STATUS_VARIANT: Record<string, "default" | "warning" | "success" | "error" | "info"> = {
  DRAFT: "default",
  PENDING_APPROVAL: "warning",
  APPROVED: "info",
  REJECTED: "error",
  PAID: "success",
};

export default function PayrollPage() {
  const { toast } = useToast();
  const { user, can } = useAuth();
  const { selectedCompanyId } = useCompanyContext();
  const companyId = selectedCompanyId ?? user?.companyId ?? undefined;
  const [createModal, setCreateModal] = useState(false);
  const [employeeModal, setEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<PayrollEmployee | null>(null);
  const [editingRun, setEditingRun] = useState<PayrollRun | null>(null);
  const [form, setForm] = useState({ label: "", periodStart: "", periodEnd: "", currency: "NGN" });
  const [employeeForm, setEmployeeForm] = useState({ fullName: "", email: "", jobTitle: "", bankName: "", bankAccountNumber: "", baseSalary: "", currency: "NGN" });

  const runs = useApi(() => payrollApi.listRuns(companyId ? { companyId } : {}), [companyId]);
  const pending = useApi(() => payrollApi.pendingApproval(), []);
  const employees = useApi(() => payrollApi.listEmployees(companyId ? { companyId } : {}), [companyId]);

  const createMut = useMutation(() => payrollApi.createRun({ ...form, ...(companyId ? { companyId } : {}) }));
  const createEmployeeMut = useMutation(() => payrollApi.createEmployee({
    ...employeeForm,
    baseSalary: Number(employeeForm.baseSalary),
    ...(companyId ? { companyId } : {}),
  }));
  const updateEmployeeMut = useMutation((id: string) => payrollApi.updateEmployee(id, {
    ...employeeForm,
    baseSalary: Number(employeeForm.baseSalary),
  }));
  const deactivateEmployeeMut = useMutation((id: string) => payrollApi.deactivateEmployee(id));
  const updateRunMut = useMutation((id: string, payload: { note?: string; payDate?: string }) => payrollApi.updateRun(id, payload));
  const submitMut = useMutation((id: string) => payrollApi.submit(id));
  const approveMut = useMutation((id: string) => payrollApi.approve(id));
  const rejectMut = useMutation((id: string) => payrollApi.reject(id, "Rejected via portal"));
  const payMut = useMutation((id: string) => payrollApi.markPaid(id));

  const handleCreate = async () => {
    if (!form.periodStart || !form.periodEnd) return;
    try {
      await createMut.mutate();
      toast("Payroll run created", "success");
      setCreateModal(false);
      setForm({ label: "", periodStart: "", periodEnd: "", currency: "NGN" });
      runs.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  const openEmployeeEditor = (employee: PayrollEmployee) => {
    setEditingEmployee(employee);
    setEmployeeForm({
      fullName: employee.fullName, email: employee.email ?? "", jobTitle: employee.jobTitle ?? "",
      bankName: employee.bankName ?? "", bankAccountNumber: employee.bankAccountNumber ?? "",
      baseSalary: String(employee.baseSalary ?? ""), currency: employee.currency ?? "NGN",
    });
    setEmployeeModal(true);
  };

  const saveEmployee = async () => {
    try {
      if (editingEmployee) await updateEmployeeMut.mutate(editingEmployee.id);
      else await createEmployeeMut.mutate();
      setEditingEmployee(null);
      setEmployeeModal(false);
      setEmployeeForm({ fullName: "", email: "", jobTitle: "", bankName: "", bankAccountNumber: "", baseSalary: "", currency: "NGN" });
      employees.refetch();
      toast(editingEmployee ? "Employee updated" : "Employee added to payroll", "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Could not save employee", "error"); }
  };

  const action = async (fn: () => Promise<unknown>, msg: string) => {
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
    } catch (e) {
      toast(e instanceof Error ? e.message : "Download failed", "error");
    }
  };

  const runList = runs.data ?? [];
  const empList = employees.data ?? [];
  const pendingList = pending.data ?? [];

  if (runs.loading || employees.loading) return <><DashboardHeader title="Payroll" subtitle="Manage payroll runs and employee compensation" /><PageLoader message="Loading payroll data…" /></>;
  if (runs.error) return <><DashboardHeader title="Payroll" subtitle="Manage payroll runs and employee compensation" /><PageError message={runs.error} onRetry={runs.refetch} /></>;

  return (
    <div>
      <DashboardHeader title="Payroll" subtitle="Manage payroll runs and employee compensation" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {companyId && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Showing payroll for company {companyId.slice(0, 8)}…
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-navy/40" />
            <div>
              <p className="text-2xl font-bold text-navy">{empList.length}</p>
              <p className="text-[11px] text-navy/45 uppercase tracking-wider">Employees</p>
            </div>
          </div>
          <div className="stat-card p-4 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-gold" />
            <div>
              <p className="text-2xl font-bold text-navy">{runList.filter(r => r.status === "PAID").length}</p>
              <p className="text-[11px] text-navy/45 uppercase tracking-wider">Paid Runs</p>
            </div>
          </div>
          <div className="stat-card p-4 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-violet-500" />
            <div>
              <p className="text-2xl font-bold text-navy">{pendingList.length}</p>
              <p className="text-[11px] text-navy/45 uppercase tracking-wider">Pending Approval</p>
            </div>
          </div>
          <div className="stat-card p-4 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-navy">{runList.filter(r => r.status === "APPROVED").length}</p>
              <p className="text-[11px] text-navy/45 uppercase tracking-wider">Approved</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-[13px] font-semibold text-navy">{runList.length} payroll runs</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { runs.refetch(); pending.refetch(); }} disabled={runs.loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${runs.loading ? "animate-spin" : ""}`} />
            </Button>
            <Can permission={PERMISSIONS.PAYROLL_MANAGE}><Button variant="primary" onClick={() => setCreateModal(true)}><Plus className="w-3.5 h-3.5" /> New Run</Button></Can>
          </div>
        </div>

        {/* Pending approvals inbox */}
        {pendingList.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-amber-600"><Calendar className="w-4 h-4" /> Awaiting Your Approval</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-navy/4">
                {pendingList.map((r) => (
                  <div key={r.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-[13px] font-semibold text-navy">{r.label || `Run ${r.id.slice(0, 8)}`}</p>
                      <p className="text-[11px] text-navy/45">{r.periodStart} → {r.periodEnd}</p>
                    </div>
                    {can(PERMISSIONS.PAYROLL_APPROVE) && <div className="flex items-center gap-2">
                      <Button variant="primary" size="xs" onClick={() => action(() => approveMut.mutate(r.id), "Approved")}>
                        <CheckCircle className="w-3 h-3" /> Approve
                      </Button>
                      <Button variant="ghost" size="xs" onClick={() => action(() => rejectMut.mutate(r.id), "Rejected")}>
                        <XCircle className="w-3 h-3 text-red-500" /> Reject
                      </Button>
                    </div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Runs table */}
        <Card>
          <CardHeader><CardTitle>Payroll Runs</CardTitle></CardHeader>
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
                      <tr key={r.id} className="hover:bg-navy/[0.015] transition-colors">
                        <td className="px-5 py-3 text-[13px] font-medium text-navy">{r.label || `Run ${r.id.slice(0, 8)}`}</td>
                        <td className="px-4 py-3 text-[12px] text-navy/60">{r.periodStart} → {r.periodEnd}</td>
                        <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{formatMoney(r.totalGross, r.currency, 0)}</td>
                        <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{formatMoney(r.totalNet, r.currency, 0)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={STATUS_VARIANT[r.status] ?? "default"} size="sm">{r.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {can(PERMISSIONS.PAYROLL_MANAGE) && r.status === "DRAFT" && (
                              <><Button variant="ghost" size="xs" onClick={() => setEditingRun(r)}><Pencil className="w-3 h-3" /> Edit</Button><Button variant="ghost" size="xs" onClick={() => action(() => submitMut.mutate(r.id), "Submitted for approval")}><Play className="w-3 h-3" /> Submit</Button></>
                            )}
                            {can(PERMISSIONS.PAYROLL_PAY) && r.status === "APPROVED" && (
                              <Button variant="primary" size="xs" onClick={() => action(() => payMut.mutate(r.id), "Marked as paid")}>
                                <CheckCircle className="w-3 h-3" /> Mark Paid
                              </Button>
                            )}
                            {can(PERMISSIONS.PAYROLL_PAY) && (r.status === "APPROVED" || r.status === "PAID") && (
                              <Button variant="ghost" size="xs" onClick={() => downloadBankFile(r.id)}>
                                <Download className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {runList.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-12 text-[13px] text-navy/30">No payroll runs yet. Create one to get started.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>

        {/* Employees */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>Employees ({empList.length})</CardTitle>
            <Can permission={PERMISSIONS.PAYROLL_MANAGE}><Button variant="primary" size="sm" onClick={() => setEmployeeModal(true)}><Plus className="w-3.5 h-3.5" /> Add employee</Button></Can>
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
                      {can(PERMISSIONS.PAYROLL_MANAGE) && <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/4">
                    {empList.map((e: PayrollEmployee) => (
                      <tr key={e.id} className="hover:bg-navy/[0.015] transition-colors">
                        <td className="px-5 py-3">
                          <p className="text-[13px] font-medium text-navy">{e.fullName}</p>
                          <p className="text-[11px] text-navy/40">{e.email}</p>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-navy/60">{e.jobTitle || "—"}</td>
                        <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{formatMoney(e.baseSalary, e.currency, 0)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={e.active ? "success" : "error"} size="sm">{e.active ? "Active" : "Inactive"}</Badge>
                        </td>
                        {can(PERMISSIONS.PAYROLL_MANAGE) && <td className="px-4 py-3 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="xs" onClick={() => openEmployeeEditor(e)}><Pencil className="w-3 h-3" /> Edit</Button>{e.active && <Button variant="ghost" size="xs" onClick={() => action(() => deactivateEmployeeMut.mutate(e.id), "Employee deactivated")}><Trash2 className="w-3 h-3 text-red-500" /> Deactivate</Button>}</div></td>}
                      </tr>
                    ))}
                    {empList.length === 0 && (
                      <tr><td colSpan={can(PERMISSIONS.PAYROLL_MANAGE) ? 5 : 4} className="text-center py-10 text-[13px] text-navy/30">No employees found</td></tr>
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

      <Modal isOpen={employeeModal} onClose={() => { setEmployeeModal(false); setEditingEmployee(null); }} title={editingEmployee ? "Edit Employee" : "Add Employee"}>
        <div className="space-y-4">
          <p className="text-[12px] text-navy/45">This employee will be added to the currently selected company&apos;s payroll.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Full name</label>
              <input value={employeeForm.fullName} onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })} placeholder="Ada Obi" className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Email</label>
              <input type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} placeholder="ada@company.com" className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Job title</label>
              <input value={employeeForm.jobTitle} onChange={(e) => setEmployeeForm({ ...employeeForm, jobTitle: e.target.value })} placeholder="Payroll Officer" className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Base salary</label>
              <input type="number" min="0" value={employeeForm.baseSalary} onChange={(e) => setEmployeeForm({ ...employeeForm, baseSalary: e.target.value })} placeholder="400000" className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Currency</label>
              <input value={employeeForm.currency} onChange={(e) => setEmployeeForm({ ...employeeForm, currency: e.target.value.toUpperCase() })} maxLength={3} placeholder="NGN" className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Bank name</label>
              <input value={employeeForm.bankName} onChange={(e) => setEmployeeForm({ ...employeeForm, bankName: e.target.value })} placeholder="Access Bank" className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Account number</label>
              <input value={employeeForm.bankAccountNumber} onChange={(e) => setEmployeeForm({ ...employeeForm, bankAccountNumber: e.target.value })} placeholder="0123456789" className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => { setEmployeeModal(false); setEditingEmployee(null); }}>Cancel</Button>
            <Button variant="primary" onClick={saveEmployee} disabled={createEmployeeMut.loading || updateEmployeeMut.loading || !employeeForm.fullName || !employeeForm.baseSalary}>
              {(createEmployeeMut.loading || updateEmployeeMut.loading) ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : editingEmployee ? "Save changes" : "Add employee"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editingRun} onClose={() => setEditingRun(null)} title="Edit Payroll Run">
        {editingRun && <div className="space-y-4"><div><label className="text-[12px] font-medium text-navy/60 block mb-1.5">Pay date</label><input type="date" value={editingRun.payDate ?? ""} onChange={(e) => setEditingRun({ ...editingRun, payDate: e.target.value })} className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" /></div><div><label className="text-[12px] font-medium text-navy/60 block mb-1.5">Note</label><textarea value={editingRun.note ?? ""} onChange={(e) => setEditingRun({ ...editingRun, note: e.target.value })} className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" rows={3} /></div><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setEditingRun(null)}>Cancel</Button><Button variant="primary" disabled={updateRunMut.loading} onClick={() => action(() => updateRunMut.mutate(editingRun.id, { note: editingRun.note, payDate: editingRun.payDate }), "Payroll run updated").then(() => setEditingRun(null))}>Save changes</Button></div></div>}
      </Modal>
    </div>
  );
}
