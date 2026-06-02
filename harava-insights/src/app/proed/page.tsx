"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import {
  BookOpen, Target, Award, Clock, Brain, ArrowRight,
  GraduationCap, ArrowUpRight, Sparkles,
} from "lucide-react";

export default function ProEdDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  return (
    <div>
      <DashboardHeader title={`Welcome, ${user?.firstName || "Learner"}`} subtitle="Your personalized learning dashboard" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 stagger-children">
          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/proed/courses")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Active Courses</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">4</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-navy bg-navy/5 px-1.5 py-0.5 rounded-md">
                    In Progress
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-5 h-5 text-navy/50" />
              </div>
            </div>
          </div>

          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/proed/tracks")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Track Progress</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">68%</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-navy bg-navy/5 px-1.5 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3 h-3" /> +5%
                  </span>
                  <span className="text-[11px] text-navy/35">this week</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="w-5 h-5 text-gold" />
              </div>
            </div>
          </div>

          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/proed/certificates")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Certificates</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">3</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    1 pending
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-50 to-amber-100/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </div>

          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/proed/assignments")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Due This Week</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">2</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    Action required
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-5 h-5 text-navy/50" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Continue Learning */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Continue Learning</CardTitle>
              <Button variant="ghost" size="xs" onClick={() => router.push("/proed/courses")}>
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-navy/4">
                {[
                  { title: "Financial Statement Analysis", progress: 75, module: "Module 6 of 8" },
                  { title: "Cash Flow Forecasting", progress: 42, module: "Module 3 of 6" },
                  { title: "AI in Accounting", progress: 90, module: "Module 9 of 10" },
                ].map((course, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-6 py-4 hover:bg-navy/1.5 cursor-pointer transition-colors duration-200"
                    onClick={() => router.push("/proed/courses")}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-navy truncate">{course.title}</p>
                      <p className="text-[11px] text-navy/40 mt-0.5">{course.module}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <div className="w-20 h-1.5 bg-navy/6 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-navy to-navy-light rounded-full progress-animated"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-navy/60 w-8 text-right">{course.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-gold/60 via-gold-light/40 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                </div>
                <CardTitle>AI Recommendations</CardTitle>
              </div>
              <Button variant="ghost" size="xs" onClick={() => router.push("/proed/ai-tutor")}>
                Ask AI <Brain className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "Advanced Tax Planning", reason: "Based on your interest in compliance" },
                  { title: "Leadership Essentials", reason: "Trending in your track" },
                  { title: "Client Advisory Skills", reason: "Complements your current courses" },
                ].map((rec, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-navy/5 rounded-xl hover:border-navy/10 hover:bg-navy/1 transition-all duration-200">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-navy">{rec.title}</p>
                      <p className="text-[11px] text-navy/40 mt-0.5">{rec.reason}</p>
                    </div>
                    <Button
                      variant="gold"
                      size="xs"
                      className="ml-3 shrink-0"
                      onClick={() => toast(`Enrolled in "${rec.title}"!`, "success")}
                    >
                      Enroll
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {[
            { title: "AI Tutor", desc: "Personalized coaching", icon: Brain, href: "/proed/ai-tutor", bg: "from-gold/8 to-gold/4", iconClass: "text-gold" },
            { title: "Assessment", desc: "Test your knowledge", icon: Target, href: "/proed/assessment", bg: "from-navy/6 to-navy/2", iconClass: "text-navy/60" },
            { title: "Case Studies", desc: "Real-world scenarios", icon: BookOpen, href: "/proed/case-studies", bg: "from-navy/4 to-gold/2", iconClass: "text-navy/50" },
            { title: "Community", desc: "Peer learning network", icon: GraduationCap, href: "/proed/community", bg: "from-amber-50 to-amber-100/50", iconClass: "text-amber-500" },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <div
                key={i}
                className="group relative p-5 rounded-2xl border border-navy/6 bg-white hover:border-gold/20 hover:shadow-(--shadow-card-hover) transition-all duration-300 cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-gold/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${action.bg} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${action.iconClass}`} />
                  </div>
                  <p className="text-[13px] font-semibold text-navy">{action.title}</p>
                  <p className="text-[11px] text-navy/40 mt-0.5">{action.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
