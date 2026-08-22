"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { ClipboardCheck, Play, BarChart3, AlertTriangle } from "lucide-react";

export default function MockSurveyPage() {
  const { toast } = useToast();
  const [surveys, setSurveys] = useState([
    { id: 1, title: "ISO 27001 Full Audit Simulation", date: "May 20, 2026", score: 82, findings: 8, status: "completed" },
    { id: 2, title: "SOC 2 Readiness Check", date: "Apr 15, 2026", score: 76, findings: 12, status: "completed" },
    { id: 3, title: "Pre-certification Assessment", date: "Jun 10, 2026", score: null, findings: null, status: "scheduled" },
  ]);

  const handleStart = (id: number) => {
    setSurveys((prev) => prev.map((s) => s.id === id ? { ...s, status: "in-progress" } : s));
    toast("Mock survey started! Complete all sections.", "info");
  };

  return (
    <div>
      <DashboardHeader title="Mock Surveys" subtitle="Practice audits to prepare for certification" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><ClipboardCheck className="w-8 h-8 text-violet-500" /><div><p className="text-xl font-bold">3</p><p className="text-xs text-gray-500">Total Surveys</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><BarChart3 className="w-8 h-8 text-gold" /><div><p className="text-xl font-bold">79%</p><p className="text-xs text-gray-500">Avg Score</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-amber-500" /><div><p className="text-xl font-bold">20</p><p className="text-xs text-gray-500">Total Findings</p></div></CardContent></Card>
        </div>

        <div className="space-y-4">
          {surveys.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
                    <Badge variant={s.status === "completed" ? "success" : s.status === "in-progress" ? "info" : "warning"}>{s.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {s.status === "completed" ? `Score: ${s.score}% • ${s.findings} findings • ${s.date}` : `Scheduled: ${s.date}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {s.status === "scheduled" && (
                    <Button variant="primary" size="sm" onClick={() => handleStart(s.id)}><Play className="w-3 h-3" /> Start</Button>
                  )}
                  {s.status === "in-progress" && (
                    <Button variant="primary" size="sm" onClick={() => { setSurveys((prev) => prev.map((x) => x.id === s.id ? { ...x, status: "completed", score: 85, findings: 6 } : x)); toast("Survey completed! Score: 85%", "success"); }}>Complete</Button>
                  )}
                  {s.status === "completed" && (
                    <Button variant="outline" size="sm" onClick={() => toast("Viewing detailed report...", "info")}>View Report</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button variant="outline" onClick={() => toast("Scheduling new mock survey...", "info")}><Play className="w-3 h-3" /> Schedule New Survey</Button>
      </div>
    </div>
  );
}
