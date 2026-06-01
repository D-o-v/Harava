"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { FileText, Download, Eye, Plus, CheckCircle } from "lucide-react";

export default function PoliciesPage() {
  const { toast } = useToast();
  const [addModal, setAddModal] = useState(false);
  const [policies, setPolicies] = useState([
    { id: 1, title: "Information Security Policy", version: "3.2", lastReview: "May 2026", status: "approved", owner: "CISO" },
    { id: 2, title: "Data Protection & Privacy", version: "2.1", lastReview: "Apr 2026", status: "approved", owner: "DPO" },
    { id: 3, title: "Incident Response Plan", version: "1.8", lastReview: "Mar 2026", status: "review", owner: "Security Team" },
    { id: 4, title: "Access Control Policy", version: "2.5", lastReview: "May 2026", status: "approved", owner: "IT Manager" },
    { id: 5, title: "Business Continuity Plan", version: "1.3", lastReview: "Feb 2026", status: "draft", owner: "Operations" },
    { id: 6, title: "Acceptable Use Policy", version: "4.0", lastReview: "Apr 2026", status: "approved", owner: "HR" },
  ]);

  const handleApprove = (id: number) => {
    setPolicies((prev) => prev.map((p) => p.id === id ? { ...p, status: "approved" } : p));
    toast("Policy approved!", "success");
  };

  return (
    <div>
      <DashboardHeader title="Policies & Documents" subtitle="Manage compliance policies and documentation" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setAddModal(true)}><Plus className="w-3 h-3" /> New Policy</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Policy</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Version</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Last Review</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Owner</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" />{p.title}</td>
                    <td className="px-6 py-3 text-center text-gray-600">v{p.version}</td>
                    <td className="px-6 py-3 text-center text-gray-500">{p.lastReview}</td>
                    <td className="px-6 py-3 text-center text-gray-500">{p.owner}</td>
                    <td className="px-6 py-3 text-center"><Badge variant={p.status === "approved" ? "success" : p.status === "review" ? "warning" : "default"}>{p.status}</Badge></td>
                    <td className="px-6 py-3 text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => toast("Opening policy...", "info")}><Eye className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => toast("Downloading PDF...", "success")}><Download className="w-3 h-3" /></Button>
                      {p.status !== "approved" && <Button variant="outline" size="sm" onClick={() => handleApprove(p.id)}><CheckCircle className="w-3 h-3" /> Approve</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Create New Policy">
        <div className="space-y-4">
          <div><label className="text-xs text-gray-500">Policy Title</label><input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="Enter policy title" /></div>
          <div><label className="text-xs text-gray-500">Owner</label><input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="Responsible team/person" /></div>
          <div><label className="text-xs text-gray-500">Description</label><textarea className="w-full border rounded-lg px-3 py-2 text-sm mt-1" rows={3} placeholder="Policy description..." /></div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setAddModal(false); toast("Policy draft created!", "success"); }}>Create Draft</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
