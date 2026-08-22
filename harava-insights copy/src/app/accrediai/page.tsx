"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  Target, Users, Clock, AlertTriangle, ArrowRight,
  ArrowUpRight, Sparkles, FileText,
} from "lucide-react";
import { TrendChart, DonutChart, MetricBarChart, ChartCard } from "@/components/ui/charts";

export default function AccrediAIDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const engagements = [
    { name: "Beta Healthcare", phase: "Gap Analysis", progress: 65, dueDate: "Aug 15, 2026", status: "warning" },
    { name: "Alpha Rehabilitation", phase: "Policy Build", progress: 40, dueDate: "Sep 30, 2026", status: "info" },
    { name: "Omega Behavioral", phase: "Readiness", progress: 25, dueDate: "Nov 1, 2026", status: "info" },
  ];

  return (
    <div>
      <DashboardHeader title={`Welcome, ${user?.firstName || "User"}`} subtitle="Accreditation compliance overview" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 stagger-children">
          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/accrediai/pipeline")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Active Clients</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">7</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-navy bg-navy/5 px-1.5 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3 h-3" /> +2
                  </span>
                  <span className="text-[11px] text-navy/35">this quarter</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-5 h-5 text-navy/50" />
              </div>
            </div>
          </div>

          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/accrediai/readiness")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Avg. Readiness</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">72%</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-navy bg-navy/5 px-1.5 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3 h-3" /> +8%
                  </span>
                  <span className="text-[11px] text-navy/35">vs last month</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="w-5 h-5 text-gold" />
              </div>
            </div>
          </div>

          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/accrediai/gap-analysis")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Open Gaps</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">12</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    Needs attention
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-50 to-amber-100/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </div>

          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/accrediai/action-plans")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Upcoming Deadlines</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">3</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    Review required
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-5 h-5 text-navy/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Trend Charts */}
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <ChartCard
              title="Readiness Score Trend"
              subtitle="Client compliance progress over time"
              action={
                <Button variant="ghost" size="xs" onClick={() => router.push("/accrediai/readiness")}>
                  Details <ArrowRight className="w-3 h-3" />
                </Button>
              }
            >
              <TrendChart
                data={[
                  { name: "Jan", readiness: 42, gaps: 28 },
                  { name: "Feb", readiness: 48, gaps: 24 },
                  { name: "Mar", readiness: 55, gaps: 21 },
                  { name: "Apr", readiness: 61, gaps: 18 },
                  { name: "May", readiness: 67, gaps: 15 },
                  { name: "Jun", readiness: 72, gaps: 12 },
                ]}
                dataKeys={[
                  { key: "readiness", label: "Avg. Readiness %", color: "#182954" },
                  { key: "gaps", label: "Open Gaps", color: "#d97706" },
                ]}
                valueSuffix=""
                height={260}
              />
            </ChartCard>
          </div>

          <ChartCard title="Standards Coverage" subtitle="By CARF domain">
            <DonutChart
              data={[
                { name: "Leadership", value: 92, color: "#182954" },
                { name: "HR & Training", value: 78, color: "#C19B3F" },
                { name: "Health & Safety", value: 85, color: "#4A9EFF" },
                { name: "Rights & Ethics", value: 88, color: "#059669" },
                { name: "Performance", value: 65, color: "#7c3aed" },
              ]}
              centerValue="82%"
              centerLabel="Average"
              height={220}
              innerRadius={55}
              outerRadius={85}
            />
          </ChartCard>
        </div>

        {/* Gap Resolution Progress */}
        <ChartCard
          title="Gap Resolution Progress"
          subtitle="Monthly resolved vs new gaps identified"
          action={
            <Button variant="ghost" size="xs" onClick={() => router.push("/accrediai/gap-analysis")}>
              Gap Analysis <ArrowRight className="w-3 h-3" />
            </Button>
          }
        >
          <MetricBarChart
            data={[
              { name: "Jan", resolved: 5, newGaps: 8 },
              { name: "Feb", resolved: 7, newGaps: 4 },
              { name: "Mar", resolved: 6, newGaps: 3 },
              { name: "Apr", resolved: 9, newGaps: 5 },
              { name: "May", resolved: 8, newGaps: 2 },
              { name: "Jun", resolved: 6, newGaps: 1 },
            ]}
            dataKeys={[
              { key: "resolved", label: "Resolved", color: "#059669" },
              { key: "newGaps", label: "New Gaps", color: "#d97706" },
            ]}
            height={200}
          />
        </ChartCard>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Active Engagements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Engagements</CardTitle>
              <Button variant="ghost" size="xs" onClick={() => router.push("/accrediai/pipeline")}>
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {engagements.map((eng, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border border-navy/5 rounded-xl hover:border-navy/10 hover:bg-navy/1 transition-all duration-200 cursor-pointer"
                    onClick={() => router.push("/accrediai/readiness")}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-navy">{eng.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="info" size="sm">{eng.phase}</Badge>
                        <span className="text-[11px] text-navy/40">Due: {eng.dueDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <div className="w-20 h-1.5 bg-navy/6 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-navy to-navy-light rounded-full progress-animated"
                          style={{ width: `${eng.progress}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-navy/60 w-8 text-right">{eng.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Compliance Insights */}
          <Card className="overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-gold/60 via-gold-light/40 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                </div>
                <CardTitle>AI Compliance Insights</CardTitle>
              </div>
              <Button variant="ghost" size="xs" onClick={() => router.push("/accrediai/ai-chat")}>
                Ask AI <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "CARF Standard 1.G Gap", message: "3 policy documents require updates before survey date. AI-suggested templates available.", severity: "warning" },
                  { title: "Training Compliance", message: "87% staff training completion. 4 employees need annual refreshers by Aug 30.", severity: "warning" },
                  { title: "Mock Survey Ready", message: "Beta Healthcare has cleared 94% of readiness checkpoints. Recommend scheduling mock survey.", severity: "success" },
                ].map((insight, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-navy/1.5 border border-navy/4 cursor-pointer hover:bg-navy/2.5 hover:border-navy/[0.07] transition-all duration-200"
                    onClick={() => router.push("/accrediai/compliance")}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${insight.severity === "warning" ? "bg-amber-50" : "bg-navy/5"}`}>
                      <AlertTriangle className={`w-4 h-4 ${insight.severity === "warning" ? "text-amber-500" : "text-gold"}`} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-navy">{insight.title}</p>
                      <p className="text-[12px] text-navy/45 mt-0.5 leading-relaxed">{insight.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4 lg:gap-5">
          {[
            { title: "Gap Analysis", desc: "Review compliance gaps", icon: AlertTriangle, href: "/accrediai/gap-analysis", iconClass: "text-amber-500", bg: "from-amber-50 to-amber-100/50" },
            { title: "Policy Manual", desc: "Manage policies & procedures", icon: FileText, href: "/accrediai/policies", iconClass: "text-navy/60", bg: "from-navy/4 to-navy/2" },
            { title: "Mock Survey", desc: "Prepare for live survey", icon: Target, href: "/accrediai/mock-survey", iconClass: "text-gold", bg: "from-gold/8 to-gold/4" },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-navy/6 bg-white hover:border-gold/20 hover:shadow-(--shadow-card-hover) transition-all duration-300 cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-gold/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${action.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${action.iconClass}`} />
                  </div>
                  <p className="text-[14px] font-semibold text-navy">{action.title}</p>
                  <p className="text-[12px] text-navy/45 mt-1">{action.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
