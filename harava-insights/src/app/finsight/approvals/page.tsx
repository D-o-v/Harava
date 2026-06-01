"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";

interface ApprovalItem {
  id: number;
  title: string;
  amount: string;
  type: string;
  submittedBy: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

export default function ApprovalsPage() {
  const { toast } = useToast();
  const [viewItem, setViewItem] = useState<ApprovalItem | null>(null);
  const [items, setItems] = useState<ApprovalItem[]>([
    { id: 1, title: "Invoice #4521 - ABC Corp", amount: "$12,450", type: "Invoice", submittedBy: "Mike Johnson", date: "Jun 1, 2026", status: "pending" },
    { id: 2, title: "Expense Report - Marketing Q2", amount: "$3,200", type: "Expense", submittedBy: "Sarah Kim", date: "May 30, 2026", status: "pending" },
    { id: 3, title: "PO #892 - Office Supplies", amount: "$890", type: "Purchase Order", submittedBy: "Lisa Chen", date: "May 29, 2026", status: "pending" },
    { id: 4, title: "Invoice #4518 - Delta Inc", amount: "$28,000", type: "Invoice", submittedBy: "John Davis", date: "May 28, 2026", status: "pending" },
    { id: 5, title: "Travel Expense - NYC Conference", amount: "$4,500", type: "Expense", submittedBy: "Emma Wilson", date: "May 27, 2026", status: "pending" },
    { id: 6, title: "Invoice #4515 - Omega LLC", amount: "$7,800", type: "Invoice", submittedBy: "Mike Johnson", date: "May 25, 2026", status: "approved" },
    { id: 7, title: "Software License - Adobe", amount: "$2,400", type: "Purchase Order", submittedBy: "Sarah Kim", date: "May 24, 2026", status: "rejected" },
  ]);

  const handleApprove = (id: number) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: "approved" as const } : item));
    toast("Item approved successfully!", "success");
    setViewItem(null);
  };

  const handleReject = (id: number) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: "rejected" as const } : item));
    toast("Item rejected", "warning");
    setViewItem(null);
  };

  const pending = items.filter((i) => i.status === "pending");
  const completed = items.filter((i) => i.status !== "pending");

  return (
    <div>
      <DashboardHeader title="Internal Controls & Approvals" subtitle="Financial approval workflows and control monitoring" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-500" />
              <div><p className="text-2xl font-bold">{pending.length}</p><p className="text-xs text-gray-500">Pending</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <div><p className="text-2xl font-bold">{items.filter(i => i.status === "approved").length}</p><p className="text-xs text-gray-500">Approved</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div><p className="text-2xl font-bold">{items.filter(i => i.status === "rejected").length}</p><p className="text-xs text-gray-500">Rejected</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Items */}
        <Card>
          <CardHeader><CardTitle>Pending Approvals</CardTitle></CardHeader>
          <CardContent className="p-0">
            {pending.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <p>All caught up! No pending items.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Item</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Type</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Amount</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Submitted By</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                    <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pending.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-3"><Badge variant="info">{item.type}</Badge></td>
                      <td className="px-6 py-3 text-gray-700">{item.amount}</td>
                      <td className="px-6 py-3 text-gray-600">{item.submittedBy}</td>
                      <td className="px-6 py-3 text-gray-500">{item.date}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setViewItem(item)}><Eye className="w-4 h-4" /></Button>
                          <Button variant="primary" size="sm" onClick={() => handleApprove(item.id)}>Approve</Button>
                          <Button variant="outline" size="sm" onClick={() => handleReject(item.id)}>Reject</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Completed */}
        {completed.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Recent Decisions</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Item</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Amount</th>
                    <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                    <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {completed.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-3 text-gray-700">{item.amount}</td>
                      <td className="px-6 py-3 text-gray-500">{item.date}</td>
                      <td className="px-6 py-3 text-center">
                        <Badge variant={item.status === "approved" ? "success" : "error"}>{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Detail Modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Approval Details">
        {viewItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Title</p><p className="text-sm font-medium">{viewItem.title}</p></div>
              <div><p className="text-xs text-gray-500">Amount</p><p className="text-sm font-medium">{viewItem.amount}</p></div>
              <div><p className="text-xs text-gray-500">Type</p><p className="text-sm font-medium">{viewItem.type}</p></div>
              <div><p className="text-xs text-gray-500">Submitted By</p><p className="text-sm font-medium">{viewItem.submittedBy}</p></div>
              <div><p className="text-xs text-gray-500">Date</p><p className="text-sm font-medium">{viewItem.date}</p></div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => handleReject(viewItem.id)}>Reject</Button>
              <Button variant="primary" onClick={() => handleApprove(viewItem.id)}>Approve</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
