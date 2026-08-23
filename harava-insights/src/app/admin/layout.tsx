"use client";

import { DashboardSidebar, NavItem } from "@/components/layout/dashboard-sidebar";
import { LogoBackground } from "@/components/shared/logo-background";
import { TenantAdminProvider, useTenantAdmin } from "@/lib/tenant-admin-context";
import { X, Building2, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard, Users, BookOpen, BarChart3, CreditCard,
  Settings, Shield, Key, Building2 as Building2Icon,
  Cpu, Activity, FileText, ClipboardList, Wallet,
} from "lucide-react";

// Platform-level nav (always visible)
const PLATFORM_NAV: NavItem[] = [
  { title: "Overview",             href: "/admin",           icon: LayoutDashboard },
  { title: "Tenants",              href: "/admin/clients",   icon: Building2Icon },
  { title: "IoT & Devices",        href: "/admin/iot",       icon: Cpu },
  { title: "Analytics & Reports",  href: "/admin/analytics", icon: BarChart3 },
  { title: "System Health",        href: "/admin/health",    icon: Activity },
  { title: "Content Management",   href: "/admin/content",   icon: BookOpen },
  { title: "Billing & Subscriptions", href: "/admin/billing", icon: CreditCard },
  { title: "Reports",              href: "/admin/reports",   icon: FileText },
  { title: "Settings",             href: "/admin/settings",  icon: Settings },
];

// Tenant-level nav (only shown when inside a tenant)
const TENANT_NAV: NavItem[] = [
  { title: "Tenant Overview",      href: "/admin/clients",   icon: Building2Icon },
  { title: "User Management",      href: "/admin/users",     icon: Users },
  { title: "Roles & Permissions",  href: "/admin/roles",     icon: Key },
  { title: "Payroll",              href: "/admin/payroll",   icon: Wallet },
  { title: "Audit Log",            href: "/admin/audit",     icon: ClipboardList },
  { title: "Security Center",      href: "/admin/security",  icon: Shield },
];

function GlobalExitLoader({ name }: { name: string | null }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy/95 backdrop-blur-sm">
      <div className="relative w-16 h-16 mb-5">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/10" />
          <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
            strokeDasharray="40 124" className="text-gold animate-[spin_1.1s_linear_infinite]"
            style={{ transformOrigin: "32px 32px" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <LogOut className="w-5 h-5 text-white/40" />
        </div>
      </div>
      <p className="text-[13px] font-semibold text-white/80 tracking-wide">Exiting tenant view</p>
      {name && <p className="text-[11px] text-gold/70 mt-1">{name}</p>}
    </div>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { activeTenantId, activeTenantName, isExiting, isReady, exitTenant } = useTenantAdmin();
  const pathname = usePathname();
  const router = useRouter();

  const isTenantOnlyRoute = ["/admin/users", "/admin/roles", "/admin/payroll", "/admin/audit", "/admin/security"].includes(pathname);

  useEffect(() => {
    if (isReady && isTenantOnlyRoute && !activeTenantId) router.replace("/admin/clients");
  }, [activeTenantId, isReady, isTenantOnlyRoute, router]);

  const navigation = activeTenantId ? TENANT_NAV : PLATFORM_NAV;

  return (
    <div className="flex h-screen overflow-hidden">
      {isExiting && <GlobalExitLoader name={activeTenantName} />}
      <DashboardSidebar navigation={navigation} product="admin" />
      <main className="relative min-w-0 flex-1 overflow-y-auto bg-background bg-premium-mesh">
        <LogoBackground product="admin" />
        <div
          className="relative z-10"
          style={{ "--dashboard-header-offset": activeTenantId ? "43px" : "0px" } as React.CSSProperties}
        >
          {activeTenantId && (
            <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-5 py-2.5 bg-navy text-white text-[12px] font-medium shadow-md">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-gold" />
                <span className="text-white/60">Tenant view:</span>
                <span className="font-bold text-gold">{activeTenantName}</span>
                <span className="text-white/30 font-mono text-[10px]">{activeTenantId.slice(0, 8)}…</span>
              </div>
              <button
                onClick={exitTenant}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-[11px] font-semibold"
              >
                <X className="w-3 h-3" /> Exit tenant view
              </button>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <TenantAdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </TenantAdminProvider>
  );
}
