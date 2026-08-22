"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { TrendChart, DonutChart, MetricBarChart, ChartCard } from "@/components/ui/charts";
import {
  Users, CreditCard, Shield, Settings, Activity,
  ArrowUpRight, ArrowDownRight, ArrowRight, BarChart3,
  Building2, Cpu, Key, Wallet, FileText, AlertTriangle,
  CheckCircle, Clock, Server, Globe, Sparkles, TrendingUp,
  Zap, Eye, UserCheck, ShieldCheck, GraduationCap,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const stats = [
    { label: "Total Users", value: "1,247", change: "+12%", up: true, icon: Users, href: "/admin/users" },
    { label: "Active Clients", value: "89", change: "+5", up: true, icon: Building2, href: "/admin/clients" },
    { label: "Revenue (MTD)", value: "$284K", change: "+18%", up: true, icon: TrendingUp, href: "/admin/analytics" },
    { label: "Active Devices", value: "156", change: "+8", up: true, icon: Cpu, href: "/admin/iot" },
    { label: "System Uptime", value: "99.97%", change: "Stable", up: true, icon: Activity, href: "/admin/health" },
    { label: "Security Score", value: "94/100", change: "+3", up: true, icon: Shield, href: "/admin/security" },
  ];

  const moduleStatus = [
    { name: "FinSight AI", icon: BarChart3, users: 560, status: "operational", health: 99.9, color: "#059669" },
    { name: "AccrediAI", icon: ShieldCheck, users: 380, status: "operational", health: 99.8, color: "#182954" },
    { name: "ProEd AI", icon: GraduationCap, users: 307, status: "operational", health: 100, color: "#C19B3F" },
  ];

  const recentActivity = [
    { action: "New enterprise client onboarded", user: "admin@harava.com", time: "5 min ago", type: "success" },
    { action: "Role 'Compliance Officer' created", user: "jay@harava.com", time: "22 min ago", type: "info" },
    { action: "Payroll batch #847 processed", user: "system", time: "1 hr ago", type: "success" },
    { action: "IoT device offline alert", user: "sensor-hub-12", time: "2 hrs ago", type: "warning" },
    { action: "Monthly report auto-generated", user: "system", time: "3 hrs ago", type: "info" },
    { action: "Failed login attempt (3x)", user: "unknown@test.com", time: "4 hrs ago", type: "warning" },
    { action: "Subscription upgraded to Enterprise", user: "enterprise@corp.com", time: "5 hrs ago", type: "success" },
    { action: "Bulk user import completed (45 users)", user: "admin@harava.com", time: "6 hrs ago", type: "success" },
  ];

  const pendingActions = [
    { title: "5 users awaiting role assignment", href: "/admin/roles", icon: Key, priority: "high" },
    { title: "3 invoices pending approval", href: "/admin/billing", icon: CreditCard, priority: "medium" },
    { title: "Payroll review for June", href: "/admin/payroll", icon: Wallet, priority: "high" },
    { title: "2 IoT devices need firmware update", href: "/admin/iot", icon: Cpu, priority: "low" },
    { title: "Quarterly compliance report due", href: "/admin/reports", icon: FileText, priority: "medium" },
  ];

  return (
    <div>
      <DashboardHeader title="Admin Command Center" subtitle="Full platform oversight and control" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 stagger-children">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="stat-card p-4 cursor-pointer group" onClick={() => router.push(stat.href)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-bold text-navy mt-1.5 tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${stat.up ? "text-navy bg-navy/5" : "text-red-600 bg-red-50"}`}>
                        {stat.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-4 h-4 text-navy/50" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Module Control & Platform Growth Charts */}
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <ChartCard
              title="Platform Growth"
              subtitle="User sign-ups and active users over 6 months"
              action={
                <Button variant="ghost" size="xs" onClick={() => router.push("/admin/analytics")}>
                  Full Analytics <ArrowRight className="w-3 h-3" />
                </Button>
              }
            >
              <TrendChart
                data={[
                  { name: "Jan", signups: 120, active: 890 },
                  { name: "Feb", signups: 145, active: 940 },
                  { name: "Mar", signups: 160, active: 1020 },
                  { name: "Apr", signups: 180, active: 1080 },
                  { name: "May", signups: 210, active: 1150 },
                  { name: "Jun", signups: 248, active: 1247 },
                ]}
                dataKeys={[
                  { key: "active", label: "Active Users", color: "#182954" },
                  { key: "signups", label: "New Sign-ups", color: "#C19B3F" },
                ]}
                height={240}
              />
            </ChartCard>
          </div>

          <ChartCard title="Revenue by Module" subtitle="Current month">
            <DonutChart
              data={[
                { name: "FinSight", value: 142000, color: "#182954" },
                { name: "AccrediAI", value: 89000, color: "#C19B3F" },
                { name: "ProEd", value: 53000, color: "#4A9EFF" },
              ]}
              centerValue="$284K"
              centerLabel="Total MTD"
              height={210}
              innerRadius={50}
              outerRadius={80}
            />
          </ChartCard>
        </div>

        {/* Module Status Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Server className="w-4 h-4 text-gold" /> Module Status & Control
            </CardTitle>
            <Button variant="ghost" size="xs" onClick={() => router.push("/admin/health")}>
              System Health <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {moduleStatus.map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <div key={i} className="p-4 rounded-xl border border-navy/6 hover:border-gold/15 hover:shadow-md transition-all duration-300 bg-white dark:bg-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center">
                          <Icon className="w-4.5 h-4.5 text-navy/60" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-navy">{mod.name}</p>
                          <p className="text-[11px] text-navy/40">{mod.users} active users</p>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">Live</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1 h-1.5 bg-navy/6 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-linear-to-r from-navy to-navy-light" style={{ width: `${mod.health}%` }} />
                        </div>
                        <span className="text-[11px] font-semibold text-navy/60">{mod.health}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Bar Chart */}
        <ChartCard
          title="Monthly Revenue Breakdown"
          subtitle="Revenue per module with growth tracking"
          action={
            <Button variant="ghost" size="xs" onClick={() => router.push("/admin/reports")}>
              Generate Report <ArrowRight className="w-3 h-3" />
            </Button>
          }
        >
          <MetricBarChart
            data={[
              { name: "Jan", finsight: 95000, accrediai: 62000, proed: 38000 },
              { name: "Feb", finsight: 102000, accrediai: 68000, proed: 41000 },
              { name: "Mar", finsight: 110000, accrediai: 72000, proed: 44000 },
              { name: "Apr", finsight: 118000, accrediai: 78000, proed: 46000 },
              { name: "May", finsight: 132000, accrediai: 84000, proed: 49000 },
              { name: "Jun", finsight: 142000, accrediai: 89000, proed: 53000 },
            ]}
            dataKeys={[
              { key: "finsight", label: "FinSight", color: "#182954" },
              { key: "accrediai", label: "AccrediAI", color: "#C19B3F" },
              { key: "proed", label: "ProEd", color: "#4A9EFF" },
            ]}
            valuePrefix="$"
            height={220}
            stacked
          />
        </ChartCard>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Live Activity Feed</CardTitle>
              <Button variant="ghost" size="xs" onClick={() => router.push("/admin/audit")}>
                Audit Log <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-navy/4 max-h-80 overflow-y-auto">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-3 hover:bg-navy/1.5 transition-colors duration-200">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${a.type === "success" ? "bg-emerald-500" : a.type === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-navy truncate">{a.action}</p>
                      <p className="text-[10px] text-navy/35 mt-0.5">{a.user}</p>
                    </div>
                    <span className="text-[10px] text-navy/30 shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Pending Actions
              </CardTitle>
              <Badge variant="warning" size="sm">{pendingActions.length} pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingActions.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3.5 p-3.5 rounded-xl border border-navy/5 hover:border-gold/15 hover:bg-navy/1 cursor-pointer transition-all duration-200"
                      onClick={() => router.push(item.href)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.priority === "high" ? "bg-red-50" : item.priority === "medium" ? "bg-amber-50" : "bg-navy/5"}`}>
                        <Icon className={`w-4 h-4 ${item.priority === "high" ? "text-red-500" : item.priority === "medium" ? "text-amber-500" : "text-navy/50"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-navy">{item.title}</p>
                      </div>
                      <Badge variant={item.priority === "high" ? "error" : item.priority === "medium" ? "warning" : "default"} size="sm">
                        {item.priority}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Manage Users", desc: "Add, edit, suspend users", icon: Users, href: "/admin/users" },
            { title: "Roles & Permissions", desc: "Configure access control", icon: Key, href: "/admin/roles" },
            { title: "Client Portal", desc: "Manage client accounts", icon: Building2, href: "/admin/clients" },
            { title: "Run Payroll", desc: "Process employee payments", icon: Wallet, href: "/admin/payroll" },
            { title: "IoT Dashboard", desc: "Monitor connected devices", icon: Cpu, href: "/admin/iot" },
            { title: "Generate Reports", desc: "Custom report builder", icon: FileText, href: "/admin/reports" },
            { title: "Security Center", desc: "Threats & compliance", icon: Shield, href: "/admin/security" },
            { title: "System Settings", desc: "Platform configuration", icon: Settings, href: "/admin/settings" },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <div
                key={i}
                className="group relative p-5 rounded-2xl border border-navy/6 bg-white dark:bg-white/5 hover:border-gold/20 hover:shadow-(--shadow-card-hover) transition-all duration-300 cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-gold/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-navy/50" />
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
