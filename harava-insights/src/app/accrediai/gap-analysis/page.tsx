"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { AlertTriangle, CheckCircle, Eye } from "lucide-react";

interface Gap {
  id: number;
  standard: string;
  section: string;
  description: string;
  severity: "critical" | "major" | "minor";
  status: "open" | "in-progress" | "resolved";
}

export default function GapAnalysisPage() {
  const { toast } = useToast();
  const [viewGap, setViewGap] = useState<Gap | null>(null);
  const [gaps, setGaps] = useState<Gap[]>([
    { id: 1, standard: "CARF 1.A.1", section: "Leadership", description: "Mission statement does not align with CARF requirements", severity: "critical", status: "open" },
    { id: 2, standard: "CARF 1.B.3", section: "Governance", description: "Board meeting minutes incomplete for last quarter", severity: "major", status: "in-progress" },
    { id: 3, standard: "CARF 2.A.2", section: "HR", description: "Staff credential verification process needs documentation", severity: "major", status: "open" },
    { id: 4, standard: "CARF 2.C.1", section: "Training", description: "Annual training compliance below threshold", severity: "critical", status: "in-progress" },
    { id: 5, standard: "CARF 3.A.4", section: "Health & Safety", description: "Emergency drill documentation incomplete", severity: "minor", status: "open" },
    { id: 6, standard: "CARF 3.B.2", section: "Rights", description: "Patient rights posting not in all required areas", severity: "minor", status: "resolved" },
  ]);

  const handleResolve = (id: number) => {
    setGaps((prev) => prev.map((g) => g.id === id ? { ...g, status: "resolved" as const } : g));
    toast("Gap marked as resolved!", "success");
    setViewGap(null);
  };

  const handleStartWork = (id: number) => {
    setGaps((prev) => prev.map((g) => g.id === id ? { ...g, status: "in-progress" as const } : g));
    toast("Gap moved to in-progress", "info");
  };

  return (
    <div>
      <DashboardHeader title="Gap Analysis" subtitle="CARF standards compliance gaps and remediation" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-600">{gaps.filter(g => g.status === "open").length}</p><p className="text-xs text-gray-500">Open Gaps</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{gaps.filter(g => g.status === "in-progress").length}</p><p className="text-xs text-gray-500">In Progress</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-navy">{gaps.filter(g => g.status === "resolved").length}</p><p className="text-xs text-gray-500">Resolved</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Compliance Gaps</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Standard</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Section</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Description</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Severity</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {gaps.map((gap) => (
                  <tr key={gap.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-gray-700">{gap.standard}</td>
                    <td className="px-6 py-3 text-gray-600">{gap.section}</td>
                    <td className="px-6 py-3 text-gray-900 max-w-xs truncate">{gap.description}</td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={gap.severity === "critical" ? "error" : gap.severity === "major" ? "warning" : "info"}>{gap.severity}</Badge>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={gap.status === "resolved" ? "success" : gap.status === "in-progress" ? "warning" : "default"}>{gap.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewGap(gap)}><Eye className="w-4 h-4" /></Button>
                        {gap.status === "open" && <Button variant="primary" size="sm" onClick={() => handleStartWork(gap.id)}>Start</Button>}
                        {gap.status === "in-progress" && <Button variant="primary" size="sm" onClick={() => handleResolve(gap.id)}>Resolve</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={!!viewGap} onClose={() => setViewGap(null)} title="Gap Details">
        {viewGap && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Standard</p><p className="text-sm font-mono">{viewGap.standard}</p></div>
              <div><p className="text-xs text-gray-500">Section</p><p className="text-sm">{viewGap.section}</p></div>
              <div><p className="text-xs text-gray-500">Severity</p><Badge variant={viewGap.severity === "critical" ? "error" : "warning"}>{viewGap.severity}</Badge></div>
              <div><p className="text-xs text-gray-500">Status</p><Badge variant={viewGap.status === "resolved" ? "success" : "default"}>{viewGap.status}</Badge></div>
            </div>
            <div><p className="text-xs text-gray-500">Description</p><p className="text-sm mt-1">{viewGap.description}</p></div>
            {viewGap.status !== "resolved" && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="primary" onClick={() => handleResolve(viewGap.id)}>Mark Resolved</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
