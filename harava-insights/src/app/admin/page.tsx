"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import {
  Users, CreditCard, Shield, Settings,
  FileText, ArrowUpRight, ArrowDownRight, Activity,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const stats = [
    { label: "Total Users", value: "1,247", change: "+12%", up: true, icon: Users, href: "/admin/users" },
    { label: "Active Subscriptions", value: "892", change: "+8%", up: true, icon: CreditCard, href: "/admin/billing" },
    { label: "Security Events", value: "3", change: "-67%", up: false, icon: Shield, href: "/admin/security" },
    { label: "Platform Uptime", value: "99.9%", change: "Stable", up: true, icon: Activity, href: "/admin/analytics" },
  ];

  const recentActivity = [
    { action: "New user registered", user: "john.smith@company.com", time: "5 min ago", type: "success" },
    { action: "Subscription upgraded", user: "enterprise@corp.com", time: "1 hr ago", type: "success" },
    { action: "Failed login attempt", user: "unknown@test.com", time: "2 hrs ago", type: "warning" },
    { action: "Content published", user: "admin@harava.com", time: "3 hrs ago", type: "info" },
  ];

  return (
    <div>
      <DashboardHeader title="Admin Dashboard" subtitle="Platform overview and management" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 stagger-children">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="stat-card p-5 cursor-pointer group" onClick={() => router.push(stat.href)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-navy mt-2 tracking-tight">{stat.value}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                        stat.up ? "text-navy bg-navy/5" : "text-red-600 bg-red-50"
                      }`}>
                        {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-navy/50" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-navy/4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-3.5 hover:bg-navy/1.5 transition-colors duration-200">
                    <div>
                      <p className="text-[13px] font-semibold text-navy">{a.action}</p>
                      <p className="text-[11px] text-navy/40 mt-0.5">{a.user}</p>
                    </div>
                    <span className="text-[11px] text-navy/35 shrink-0 ml-4">{a.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Manage Users", icon: Users, href: "/admin/users" },
                  { label: "Content", icon: FileText, href: "/admin/content" },
                  { label: "Security", icon: Shield, href: "/admin/security" },
                  { label: "Settings", icon: Settings, href: "/admin/settings" },
                ].map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={i}
                      className="group flex flex-col items-center gap-2.5 p-5 rounded-xl border border-navy/6 hover:border-gold/20 hover:bg-navy/1 transition-all duration-200 cursor-pointer"
                      onClick={() => router.push(action.href)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-navy/50" />
                      </div>
                      <span className="text-[13px] font-medium text-navy/70">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
