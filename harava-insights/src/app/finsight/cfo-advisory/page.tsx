"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Download } from "lucide-react";

export default function CfoAdvisoryPage() {
  const { toast } = useToast();

  const insights = [
    { id: 1, title: "Cash Reserve Optimization", priority: "high", category: "Cash Management", summary: "Current cash reserves exceed optimal levels by 23%. Consider short-term investments to improve yield.", action: "Review Investment Options" },
    { id: 2, title: "Revenue Concentration Risk", priority: "medium", category: "Risk", summary: "Top 3 clients account for 67% of revenue. Diversification recommended.", action: "View Client Analysis" },
    { id: 3, title: "Cost Reduction Opportunity", priority: "high", category: "Operations", summary: "AI analysis identified $45K in potential annual savings through vendor consolidation.", action: "View Recommendations" },
    { id: 4, title: "Working Capital Improvement", priority: "low", category: "Cash Management", summary: "DSO has improved 12% QoQ. Current trajectory suggests further improvement possible.", action: "Track Progress" },
    { id: 5, title: "Tax Planning Alert", priority: "medium", category: "Tax", summary: "Q3 estimated taxes due in 45 days. Current provision may be under-estimated by $12K.", action: "Review Tax Position" },
  ];

  return (
    <div>
      <DashboardHeader title="CFO Advisory" subtitle="AI-powered strategic financial insights" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Brain className="w-8 h-8 text-violet-500" /><div><p className="text-xl font-bold">5</p><p className="text-xs text-gray-500">Active Insights</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><TrendingUp className="w-8 h-8 text-emerald-500" /><div><p className="text-xl font-bold">$45K</p><p className="text-xs text-gray-500">Savings Identified</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-amber-500" /><div><p className="text-xl font-bold">2</p><p className="text-xs text-gray-500">High Priority</p></div></CardContent></Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => toast("Generating advisory report...", "success")}><Download className="w-3 h-3" /> Export Advisory Report</Button>
        </div>

        <div className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-semibold text-gray-900">{insight.title}</h3>
                      <Badge variant={insight.priority === "high" ? "error" : insight.priority === "medium" ? "warning" : "success"}>{insight.priority}</Badge>
                      <Badge variant="default">{insight.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{insight.summary}</p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => toast(`Opening: ${insight.action}`, "info")}>{insight.action}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
