"use client";

import { DashboardSidebar, NavItem } from "@/components/layout/dashboard-sidebar";
import { LogoBackground } from "@/components/shared/logo-background";
import {
  LayoutDashboard,
  Receipt,
  FileText,
  BarChart3,
  TrendingUp,
  Calculator,
  Wallet,
  FolderOpen,
  Brain,
  ShieldCheck,
  Users,
  Newspaper,
} from "lucide-react";

const navigation: NavItem[] = [
  { title: "Dashboard", href: "/finsight", icon: LayoutDashboard },
  { title: "Accounting", href: "/finsight/accounting", icon: Receipt },
  { title: "Reconciliation", href: "/finsight/reconciliation", icon: FileText },
  { title: "Financial Reports", href: "/finsight/reports", icon: BarChart3 },
  { title: "CFO Advisory", href: "/finsight/cfo-advisory", icon: TrendingUp },
  { title: "Tax & Compliance", href: "/finsight/tax", icon: Calculator },
  { title: "Payroll", href: "/finsight/payroll", icon: Wallet },
  { title: "Documents", href: "/finsight/documents", icon: FolderOpen },
  { title: "AI Intelligence", href: "/finsight/ai-intelligence", icon: Brain },
  { title: "Approvals", href: "/finsight/approvals", icon: ShieldCheck },
  { title: "Clients", href: "/finsight/clients", icon: Users },
  { title: "News", href: "/finsight/news", icon: Newspaper },
];

export default function FinSightLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar navigation={navigation} product="finsight" />
      <main className="relative flex-1 overflow-y-auto bg-background bg-premium-mesh">
        <LogoBackground product="finsight" />
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
