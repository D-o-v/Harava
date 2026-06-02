"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, ROLE_LABELS } from "@/lib/auth";
import {
  BarChart3,
  ShieldCheck,
  GraduationCap,
  Settings,
  Bell,
  User,
  ChevronDown,
  X,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; href: string }[];
}

interface SidebarProps {
  navigation: NavItem[];
  product: "finsight" | "accrediai" | "proed" | "admin";
}

const productConfig = {
  finsight: { icon: BarChart3, name: "FinSight AI", href: "/finsight", color: "from-navy to-navy-light" },
  accrediai: { icon: ShieldCheck, name: "AccrediAI", href: "/accrediai", color: "from-navy to-navy-light" },
  proed: { icon: GraduationCap, name: "ProEd AI", href: "/proed", color: "from-navy to-navy-light" },
  admin: { icon: Settings, name: "Admin", href: "/admin", color: "from-navy to-navy-light" },
};

export function DashboardSidebar({ navigation, product }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasAccess } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showProductSwitcher, setShowProductSwitcher] = useState(false);
  const ProductIcon = productConfig[product].icon;

  useEffect(() => {
    const handler = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Logo & Brand */}
      <div className="px-5 py-5 border-b border-navy/[0.05]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image src="/logo.png" alt="Harava" width={36} height={36} className="w-9 h-9 rounded-xl object-cover ring-1 ring-navy/[0.06]" />
            <div className="absolute -inset-1 bg-gradient-to-br from-gold/20 to-navy/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-bold text-navy text-[18px] tracking-tight">Harava</span>
            <span className="text-gold text-lg font-light">.</span>
          </div>
        </Link>
      </div>

      {/* Product Switcher */}
      <div className="px-4 py-3 border-b border-navy/[0.05] relative">
        <button
          onClick={() => setShowProductSwitcher(!showProductSwitcher)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 bg-navy/[0.02] hover:bg-navy/[0.04] border border-navy/[0.05] hover:border-navy/[0.08]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-navy to-navy-light flex items-center justify-center shadow-sm">
              <ProductIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-navy tracking-tight">{productConfig[product].name}</span>
          </div>
          <ChevronDown className={cn("w-3.5 h-3.5 text-navy/40 transition-transform duration-300", showProductSwitcher && "rotate-180")} />
        </button>

        {showProductSwitcher && (
          <div className="absolute left-4 right-4 top-full mt-1.5 bg-white border border-navy/[0.08] rounded-xl shadow-[var(--shadow-xl)] z-50 py-1.5 animate-scale-in overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/50 to-transparent" />
            {(Object.keys(productConfig) as Array<keyof typeof productConfig>).map((key) => {
              if (key === product) return null;
              if (!hasAccess(key)) return null;
              const config = productConfig[key];
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => { router.push(config.href); setShowProductSwitcher(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-navy/70 hover:bg-navy/[0.03] hover:text-navy transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-navy/80 to-navy flex items-center justify-center">
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-medium">{config.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/${product}` && pathname.startsWith(item.href));
          const isExpanded = expandedItems.includes(item.title);
          const Icon = item.icon;

          return (
            <div key={item.title}>
              {item.children ? (
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-gold/[0.08] to-navy/[0.03] text-navy font-semibold border-l-[3px] border-l-gold -ml-[3px] pl-[15px]"
                      : "text-navy/55 hover:bg-navy/[0.03] hover:text-navy/75 border-l-[3px] border-l-transparent -ml-[3px] pl-[15px]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-[18px] h-[18px] transition-colors", isActive ? "text-gold" : "text-navy/35")} />
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isExpanded && "rotate-180")} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-gold/[0.08] to-navy/[0.03] text-navy font-semibold border-l-[3px] border-l-gold -ml-[3px] pl-[15px]"
                      : "text-navy/55 hover:bg-navy/[0.03] hover:text-navy/75 border-l-[3px] border-l-transparent -ml-[3px] pl-[15px]"
                  )}
                >
                  <Icon className={cn("w-[18px] h-[18px] transition-colors", isActive ? "text-gold" : "text-navy/35")} />
                  <span>{item.title}</span>
                </Link>
              )}

              {item.children && isExpanded && (
                <div className="ml-9 mt-1 space-y-0.5 animate-fade-in">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-3 py-2 rounded-lg text-[13px] transition-all duration-200",
                        pathname === child.href
                          ? "text-navy font-medium bg-navy/[0.04]"
                          : "text-navy/45 hover:text-navy/70 hover:bg-navy/[0.02]"
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-3 border-t border-navy/[0.05] space-y-0.5">
        <Link
          href={`/${product}/ai-chat`}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-gold-dark/70 hover:bg-gold/[0.05] hover:text-gold-dark transition-all duration-200 group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center group-hover:from-gold/15 group-hover:to-gold/10 transition-all">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
          </div>
          <span className="font-medium">AI Assistant</span>
        </Link>
        <Link
          href={`/${product}/notifications`}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-navy/55 hover:bg-navy/[0.03] hover:text-navy/75 transition-all duration-200"
        >
          <Bell className="w-[18px] h-[18px] text-navy/35" />
          <span className="font-medium">Notifications</span>
        </Link>
        <Link
          href={`/${product}/profile`}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-navy/55 hover:bg-navy/[0.03] hover:text-navy/75 transition-all duration-200"
        >
          <User className="w-[18px] h-[18px] text-navy/35" />
          <span className="font-medium">Profile</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>

      {/* User Card */}
      {user && (
        <div className="px-4 py-4 border-t border-navy/[0.05]">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-navy/[0.02] to-gold/[0.02]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white text-[11px] font-bold shadow-sm ring-2 ring-white">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-navy truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[11px] text-navy/40 truncate">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-navy-900/30 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-[272px] bg-white border-r border-navy/[0.05] transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:transform-none shadow-[var(--shadow-xl)] lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-xl bg-navy/[0.04] text-navy/50 hover:bg-navy/[0.08] hover:text-navy z-50 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {sidebarContent}
      </aside>
    </>
  );
}
