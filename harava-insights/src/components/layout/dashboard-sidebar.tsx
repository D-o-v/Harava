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
  LayoutDashboard,
  Settings,
  Bell,
  User,
  MessageSquare,
  ChevronDown,
  Menu,
  X,
  LogOut,
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

const productColors = {
  finsight: "emerald",
  accrediai: "blue",
  proed: "violet",
  admin: "gray",
};

const productConfig = {
  finsight: { icon: BarChart3, name: "FinSight AI", href: "/finsight" },
  accrediai: { icon: ShieldCheck, name: "AccrediAI", href: "/accrediai" },
  proed: { icon: GraduationCap, name: "ProEd AI", href: "/proed" },
  admin: { icon: Settings, name: "Admin", href: "/admin" },
};

export function DashboardSidebar({ navigation, product }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasAccess } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showProductSwitcher, setShowProductSwitcher] = useState(false);
  const ProductIcon = productConfig[product].icon;

  // Listen for toggle event from header hamburger
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

  const colorClasses = {
    finsight: {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      hover: "hover:bg-emerald-50/50",
      icon: "text-emerald-600",
      badge: "bg-emerald-600",
    },
    accrediai: {
      active: "bg-blue-50 text-blue-700 border-blue-200",
      hover: "hover:bg-blue-50/50",
      icon: "text-blue-600",
      badge: "bg-blue-600",
    },
    proed: {
      active: "bg-violet-50 text-violet-700 border-violet-200",
      hover: "hover:bg-violet-50/50",
      icon: "text-violet-600",
      badge: "bg-violet-600",
    },
    admin: {
      active: "bg-gray-100 text-gray-900 border-gray-200",
      hover: "hover:bg-gray-50",
      icon: "text-gray-600",
      badge: "bg-gray-600",
    },
  };

  const colors = colorClasses[product];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-bold text-gray-900">Harava</span>
        </Link>
      </div>

      {/* Product Switcher */}
      <div className="p-3 border-b relative">
        <button
          onClick={() => setShowProductSwitcher(!showProductSwitcher)}
          className={cn("w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg", colors.active)}
        >
          <div className="flex items-center gap-2">
            <ProductIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{productConfig[product].name}</span>
          </div>
          <ChevronDown className={cn("w-3 h-3 transition-transform", showProductSwitcher && "rotate-180")} />
        </button>

        {showProductSwitcher && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 py-1">
            {(Object.keys(productConfig) as Array<keyof typeof productConfig>).map((key) => {
              if (key === product) return null;
              if (!hasAccess(key)) return null;
              const config = productConfig[key];
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => { router.push(config.href); setShowProductSwitcher(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Icon className="w-4 h-4" />
                  <span>{config.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
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
                    "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive ? colors.active : `text-gray-600 ${colors.hover}`
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", isExpanded && "rotate-180")} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive ? colors.active : `text-gray-600 ${colors.hover}`
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              )}

              {item.children && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-3 py-1.5 rounded-md text-sm transition-colors",
                        pathname === child.href ? colors.active : `text-gray-500 ${colors.hover}`
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
      <div className="p-3 border-t space-y-1">
        <Link
          href={`/${product}/notifications`}
          onClick={() => setMobileOpen(false)}
          className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600", colors.hover)}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </Link>
        <Link
          href={`/${product}/ai-chat`}
          onClick={() => setMobileOpen(false)}
          className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600", colors.hover)}
        >
          <MessageSquare className="w-4 h-4" />
          <span>AI Assistant</span>
        </Link>
        <Link
          href={`/${product}/profile`}
          onClick={() => setMobileOpen(false)}
          className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600", colors.hover)}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-3 border-t">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform lg:transform-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
