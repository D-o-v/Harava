"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, ROLE_LABELS } from "@/lib/auth";
import HaravaLogo from "@/assets/1. Harava Insights Logo -TM.png";
import ProEdLogo from "@/assets/2. ProEd AI logo -TM.png";
import AccrediAILogo from "@/assets/3. Accredi AI logo -TM.png";
import FinSightLogo from "@/assets/4. FinSights AI Logo -TM.png";
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
  finsight: { icon: BarChart3, name: "FinSight AI", href: "/finsight", color: "from-navy to-navy-light", logo: FinSightLogo },
  accrediai: { icon: ShieldCheck, name: "AccrediAI", href: "/accrediai", color: "from-navy to-navy-light", logo: AccrediAILogo },
  proed: { icon: GraduationCap, name: "ProEd AI", href: "/proed", color: "from-navy to-navy-light", logo: ProEdLogo },
  admin: { icon: Settings, name: "Admin", href: "/admin", color: "from-navy to-navy-light", logo: HaravaLogo },
};

export function DashboardSidebar({ navigation, product }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasAccess } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showProductSwitcher, setShowProductSwitcher] = useState(false);

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
    <div className="flex flex-col h-full bg-white dark:bg-[#080d1a]/95 dark:backdrop-blur-xl border-r border-navy/4 dark:border-white/4">
      {/* Logo & Brand */}
      <div className="px-5 py-5 border-b border-navy/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image src="/logo.png" alt="Harava" width={36} height={36} className="w-9 h-9 rounded-xl object-cover ring-1 ring-navy/6" />
            <div className="absolute -inset-1 bg-linear-to-br from-gold/20 to-navy-brand/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-bold text-navy text-[18px] tracking-tight">Harava</span>
            <span className="text-gold text-lg font-light">.</span>
          </div>
        </Link>
      </div>

      {/* Product Switcher */}
      <div className="px-4 py-3 border-b border-navy/5 relative">
        <button
          onClick={() => setShowProductSwitcher(!showProductSwitcher)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 bg-navy/2 hover:bg-navy/4 border border-navy/5 hover:border-navy/8"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white dark:bg-white/10 flex items-center justify-center shadow-sm ring-1 ring-navy/6 dark:ring-white/10">
              <Image src={productConfig[product].logo} alt={productConfig[product].name} width={28} height={28} className="w-6 h-6 object-contain" />
            </div>
            <span className="text-sm font-semibold text-navy tracking-tight">{productConfig[product].name}</span>
          </div>
          <ChevronDown className={cn("w-3.5 h-3.5 text-navy/40 transition-transform duration-300", showProductSwitcher && "rotate-180")} />
        </button>

        {showProductSwitcher && (
          <div className="absolute left-4 right-4 top-full mt-1.5 bg-white border border-navy/8 rounded-xl shadow-(--shadow-xl) z-50 py-1.5 animate-scale-in overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-gold/50 to-transparent" />
            {(Object.keys(productConfig) as Array<keyof typeof productConfig>).map((key) => {
              if (key === product) return null;
              if (!hasAccess(key)) return null;
              const config = productConfig[key];
              return (
                <button
                  key={key}
                  onClick={() => { router.push(config.href); setShowProductSwitcher(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-navy/70 hover:bg-navy/3 hover:text-navy transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-lg overflow-hidden bg-white dark:bg-white/10 flex items-center justify-center ring-1 ring-navy/6 dark:ring-white/10">
                    <Image src={config.logo} alt={config.name} width={24} height={24} className="w-5 h-5 object-contain" />
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
                      ? "bg-linear-to-r from-gold/8 to-navy/3 text-navy font-semibold border-l-[3px] border-l-gold -ml-0.75 pl-3.75"
                      : "text-navy/55 hover:bg-navy/3 hover:text-navy/75 border-l-[3px] border-l-transparent -ml-0.75 pl-3.75"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-gold" : "text-navy/35")} />
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
                      ? "bg-linear-to-r from-gold/8 to-navy/3 text-navy font-semibold border-l-[3px] border-l-gold -ml-0.75 pl-3.75"
                      : "text-navy/55 hover:bg-navy/3 hover:text-navy/75 border-l-[3px] border-l-transparent -ml-0.75 pl-3.75"
                  )}
                >
                  <Icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-gold" : "text-navy/35")} />
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
                          ? "text-navy font-medium bg-navy/4"
                          : "text-navy/45 hover:text-navy/70 hover:bg-navy/2"
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
      <div className="px-3 py-3 border-t border-navy/5 space-y-0.5">
        <Link
          href={`/${product}/ai-chat`}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-gold-dark/70 hover:bg-gold/5 hover:text-gold-dark transition-all duration-200 group"
        >
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-gold/10 to-gold/5 flex items-center justify-center group-hover:from-gold/15 group-hover:to-gold/10 transition-all">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
          </div>
          <span className="font-medium">AI Assistant</span>
        </Link>
        <Link
          href={`/${product}/notifications`}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-navy/55 hover:bg-navy/3 hover:text-navy/75 transition-all duration-200"
        >
          <Bell className="w-4.5 h-4.5 text-navy/35" />
          <span className="font-medium">Notifications</span>
        </Link>
        <Link
          href={`/${product}/profile`}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-navy/55 hover:bg-navy/3 hover:text-navy/75 transition-all duration-200"
        >
          <User className="w-4.5 h-4.5 text-navy/35" />
          <span className="font-medium">Profile</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>

      {/* User Card */}
      {user && (
        <div className="px-4 py-4 border-t border-navy/5">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-linear-to-r from-navy/2 to-gold/2">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy-brand to-navy-brand-light flex items-center justify-center text-white text-[11px] font-bold shadow-sm ring-2 ring-white dark:ring-white/10">
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
          "fixed lg:static inset-y-0 left-0 z-40 w-68 bg-white dark:bg-[#080d1a]/95 dark:backdrop-blur-xl border-r border-navy/5 dark:border-white/4 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:transform-none shadow-(--shadow-xl) lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-xl bg-navy/4 text-navy/50 hover:bg-navy/8 hover:text-navy z-50 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {sidebarContent}
      </aside>
    </>
  );
}
