"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { payrollApi } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";
import { CheckCircle, XCircle, Clock, Loader2, RefreshCw } from "lucide-react";

const STATUS_VARIANT: Record<string, "default" | "warning" | "success" | "error"> = {
  DRAFT: "default", PENDING_APPROVAL: "warning", APPROVED: "success", REJECTED: "error", PAID: "success",
};

export default function ApprovalsPage() {
  const { toast } = useToast();

  const pending = useApi(() => payrollApi.pendingApproval(), [], { pollMs: 30_000 });
  const allRuns = useApi(() => payrollApi.listRuns(), []);

  const approveMut = useMutation((id: string) => payrollApi.approve(id));
  const rejectMut = useMutation((id: string) => payrollApi.reject(id));

  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try { await fn(); toast(msg, "success"); pending.refetch(); allRuns.refetch(); }
    catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
  };

  const pendingList = pending.data ?? [];
  const runList = allRuns.data ?? [];
  const completed = runList.filter((r) => r.status === "APPROVED" || r.status === "REJECTED" || r.status === "PAID");

  if (pending.loading) return <><DashboardHeader title="Payroll Approvals" subtitle="Review and approve payroll runs" /><PageLoader message="Loading approvals…" /></>;
  if (pending.error) return <><DashboardHeader title="Payroll Approvals" subtitle="Review and approve payroll runs" /><PageError message={pending.error} onRetry={pending.refetch} /></>;

  return (
    <div>
      <DashboardHeader title="Payroll Approvals" subtitle="Review and approve payroll runs" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card p-4 flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-500" />
            <div><p className="text-2xl font-bold text-navy">{pendingList.length}</p><p className="text-[11px] text-navy/45 uppercase tracking-wider">Pending</p></div>
          </div>
          <div className="stat-card p-4 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
            <div><p className="text-2xl font-bold text-navy">{runList.filter(r => r.status === "APPROVED" || r.status === "PAID").length}</p><p className="text-[11px] text-navy/45 uppercase tracking-wider">Approved</p></div>
          </div>
          <div className="stat-card p-4 flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div><p className="text-2xl font-bold text-navy">{runList.filter(r => r.status === "REJECTED").length}</p><p className="text-[11px] text-navy/45 uppercase tracking-wider">Rejected</p></div>
          </div>
        </div>

        {/* Pending */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Approvals</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => pending.refetch()} disabled={pending.loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${pending.loading ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {pendingList.length === 0 ? (
              <div className="p-10 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <p className="text-[13px] text-navy/40">All caught up — no pending approvals.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-navy/[0.02] border-b border-navy/6">
                    <tr>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Run</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Period</th>
                      <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/4">
                    {pendingList.map((r) => (
                      <tr key={r.id} className="hover:bg-navy/[0.015] transition-colors">
                        <td className="px-5 py-3 text-[13px] font-medium text-navy">{r.label || `Run ${r.id.slice(0, 8)}`}</td>
                        <td className="px-4 py-3 text-[12px] text-navy/60">{r.periodStart} → {r.periodEnd}</td>
                        <td className="px-4 py-3 text-center"><Badge variant={STATUS_VARIANT[r.status] ?? "default"} size="sm">{r.status}</Badge></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="primary" size="xs" onClick={() => act(() => approveMut.mutate(r.id), "Approved")}>
                              <CheckCircle className="w-3 h-3" /> Approve
                            </Button>
                            <Button variant="ghost" size="xs" onClick={() => act(() => rejectMut.mutate(r.id), "Rejected")}>
                              <XCircle className="w-3 h-3 text-red-500" /> Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent decisions */}
        {completed.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Recent Decisions</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-navy/[0.02] border-b border-navy/6">
                    <tr>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Run</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Period</th>
                      <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/4">
                    {completed.map((r) => (
                      <tr key={r.id} className="hover:bg-navy/[0.015] transition-colors">
                        <td className="px-5 py-3 text-[13px] font-medium text-navy">{r.label || `Run ${r.id.slice(0, 8)}`}</td>
                        <td className="px-4 py-3 text-[12px] text-navy/60">{r.periodStart} → {r.periodEnd}</td>
                        <td className="px-4 py-3 text-center"><Badge variant={STATUS_VARIANT[r.status] ?? "default"} size="sm">{r.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
