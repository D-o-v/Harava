"use client";

import { DashboardSidebar, NavItem } from "@/components/layout/dashboard-sidebar";
import { LogoBackground } from "@/components/shared/logo-background";
import { useAuth } from "@/lib/auth";
import { CompanyProvider, useCompanyContext } from "@/lib/company-context";
import { PERMISSIONS } from "@/lib/permissions";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Receipt, FileText, BarChart3, TrendingUp,
  Calculator, Wallet, FolderOpen, Brain, ShieldCheck, Users, Newspaper,
  Building2, ChevronDown,
} from "lucide-react";

// Full nav for tenant staff (filtered by permissions)
const STAFF_NAV: (NavItem & { requires?: string })[] = [
  { title: "Dashboard",         href: "/finsight",                icon: LayoutDashboard, requires: PERMISSIONS.INSIGHTS_VIEW },
  { title: "Accounting",        href: "/finsight/accounting",     icon: Receipt,         requires: PERMISSIONS.INSIGHTS_VIEW },
  { title: "Reconciliation",    href: "/finsight/reconciliation", icon: FileText,        requires: PERMISSIONS.INSIGHTS_VIEW },
  { title: "Financial Reports", href: "/finsight/reports",        icon: BarChart3,       requires: PERMISSIONS.INSIGHTS_VIEW },
  { title: "CFO Advisory",      href: "/finsight/cfo-advisory",   icon: TrendingUp,      requires: PERMISSIONS.INSIGHTS_VIEW },
  { title: "Tax & Compliance",  href: "/finsight/tax",            icon: Calculator,      requires: PERMISSIONS.INSIGHTS_VIEW },
  { title: "Payroll",           href: "/finsight/payroll",        icon: Wallet,          requires: PERMISSIONS.PAYROLL_READ },
  { title: "Documents",         href: "/finsight/documents",      icon: FolderOpen,      requires: PERMISSIONS.INSIGHTS_VIEW },
  { title: "AI Intelligence",   href: "/finsight/ai-intelligence",icon: Brain,           requires: PERMISSIONS.INSIGHTS_VIEW },
  { title: "Approvals",         href: "/finsight/approvals",      icon: ShieldCheck,     requires: PERMISSIONS.PAYROLL_APPROVE },
  { title: "Clients",           href: "/finsight/clients",        icon: Users,           requires: PERMISSIONS.COMPANY_READ },
  { title: "News",              href: "/finsight/news",           icon: Newspaper },
];

// Portal (company user) — limited view
const PORTAL_NAV: NavItem[] = [
  { title: "Dashboard",         href: "/finsight",            icon: LayoutDashboard },
  { title: "Financial Reports", href: "/finsight/reports",    icon: BarChart3 },
  { title: "Accounting",        href: "/finsight/accounting", icon: Receipt },
  { title: "News",              href: "/finsight/news",       icon: Newspaper },
];

function FinSightLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, can } = useAuth();
  const { selectedCompanyId, selectedCompanyName, setSelectedCompanyId } = useCompanyContext();
  const router = useRouter();
  const isPortal = user?.scope === "portal";

  const navigation: NavItem[] = isPortal
    ? PORTAL_NAV
    : STAFF_NAV.filter(({ requires }) => !requires || can(requires));

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar navigation={navigation} product="finsight" />
      <main className="relative min-w-0 flex-1 overflow-y-auto bg-background bg-premium-mesh">
        <LogoBackground product="finsight" />
        <div
          className="relative z-10"
          style={{ "--dashboard-header-offset": selectedCompanyId && selectedCompanyName ? "37px" : "0px" } as React.CSSProperties}
        >
          {selectedCompanyId && selectedCompanyName && (
            <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-5 py-2 bg-navy/[0.03] border-b border-navy/5 text-[12px]">
              <div className="flex items-center gap-2 text-navy/60">
                <Building2 className="w-3.5 h-3.5 text-gold" />
                <span>Viewing:</span>
                <span className="font-semibold text-navy">{selectedCompanyName}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedCompanyId(null);
                  router.push("/finsight/clients");
                }}
                className="flex items-center gap-1 text-navy/40 hover:text-navy transition-colors"
              >
                <ChevronDown className="w-3 h-3" /> Switch company
              </button>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

export default function FinSightLayout({ children }: { children: React.ReactNode }) {
  return (
    <CompanyProvider>
      <FinSightLayoutInner>{children}</FinSightLayoutInner>
    </CompanyProvider>
  );
}
