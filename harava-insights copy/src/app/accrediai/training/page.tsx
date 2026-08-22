"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { GraduationCap, Users, CheckCircle, Clock } from "lucide-react";

export default function TrainingPage() {
  const { toast } = useToast();
  const [modules, setModules] = useState([
    { id: 1, title: "Information Security Awareness", assigned: 45, completed: 38, due: "Jun 30, 2026", status: "active" },
    { id: 2, title: "Data Privacy & GDPR", assigned: 45, completed: 45, due: "May 15, 2026", status: "completed" },
    { id: 3, title: "Incident Reporting Procedures", assigned: 30, completed: 12, due: "Jul 15, 2026", status: "active" },
    { id: 4, title: "Physical Security Protocols", assigned: 20, completed: 20, due: "Apr 30, 2026", status: "completed" },
    { id: 5, title: "Social Engineering Awareness", assigned: 45, completed: 5, due: "Aug 1, 2026", status: "active" },
  ]);

  const handleRemind = (id: number) => {
    toast("Reminder sent to incomplete participants!", "success");
  };

  return (
    <div>
      <DashboardHeader title="Compliance Training" subtitle="Track team training progress for accreditation" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><GraduationCap className="w-8 h-8 text-violet-500" /><div><p className="text-xl font-bold">5</p><p className="text-xs text-gray-500">Training Modules</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-8 h-8 text-gold" /><div><p className="text-xl font-bold">65%</p><p className="text-xs text-gray-500">Overall Completion</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-8 h-8 text-navy" /><div><p className="text-xl font-bold">45</p><p className="text-xs text-gray-500">Team Members</p></div></CardContent></Card>
        </div>

        <div className="space-y-4">
          {modules.map((m) => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{m.title}</h3>
                    <Badge variant={m.status === "completed" ? "success" : "info"}>{m.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{m.completed} of {m.assigned} completed • Due: {m.due}</p>
                  <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-navy rounded-full" style={{ width: `${(m.completed / m.assigned) * 100}%` }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  {m.status === "active" && (
                    <Button variant="outline" size="sm" onClick={() => handleRemind(m.id)}>Send Reminder</Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => toast("Viewing training details...", "info")}>Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
