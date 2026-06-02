"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { DollarSign, Users, Calendar, Play } from "lucide-react";

export default function PayrollPage() {
  const { toast } = useToast();
  const [showRunModal, setShowRunModal] = useState(false);
  const [runs, setRuns] = useState([
    { id: 1, period: "May 16–31, 2026", employees: 24, gross: "$62,400", net: "$45,800", status: "completed" as const },
    { id: 2, period: "May 1–15, 2026", employees: 24, gross: "$62,400", net: "$45,800", status: "completed" as const },
    { id: 3, period: "Apr 16–30, 2026", employees: 23, gross: "$59,800", net: "$43,900", status: "completed" as const },
  ]);

  const handleRunPayroll = () => {
    const newRun = {
      id: runs.length + 1,
      period: "Jun 1–15, 2026",
      employees: 24,
      gross: "$63,200",
      net: "$46,400",
      status: "completed" as const,
    };
    setRuns((prev) => [newRun, ...prev]);
    setShowRunModal(false);
    toast("Payroll processed successfully! 24 employees paid.", "success");
  };

  return (
    <div>
      <DashboardHeader title="Payroll" subtitle="Payroll processing and employee compensation" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-8 h-8 text-navy" /><div><p className="text-2xl font-bold">24</p><p className="text-xs text-gray-500">Employees</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><DollarSign className="w-8 h-8 text-gold" /><div><p className="text-2xl font-bold">$124.8K</p><p className="text-xs text-gray-500">Monthly Gross</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Calendar className="w-8 h-8 text-violet-500" /><div><p className="text-2xl font-bold">Jun 15</p><p className="text-xs text-gray-500">Next Run</p></div></CardContent></Card>
          <Card className="cursor-pointer hover:shadow-md" onClick={() => setShowRunModal(true)}>
            <CardContent className="p-4 flex items-center gap-3"><Play className="w-8 h-8 text-amber-500" /><div><p className="text-sm font-bold text-amber-600">Run Payroll</p><p className="text-xs text-gray-500">Process next period</p></div></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payroll History</CardTitle>
            <Button variant="primary" size="sm" onClick={() => setShowRunModal(true)}><Play className="w-4 h-4" /> Run Payroll</Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Period</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Employees</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Gross Pay</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Net Pay</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{run.period}</td>
                    <td className="px-6 py-3 text-center text-gray-700">{run.employees}</td>
                    <td className="px-6 py-3 text-right text-gray-700">{run.gross}</td>
                    <td className="px-6 py-3 text-right text-gray-700">{run.net}</td>
                    <td className="px-6 py-3 text-center"><Badge variant="success">{run.status}</Badge></td>
                    <td className="px-6 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => toast("Downloading payroll report...", "info")}>Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={showRunModal} onClose={() => setShowRunModal(false)} title="Run Payroll">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Process payroll for the period <strong>Jun 1–15, 2026</strong></p>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Employees</span><span className="font-medium">24</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Estimated Gross</span><span className="font-medium">$63,200</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Estimated Net</span><span className="font-medium">$46,400</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Tax Withholdings</span><span className="font-medium">$16,800</span></div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowRunModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleRunPayroll}>Process Payroll</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
