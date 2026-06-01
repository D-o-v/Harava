"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { BookOpen, Target, Award, Clock, Brain, ArrowRight, GraduationCap } from "lucide-react";

export default function ProEdDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  return (
    <div>
      <DashboardHeader title={`Welcome, ${user?.firstName || "Learner"}`} subtitle="Your personalized learning dashboard" />

      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/proed/courses")}>
            <CardContent className="p-5 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-violet-500" />
              <div><p className="text-2xl font-bold">4</p><p className="text-xs text-gray-500">Active Courses</p></div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/proed/tracks")}>
            <CardContent className="p-5 flex items-center gap-3">
              <Target className="w-8 h-8 text-emerald-500" />
              <div><p className="text-2xl font-bold">68%</p><p className="text-xs text-gray-500">Track Progress</p></div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/proed/certificates")}>
            <CardContent className="p-5 flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-500" />
              <div><p className="text-2xl font-bold">3</p><p className="text-xs text-gray-500">Certificates</p></div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md" onClick={() => router.push("/proed/assignments")}>
            <CardContent className="p-5 flex items-center gap-3">
              <Clock className="w-8 h-8 text-red-500" />
              <div><p className="text-2xl font-bold">2</p><p className="text-xs text-gray-500">Due This Week</p></div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Continue Learning */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Continue Learning</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/proed/courses")}>View All <ArrowRight className="w-3 h-3" /></Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "Financial Statement Analysis", progress: 75, module: "Module 6 of 8" },
                  { title: "Cash Flow Forecasting", progress: 42, module: "Module 3 of 6" },
                  { title: "AI in Accounting", progress: 90, module: "Module 9 of 10" },
                ].map((course, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push("/proed/courses")}>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <p className="text-xs text-gray-500">{course.module}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{course.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>AI Recommendations</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/proed/ai-tutor")}>Ask AI <Brain className="w-3 h-3" /></Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "Advanced Tax Planning", reason: "Based on your interest in compliance" },
                  { title: "Leadership Essentials", reason: "Trending in your track" },
                  { title: "Client Advisory Skills", reason: "Complements your current courses" },
                ].map((rec, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                      <p className="text-xs text-gray-500">{rec.reason}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { toast(`Enrolled in "${rec.title}"!`, "success"); }}>Enroll</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { title: "AI Tutor", icon: Brain, href: "/proed/ai-tutor", color: "text-violet-500" },
            { title: "Assessment", icon: Target, href: "/proed/assessment", color: "text-blue-500" },
            { title: "Case Studies", icon: BookOpen, href: "/proed/case-studies", color: "text-emerald-500" },
            { title: "Community", icon: GraduationCap, href: "/proed/community", color: "text-amber-500" },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Card key={i} className="cursor-pointer hover:shadow-md" onClick={() => router.push(action.href)}>
                <CardContent className="p-5 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${action.color}`} />
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
