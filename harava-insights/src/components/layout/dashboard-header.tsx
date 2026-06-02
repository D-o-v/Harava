"use client";

import { Bell, Search, User, LogOut, Menu, Sparkles } from "lucide-react";
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
  const [searchFocused, setSearchFocused] = useState(false);

  const currentProduct = pathname.startsWith("/finsight") ? "finsight"
    : pathname.startsWith("/accrediai") ? "accrediai"
    : pathname.startsWith("/proed") ? "proed"
    : pathname.startsWith("/admin") ? "admin"
    : "finsight";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-navy/[0.05] bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 gap-3">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
          className="lg:hidden p-2 -ml-1 rounded-xl text-navy/40 hover:bg-navy/[0.04] hover:text-navy transition-all duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-[15px] sm:text-lg font-semibold text-navy truncate tracking-tight">{title}</h1>
          {subtitle && <p className="text-[11px] text-navy/40 truncate hidden sm:block mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Search */}
        <div className={`hidden md:flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all duration-300 ${searchFocused ? "bg-white border-gold/30 shadow-[0_0_0_3px_rgba(193,155,63,0.06)] border-[1.5px]" : "bg-navy/[0.03] border border-navy/[0.05] hover:bg-navy/[0.05]"}`}>
          <Search className="w-4 h-4 text-navy/30" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-sm outline-none w-44 lg:w-52 placeholder:text-navy/30 text-navy"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-0.5 rounded border border-navy/[0.08] bg-navy/[0.02] px-1.5 font-mono text-[10px] text-navy/30">
            ⌘K
          </kbd>
        </div>

        {/* AI Assistant */}
        <Link
          href={`/${currentProduct}/ai-chat`}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-gold/70 hover:text-gold hover:bg-gold/[0.05] transition-all duration-200 group"
          title="AI Assistant"
        >
          <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-[11px] font-semibold hidden lg:inline uppercase tracking-wider">AI</span>
        </Link>

        {/* Notifications */}
        <Link
          href={`/${currentProduct}/notifications`}
          className="relative p-2 rounded-xl text-navy/35 hover:bg-navy/[0.04] hover:text-navy/60 transition-all duration-200"
          title="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full ring-2 ring-white animate-pulse-soft" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 pl-3 border-l border-navy/[0.06] hover:opacity-90 transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-navy to-navy-light rounded-xl flex items-center justify-center shadow-sm ring-2 ring-navy/[0.06]">
              {user ? (
                <span className="text-[10px] font-bold text-white">{user.firstName[0]}{user.lastName[0]}</span>
              ) : (
                <User className="w-3.5 h-3.5 text-white/80" />
              )}
            </div>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-2.5 w-64 bg-white border border-navy/[0.06] rounded-2xl shadow-[var(--shadow-2xl)] z-50 overflow-hidden animate-scale-in">
                {/* Gold accent */}
                <div className="h-[3px] bg-gradient-to-r from-gold via-gold-light to-transparent" />

                {user && (
                  <div className="px-4 py-4 border-b border-navy/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-[11px] text-navy/40 truncate mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center mt-2.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gold/[0.08] text-gold-dark border border-gold/[0.12]">
                      {ROLE_LABELS[user.role]}
                    </span>
                  </div>
                )}
                <div className="py-1.5">
                  <Link
                    href={`/${currentProduct}/profile`}
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-navy/65 hover:bg-navy/[0.03] hover:text-navy transition-all duration-200"
                  >
                    <User className="w-4 h-4 text-navy/35" />
                    Profile Settings
                  </Link>
                  <Link
                    href={`/${currentProduct}/notifications`}
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-navy/65 hover:bg-navy/[0.03] hover:text-navy transition-all duration-200"
                  >
                    <Bell className="w-4 h-4 text-navy/35" />
                    Notifications
                  </Link>
                </div>
                <div className="pt-1 border-t border-navy/[0.05]">
                  <button
                    onClick={() => { setShowProfile(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-400 hover:bg-red-50/80 hover:text-red-600 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
