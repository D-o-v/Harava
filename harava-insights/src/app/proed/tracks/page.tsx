"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Target, BookOpen, CheckCircle } from "lucide-react";

export default function TracksPage() {
  const { toast } = useToast();
  const [tracks] = useState([
    { id: 1, title: "Chartered Accountant Path", courses: 8, completed: 5, progress: 63, status: "active" },
    { id: 2, title: "CFO Leadership Track", courses: 6, completed: 2, progress: 33, status: "active" },
    { id: 3, title: "AI & Digital Finance", courses: 5, completed: 5, progress: 100, status: "completed" },
    { id: 4, title: "Tax Specialist Certification", courses: 7, completed: 0, progress: 0, status: "available" },
    { id: 5, title: "Risk & Compliance", courses: 6, completed: 0, progress: 0, status: "available" },
  ]);

  return (
    <div>
      <DashboardHeader title="Learning Tracks" subtitle="Structured pathways to professional goals" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4">
          {tracks.map((track) => (
            <Card key={track.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${track.status === "completed" ? "bg-navy/10" : track.status === "active" ? "bg-violet-100" : "bg-gray-100"}`}>
                    {track.status === "completed" ? <CheckCircle className="w-6 h-6 text-navy" /> : <Target className="w-6 h-6 text-violet-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{track.title}</h3>
                    <p className="text-xs text-gray-500">{track.completed} of {track.courses} courses completed</p>
                    <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${track.progress}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={track.status === "completed" ? "success" : track.status === "active" ? "info" : "default"}>{track.status}</Badge>
                  {track.status === "available" ? (
                    <Button variant="primary" size="sm" onClick={() => toast(`Started "${track.title}" track!`, "success")}>Start Track</Button>
                  ) : track.status === "active" ? (
                    <Button variant="outline" size="sm" onClick={() => toast("Continuing next course...", "info")}>Continue</Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => toast("Viewing certificate...", "info")}>View Cert</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
