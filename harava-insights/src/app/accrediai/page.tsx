"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { Target, Users, Clock, CheckCircle, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";

export default function AccrediAIDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const engagements = [
    { name: "Beta Healthcare", phase: "Gap Analysis", progress: 65, dueDate: "Aug 15, 2026" },
    { name: "Alpha Rehabilitation", phase: "Policy Build", progress: 40, dueDate: "Sep 30, 2026" },
    { name: "Omega Behavioral", phase: "Readiness", progress: 25, dueDate: "Nov 1, 2026" },
  ];

  return (
    <div>
      <DashboardHeader title={`Welcome, ${user?.firstName || "User"}`} subtitle="Accreditation compliance overview" />

      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/accrediai/pipeline")}>
            <CardContent className="p-5 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div><p className="text-2xl font-bold">7</p><p className="text-xs text-gray-500">Active Clients</p></div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/accrediai/readiness")}>
            <CardContent className="p-5 flex items-center gap-3">
              <Target className="w-8 h-8 text-emerald-500" />
              <div><p className="text-2xl font-bold">72%</p><p className="text-xs text-gray-500">Avg. Readiness</p></div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/accrediai/gap-analysis")}>
            <CardContent className="p-5 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              <div><p className="text-2xl font-bold">12</p><p className="text-xs text-gray-500">Open Gaps</p></div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/accrediai/action-plans")}>
            <CardContent className="p-5 flex items-center gap-3">
              <Clock className="w-8 h-8 text-violet-500" />
              <div><p className="text-2xl font-bold">3</p><p className="text-xs text-gray-500">Upcoming Deadlines</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Active Engagements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Engagements</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/accrediai/pipeline")}>View All <ArrowRight className="w-3 h-3" /></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagements.map((eng, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push("/accrediai/readiness")}>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{eng.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="info">{eng.phase}</Badge>
                      <span className="text-xs text-gray-500">Due: {eng.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${eng.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8">{eng.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/accrediai/gap-analysis")}>
            <CardContent className="p-5 text-center">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Gap Analysis</p>
              <p className="text-xs text-gray-500">Review compliance gaps</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/accrediai/policies")}>
            <CardContent className="p-5 text-center">
              <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Policy Manual</p>
              <p className="text-xs text-gray-500">Manage policies & procedures</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/accrediai/mock-survey")}>
            <CardContent className="p-5 text-center">
              <Target className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Mock Survey</p>
              <p className="text-xs text-gray-500">Prepare for live survey</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
