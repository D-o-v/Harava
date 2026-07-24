"use client";

/**
 * Token storage. Three scopes coexist: platform admin, tenant staff (firm
 * console), and client portal (company user). Each has its own access +
 * refresh pair. `activeScope` records which scope currently owns the app
 * session so the api client picks the right bearer.
 */

export type TokenScope = "platform" | "staff" | "portal";

const KEYS = {
  platform: { access: "harava_platform_token", refresh: "harava_platform_refresh" },
  staff: { access: "harava_staff_token", refresh: "harava_staff_refresh" },
  portal: { access: "harava_portal_token", refresh: "harava_portal_refresh" },
} as const;

const ACTIVE_KEY = "harava_active_scope";

const isBrowser = () => typeof window !== "undefined";

export const tokens = {
  get(scope: TokenScope) {
    if (!isBrowser()) return { access: null as string | null, refresh: null as string | null };
    return {
      access: localStorage.getItem(KEYS[scope].access),
      refresh: localStorage.getItem(KEYS[scope].refresh),
    };
  },
  set(scope: TokenScope, access: string | null, refresh: string | null) {
    if (!isBrowser()) return;
    if (access) localStorage.setItem(KEYS[scope].access, access);
    else localStorage.removeItem(KEYS[scope].access);
    if (refresh) localStorage.setItem(KEYS[scope].refresh, refresh);
    else localStorage.removeItem(KEYS[scope].refresh);
  },
  clear(scope: TokenScope) {
    if (!isBrowser()) return;
    localStorage.removeItem(KEYS[scope].access);
    localStorage.removeItem(KEYS[scope].refresh);
  },
  clearAll() {
    if (!isBrowser()) return;
    (Object.keys(KEYS) as TokenScope[]).forEach((s) => this.clear(s));
    localStorage.removeItem(ACTIVE_KEY);
  },
  getActive(): TokenScope | null {
    if (!isBrowser()) return null;
    return (localStorage.getItem(ACTIVE_KEY) as TokenScope | null) ?? null;
  },
  setActive(scope: TokenScope | null) {
    if (!isBrowser()) return;
    if (scope) localStorage.setItem(ACTIVE_KEY, scope);
    else localStorage.removeItem(ACTIVE_KEY);
  },
};
