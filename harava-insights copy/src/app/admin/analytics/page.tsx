"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { TrendChart, MetricBarChart, DonutChart, MetricLineChart, ChartCard } from "@/components/ui/charts";
import { BarChart3, Users, Clock, TrendingUp, Download, Globe, Smartphone, Monitor, ArrowUpRight } from "lucide-react";

export default function AnalyticsPage() {
  const { toast } = useToast();

  return (
    <div>
      <DashboardHeader title="Platform Analytics" subtitle="Deep insights into usage, engagement, and performance" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => toast("Exporting analytics report...", "success")}><Download className="w-3.5 h-3.5" /> Export</Button>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <div className="stat-card p-4 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Monthly Active Users</p>
                <p className="text-2xl font-bold text-navy mt-1">3,456</p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-navy bg-navy/5 px-1.5 py-0.5 rounded-md mt-1"><ArrowUpRight className="w-2.5 h-2.5" />+22%</span>
              </div>
              <Users className="w-8 h-8 text-navy/15 group-hover:text-navy/25 transition-colors" />
            </div>
          </div>
          <div className="stat-card p-4 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Avg Session Duration</p>
                <p className="text-2xl font-bold text-navy mt-1">24 min</p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-navy bg-navy/5 px-1.5 py-0.5 rounded-md mt-1"><ArrowUpRight className="w-2.5 h-2.5" />+4 min</span>
              </div>
              <Clock className="w-8 h-8 text-navy/15 group-hover:text-navy/25 transition-colors" />
            </div>
          </div>
          <div className="stat-card p-4 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">User Satisfaction</p>
                <p className="text-2xl font-bold text-navy mt-1">89%</p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-navy bg-navy/5 px-1.5 py-0.5 rounded-md mt-1"><ArrowUpRight className="w-2.5 h-2.5" />+5%</span>
              </div>
              <TrendingUp className="w-8 h-8 text-navy/15 group-hover:text-navy/25 transition-colors" />
            </div>
          </div>
          <div className="stat-card p-4 group cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Platform Uptime</p>
                <p className="text-2xl font-bold text-navy mt-1">99.97%</p>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-navy bg-navy/5 px-1.5 py-0.5 rounded-md mt-1">SLA Met</span>
              </div>
              <BarChart3 className="w-8 h-8 text-navy/15 group-hover:text-navy/25 transition-colors" />
            </div>
          </div>
        </div>

        {/* User Activity & Engagement */}
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <ChartCard title="User Activity" subtitle="Daily active users over last 30 days">
              <TrendChart
                data={[
                  { name: "W1", dau: 1820, wau: 2800 },
                  { name: "W2", dau: 1950, wau: 2920 },
                  { name: "W3", dau: 2100, wau: 3050 },
                  { name: "W4", dau: 2250, wau: 3200 },
                  { name: "W5", dau: 2380, wau: 3350 },
                  { name: "W6", dau: 2520, wau: 3456 },
                ]}
                dataKeys={[
                  { key: "wau", label: "Weekly Active", color: "#182954" },
                  { key: "dau", label: "Daily Active", color: "#C19B3F" },
                ]}
                height={240}
              />
            </ChartCard>
          </div>

          <ChartCard title="Traffic Source" subtitle="How users find us">
            <DonutChart
              data={[
                { name: "Direct", value: 42, color: "#182954" },
                { name: "Organic", value: 28, color: "#C19B3F" },
                { name: "Referral", value: 18, color: "#4A9EFF" },
                { name: "Social", value: 8, color: "#7c3aed" },
                { name: "Paid", value: 4, color: "#059669" },
              ]}
              centerValue="3.4K"
              centerLabel="This Week"
              height={210}
              innerRadius={50}
              outerRadius={80}
            />
          </ChartCard>
        </div>

        {/* Product Usage */}
        <ChartCard title="Module Engagement" subtitle="Sessions per module (last 6 months)">
          <MetricBarChart
            data={[
              { name: "Jan", finsight: 4200, accrediai: 2800, proed: 3100 },
              { name: "Feb", finsight: 4500, accrediai: 2950, proed: 3300 },
              { name: "Mar", finsight: 4800, accrediai: 3200, proed: 3600 },
              { name: "Apr", finsight: 5100, accrediai: 3400, proed: 3800 },
              { name: "May", finsight: 5500, accrediai: 3700, proed: 4100 },
              { name: "Jun", finsight: 5900, accrediai: 3900, proed: 4400 },
            ]}
            dataKeys={[
              { key: "finsight", label: "FinSight", color: "#182954" },
              { key: "accrediai", label: "AccrediAI", color: "#C19B3F" },
              { key: "proed", label: "ProEd", color: "#4A9EFF" },
            ]}
            height={220}
          />
        </ChartCard>

        {/* Feature Usage & Device Breakdown */}
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          <Card>
            <CardHeader><CardTitle>Top Features by Usage</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3.5">
                {[
                  { feature: "AI Intelligence Queries", usage: "12,450/mo", pct: 92 },
                  { feature: "Document Uploads", usage: "3,890/mo", pct: 72 },
                  { feature: "Reports Generated", usage: "2,340/mo", pct: 58 },
                  { feature: "Compliance Checks", usage: "890/mo", pct: 45 },
                  { feature: "Course Completions", usage: "567/mo", pct: 38 },
                  { feature: "Payment Processing", usage: "445/mo", pct: 32 },
                  { feature: "Chat Sessions", usage: "1,280/mo", pct: 65 },
                ].map((f, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-medium text-navy">{f.feature}</span>
                      <span className="text-[11px] font-semibold text-navy/60">{f.usage}</span>
                    </div>
                    <div className="w-full h-1.5 bg-navy/5 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-navy to-gold rounded-full" style={{ width: `${f.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Device & Location Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-semibold text-navy/40 uppercase tracking-wider mb-3">By Device</p>
                  <div className="space-y-2.5">
                    {[
                      { device: "Desktop", pct: 62, icon: Monitor },
                      { device: "Mobile", pct: 28, icon: Smartphone },
                      { device: "Tablet", pct: 10, icon: Monitor },
                    ].map((d, i) => {
                      const Icon = d.icon;
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-navy/30" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[12px] text-navy/70">{d.device}</span>
                              <span className="text-[11px] font-semibold text-navy">{d.pct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-navy/5 rounded-full overflow-hidden">
                              <div className="h-full bg-navy rounded-full" style={{ width: `${d.pct}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-navy/40 uppercase tracking-wider mb-3">Top Regions</p>
                  <div className="space-y-2">
                    {[
                      { region: "United States", users: "842" },
                      { region: "United Kingdom", users: "186" },
                      { region: "Canada", users: "124" },
                      { region: "Australia", users: "89" },
                      { region: "Germany", users: "56" },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-navy/4 last:border-0">
                        <span className="text-[12px] text-navy/60 inline-flex items-center gap-1.5">
                          <Globe className="w-3 h-3" /> {r.region}
                        </span>
                        <span className="text-[12px] font-semibold text-navy">{r.users}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
