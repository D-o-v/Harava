"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface Task {
  id: number;
  title: string;
  assignee: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "completed" | "in-progress" | "not-started";
}

export default function ActionPlansPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Update mission statement per CARF 1.A.1", assignee: "Dr. Williams", dueDate: "Jun 15, 2026", priority: "high", status: "in-progress" },
    { id: 2, title: "Complete board meeting minutes", assignee: "Admin Team", dueDate: "Jun 20, 2026", priority: "high", status: "not-started" },
    { id: 3, title: "Document staff credential verification process", assignee: "HR Director", dueDate: "Jun 30, 2026", priority: "medium", status: "not-started" },
    { id: 4, title: "Schedule annual training compliance review", assignee: "Training Coordinator", dueDate: "Jul 5, 2026", priority: "medium", status: "in-progress" },
    { id: 5, title: "Conduct emergency drill and document results", assignee: "Safety Officer", dueDate: "Jul 10, 2026", priority: "low", status: "not-started" },
    { id: 6, title: "Install patient rights postings in all areas", assignee: "Facilities", dueDate: "Jun 10, 2026", priority: "low", status: "completed" },
  ]);

  const handleComplete = (id: number) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "completed" as const } : t));
    toast("Task marked as complete!", "success");
  };

  const handleStart = (id: number) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "in-progress" as const } : t));
    toast("Task started", "info");
  };

  return (
    <div>
      <DashboardHeader title="Corrective Action Plans" subtitle="90-day remediation task management" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-6 h-6 text-amber-500" /><div><p className="text-xl font-bold">{tasks.filter(t => t.status === "not-started").length}</p><p className="text-xs text-gray-500">Not Started</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-6 h-6 text-navy" /><div><p className="text-xl font-bold">{tasks.filter(t => t.status === "in-progress").length}</p><p className="text-xs text-gray-500">In Progress</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-6 h-6 text-gold" /><div><p className="text-xl font-bold">{tasks.filter(t => t.status === "completed").length}</p><p className="text-xs text-gray-500">Completed</p></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Action Items</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto"><table className="w-full text-sm min-w-150">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Task</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Assignee</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Due Date</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Priority</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{task.title}</td>
                    <td className="px-6 py-3 text-gray-600">{task.assignee}</td>
                    <td className="px-6 py-3 text-gray-500">{task.dueDate}</td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "info"}>{task.priority}</Badge>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={task.status === "completed" ? "success" : task.status === "in-progress" ? "warning" : "default"}>{task.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {task.status === "not-started" && <Button variant="outline" size="sm" onClick={() => handleStart(task.id)}>Start</Button>}
                      {task.status === "in-progress" && <Button variant="primary" size="sm" onClick={() => handleComplete(task.id)}>Complete</Button>}
                      {task.status === "completed" && <CheckCircle className="w-5 h-5 text-gold inline" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
