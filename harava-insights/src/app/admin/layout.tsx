"use client";

import { DashboardSidebar, NavItem } from "@/components/layout/dashboard-sidebar";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  CreditCard,
  Settings,
  Shield,
} from "lucide-react";

const navigation: NavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "User Management", href: "/admin/users", icon: Users },
  { title: "Content Management", href: "/admin/content", icon: BookOpen },
  { title: "Analytics & Reports", href: "/admin/analytics", icon: BarChart3 },
  { title: "Billing & Subscriptions", href: "/admin/billing", icon: CreditCard },
  { title: "Security", href: "/admin/security", icon: Shield },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar navigation={navigation} product="admin" />
      <main className="flex-1 overflow-y-auto bg-[var(--background)] bg-premium-mesh">{children}</main>
    </div>
  );
}
