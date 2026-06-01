"use client";

import { Bell, Search, MessageSquare, User, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth, ROLE_LABELS } from "@/lib/auth";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine current product from pathname for scoped links
  const currentProduct = pathname.startsWith("/finsight") ? "finsight"
    : pathname.startsWith("/accrediai") ? "accrediai"
    : pathname.startsWith("/proed") ? "proed"
    : pathname.startsWith("/admin") ? "admin"
    : "finsight";

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 border-b bg-white flex items-center justify-between px-3 sm:px-6 gap-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
          className="lg:hidden p-1.5 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 truncate hidden sm:block">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm outline-none w-48 placeholder:text-gray-400"
          />
        </div>

        {/* AI Assistant */}
        <Link
          href={`/${currentProduct}/ai-chat`}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors hidden sm:block"
          title="AI Assistant"
        >
          <MessageSquare className="w-5 h-5" />
        </Link>

        {/* Notifications */}
        <Link
          href={`/${currentProduct}/notifications`}
          className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 sm:pl-3 border-l"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              {user ? (
                <span className="text-[10px] sm:text-xs font-bold text-emerald-700">{user.firstName[0]}{user.lastName[0]}</span>
              ) : (
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              )}
            </div>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 py-2">
                {user && (
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{ROLE_LABELS[user.role]}</p>
                  </div>
                )}
                <Link
                  href={`/${currentProduct}/profile`}
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href={`/${currentProduct}/notifications`}
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Bell className="w-4 h-4" />
                  Notifications
                </Link>
                <button
                  onClick={() => { setShowProfile(false); logout(); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
