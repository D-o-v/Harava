"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

/**
 * Gives every in-app link immediate feedback while App Router finishes its
 * client-side transition. It deliberately ignores hash links and external
 * destinations, which do not load a new application view.
 */
export function NavigationLoader() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    const completed = window.setTimeout(() => {
      setIsNavigating(false);
      window.clearTimeout(timeout.current);
    }, 0);
    return () => window.clearTimeout(completed);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const target = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);
      if (target.origin !== current.origin || (target.pathname === current.pathname && target.search === current.search)) return;

      setIsNavigating(true);
      window.clearTimeout(timeout.current);
      // A cancelled navigation should never leave the interface blocked.
      timeout.current = window.setTimeout(() => setIsNavigating(false), 5000);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(timeout.current);
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-navy/15 backdrop-blur-[2px] pointer-events-none" aria-live="polite" aria-label="Loading page">
      <div className="flex items-center gap-2.5 rounded-xl border border-white/60 bg-white/95 px-4 py-3 text-[12px] font-semibold text-navy shadow-(--shadow-xl) dark:border-white/10 dark:bg-[#101830]/95">
        <LoaderCircle className="h-4 w-4 animate-spin text-gold" />
        Loading page…
      </div>
    </div>
  );
}
