"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Shield, CheckCircle, AlertTriangle, XCircle, Download } from "lucide-react";

export default function CompliancePage() {
  const { toast } = useToast();
  const [controls, setControls] = useState([
    { id: 1, name: "A.5 - Information Security Policies", status: "compliant", evidence: 4 },
    { id: 2, name: "A.6 - Organization of Information Security", status: "compliant", evidence: 3 },
    { id: 3, name: "A.7 - Human Resource Security", status: "partial", evidence: 2 },
    { id: 4, name: "A.8 - Asset Management", status: "compliant", evidence: 5 },
    { id: 5, name: "A.9 - Access Control", status: "non-compliant", evidence: 1 },
    { id: 6, name: "A.10 - Cryptography", status: "compliant", evidence: 3 },
    { id: 7, name: "A.11 - Physical & Environmental Security", status: "partial", evidence: 2 },
    { id: 8, name: "A.12 - Operations Security", status: "compliant", evidence: 6 },
  ]);

  const handleRemediate = (id: number) => {
    setControls((prev) => prev.map((c) => c.id === id ? { ...c, status: "compliant" } : c));
    toast("Control marked as remediated!", "success");
  };

  const compliant = controls.filter((c) => c.status === "compliant").length;
  const partial = controls.filter((c) => c.status === "partial").length;
  const nonCompliant = controls.filter((c) => c.status === "non-compliant").length;

  return (
    <div>
      <DashboardHeader title="Compliance Tracker" subtitle="Monitor compliance across all control domains" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold text-gray-900">{controls.length}</p><p className="text-xs text-gray-500">Total Controls</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold text-emerald-600">{compliant}</p><p className="text-xs text-gray-500">Compliant</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold text-amber-600">{partial}</p><p className="text-xs text-gray-500">Partial</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold text-red-600">{nonCompliant}</p><p className="text-xs text-gray-500">Non-Compliant</p></CardContent></Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => toast("Exporting compliance report...", "success")}><Download className="w-3 h-3" /> Export Report</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Control</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Evidence</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {controls.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2">
                      {c.status === "compliant" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : c.status === "partial" ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      {c.name}
                    </td>
                    <td className="px-6 py-3 text-center text-gray-500">{c.evidence} items</td>
                    <td className="px-6 py-3 text-center"><Badge variant={c.status === "compliant" ? "success" : c.status === "partial" ? "warning" : "error"}>{c.status}</Badge></td>
                    <td className="px-6 py-3 text-right">
                      {c.status !== "compliant" && <Button variant="outline" size="sm" onClick={() => handleRemediate(c.id)}>Remediate</Button>}
                      <Button variant="ghost" size="sm" onClick={() => toast("Viewing control details...", "info")}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
