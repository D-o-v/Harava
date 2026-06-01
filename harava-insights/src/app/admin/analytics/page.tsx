"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { BarChart3, Users, Clock, TrendingUp, Download } from "lucide-react";

export default function AnalyticsPage() {
  const { toast } = useToast();

  return (
    <div>
      <DashboardHeader title="Platform Analytics" subtitle="Usage metrics and performance insights" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => toast("Exporting analytics report...", "success")}><Download className="w-3 h-3" /> Export</Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-8 h-8 text-violet-500" /><div><p className="text-xl font-bold">3,456</p><p className="text-xs text-gray-500">Monthly Active Users</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-8 h-8 text-blue-500" /><div><p className="text-xl font-bold">24 min</p><p className="text-xs text-gray-500">Avg Session Duration</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><TrendingUp className="w-8 h-8 text-emerald-500" /><div><p className="text-xl font-bold">89%</p><p className="text-xs text-gray-500">User Satisfaction</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><BarChart3 className="w-8 h-8 text-amber-500" /><div><p className="text-xl font-bold">99.9%</p><p className="text-xs text-gray-500">Uptime</p></div></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Product Usage</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { product: "FinSight", users: 560, percentage: 45 },
                { product: "AccrediAI", users: 380, percentage: 30 },
                { product: "ProEd", users: 307, percentage: 25 },
              ].map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{p.product}</span>
                    <span className="text-xs text-gray-500">{p.users} users ({p.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${p.percentage}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Top Features</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { feature: "AI Intelligence Queries", usage: "12,450/mo" },
                { feature: "Document Uploads", usage: "3,890/mo" },
                { feature: "Course Completions", usage: "567/mo" },
                { feature: "Reports Generated", usage: "2,340/mo" },
                { feature: "Compliance Checks", usage: "890/mo" },
              ].map((f, i) => (
                <div key={i} className="flex items-center justify-between p-2 border-b last:border-0">
                  <span className="text-sm text-gray-700">{f.feature}</span>
                  <span className="text-sm font-medium text-gray-900">{f.usage}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
