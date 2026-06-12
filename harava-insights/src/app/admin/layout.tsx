"use client";

import { DashboardSidebar, NavItem } from "@/components/layout/dashboard-sidebar";
import { LogoBackground } from "@/components/shared/logo-background";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  CreditCard,
  Settings,
  Shield,
  Key,
  Building2,
  Wallet,
  Cpu,
  Activity,
  FileText,
  ClipboardList,
} from "lucide-react";

const navigation: NavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "User Management", href: "/admin/users", icon: Users },
  { title: "Roles & Permissions", href: "/admin/roles", icon: Key },
  { title: "Client Management", href: "/admin/clients", icon: Building2 },
  { title: "Payroll", href: "/admin/payroll", icon: Wallet },
  { title: "IoT & Devices", href: "/admin/iot", icon: Cpu },
  { title: "Analytics & Reports", href: "/admin/analytics", icon: BarChart3 },
  { title: "System Health", href: "/admin/health", icon: Activity },
  { title: "Audit Log", href: "/admin/audit", icon: ClipboardList },
  { title: "Content Management", href: "/admin/content", icon: BookOpen },
  { title: "Billing & Subscriptions", href: "/admin/billing", icon: CreditCard },
  { title: "Security", href: "/admin/security", icon: Shield },
  { title: "Reports", href: "/admin/reports", icon: FileText },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar navigation={navigation} product="admin" />
      <main className="relative flex-1 overflow-y-auto bg-background bg-premium-mesh">
        <LogoBackground product="admin" />
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
