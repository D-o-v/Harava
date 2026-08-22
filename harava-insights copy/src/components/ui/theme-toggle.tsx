"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

interface ThemeToggleProps {
  /** "light" for use on dark backgrounds (hero), "dark" for light backgrounds */
  variant?: "light" | "dark";
  className?: string;
}

export function ThemeToggle({ variant = "dark", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
        variant === "light"
          ? "text-white/60 hover:text-white hover:bg-white/10"
          : "text-navy/40 hover:text-navy/70 hover:bg-navy/5 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10"
      } ${className}`}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
    </button>
  );
}
