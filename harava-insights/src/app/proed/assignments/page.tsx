"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { FileText, Upload, CheckCircle } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  score: number | null;
  status: "submitted" | "pending" | "graded" | "overdue";
}

export default function AssignmentsPage() {
  const { toast } = useToast();
  const [submitModal, setSubmitModal] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, title: "Financial Ratio Analysis Report", course: "Financial Statement Analysis", dueDate: "Jun 5, 2026", score: null, status: "pending" },
    { id: 2, title: "Cash Flow Projection Model", course: "Cash Flow Forecasting", dueDate: "Jun 8, 2026", score: null, status: "pending" },
    { id: 3, title: "AI Use Case Presentation", course: "AI in Accounting", dueDate: "Jun 3, 2026", score: null, status: "overdue" },
    { id: 4, title: "Income Statement Interpretation", course: "Financial Statement Analysis", dueDate: "May 28, 2026", score: 92, status: "graded" },
    { id: 5, title: "Variance Analysis Exercise", course: "Financial Statement Analysis", dueDate: "May 20, 2026", score: 88, status: "graded" },
    { id: 6, title: "Forecasting Methodology Paper", course: "Cash Flow Forecasting", dueDate: "May 25, 2026", score: null, status: "submitted" },
  ]);

  const handleSubmit = (id: number) => {
    setAssignments((prev) => prev.map((a) => a.id === id ? { ...a, status: "submitted" as const } : a));
    setSubmitModal(null);
    toast("Assignment submitted successfully!", "success");
  };

  return (
    <div>
      <DashboardHeader title="Assignments" subtitle="Track and submit your course assignments" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold text-amber-600">{assignments.filter(a => a.status === "pending").length}</p><p className="text-xs text-gray-500">Pending</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold text-red-600">{assignments.filter(a => a.status === "overdue").length}</p><p className="text-xs text-gray-500">Overdue</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold text-blue-600">{assignments.filter(a => a.status === "submitted").length}</p><p className="text-xs text-gray-500">Submitted</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-xl font-bold text-emerald-600">{assignments.filter(a => a.status === "graded").length}</p><p className="text-xs text-gray-500">Graded</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Assignment</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Course</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Due Date</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Score</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{a.title}</td>
                    <td className="px-6 py-3 text-gray-600">{a.course}</td>
                    <td className="px-6 py-3 text-gray-500">{a.dueDate}</td>
                    <td className="px-6 py-3 text-center text-gray-700">{a.score ? `${a.score}%` : "—"}</td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={a.status === "graded" ? "success" : a.status === "submitted" ? "info" : a.status === "overdue" ? "error" : "warning"}>{a.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {(a.status === "pending" || a.status === "overdue") && (
                        <Button variant="primary" size="sm" onClick={() => setSubmitModal(a)}><Upload className="w-3 h-3" /> Submit</Button>
                      )}
                      {a.status === "graded" && (
                        <Button variant="ghost" size="sm" onClick={() => toast("Viewing feedback...", "info")}>View Feedback</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Modal open={!!submitModal} onClose={() => setSubmitModal(null)} title="Submit Assignment">
        {submitModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Submitting: <strong>{submitModal.title}</strong></p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drag & drop your file or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX up to 10MB</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => toast("File selected (demo)", "info")}>Choose File</Button>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSubmitModal(null)}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSubmit(submitModal.id)}>Submit Assignment</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
