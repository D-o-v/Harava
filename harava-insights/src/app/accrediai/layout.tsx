"use client";

import { DashboardSidebar, NavItem } from "@/components/layout/dashboard-sidebar";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Search,
  ListTodo,
  FileText,
  GraduationCap,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const navigation: NavItem[] = [
  { title: "Dashboard", href: "/accrediai", icon: LayoutDashboard },
  { title: "Client Pipeline", href: "/accrediai/pipeline", icon: Users },
  { title: "Readiness Assessment", href: "/accrediai/readiness", icon: ClipboardCheck },
  { title: "Gap Analysis", href: "/accrediai/gap-analysis", icon: Search },
  { title: "Action Plans", href: "/accrediai/action-plans", icon: ListTodo },
  { title: "Policies & Procedures", href: "/accrediai/policies", icon: FileText },
  { title: "Training", href: "/accrediai/training", icon: GraduationCap },
  { title: "Mock Survey", href: "/accrediai/mock-survey", icon: ShieldCheck },
  { title: "Compliance Monitor", href: "/accrediai/compliance", icon: BarChart3 },
];

export default function AccrediAILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar navigation={navigation} product="accrediai" />
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}
