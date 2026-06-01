"use client";

import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Users, CreditCard, Shield, Settings, BarChart3, FileText } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const stats = [
    { label: "Total Users", value: "1,247", change: "+12%", icon: Users, href: "/admin/users" },
    { label: "Active Subscriptions", value: "892", change: "+8%", icon: CreditCard, href: "/admin/billing" },
    { label: "Security Events", value: "3", change: "-67%", icon: Shield, href: "/admin/security" },
    { label: "Platform Uptime", value: "99.9%", change: "0%", icon: BarChart3, href: "/admin/analytics" },
  ];

  const recentActivity = [
    { action: "New user registered", user: "john.smith@company.com", time: "5 min ago" },
    { action: "Subscription upgraded", user: "enterprise@corp.com", time: "1 hr ago" },
    { action: "Failed login attempt", user: "unknown@test.com", time: "2 hrs ago" },
    { action: "Content published", user: "admin@harava.com", time: "3 hrs ago" },
  ];

  return (
    <div>
      <DashboardHeader title="Admin Dashboard" subtitle="Platform overview and management" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="cursor-pointer hover:shadow-md" onClick={() => router.push(stat.href)}>
                <CardContent className="p-5 flex items-center gap-3">
                  <Icon className="w-8 h-8 text-violet-500" />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-xs text-emerald-600">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.action}</p>
                    <p className="text-xs text-gray-500">{a.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{a.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => router.push("/admin/users")}><Users className="w-5 h-5 mb-1" />Manage Users</Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => router.push("/admin/content")}><FileText className="w-5 h-5 mb-1" />Content</Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => router.push("/admin/security")}><Shield className="w-5 h-5 mb-1" />Security</Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => router.push("/admin/settings")}><Settings className="w-5 h-5 mb-1" />Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
