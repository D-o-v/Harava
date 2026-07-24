"use client";

/**
 * Tenant context resolution from the current host.
 *
 *   firm-slug.localhost:3000          → subdomain = "firm-slug"        → tenant login
 *   firm-slug.lvh.me:3000             → subdomain = "firm-slug"        → tenant login
 *   firm-slug.harava-sandbox.com      → subdomain = "firm-slug"        → tenant login
 *   localhost / lvh.me / apex domain  → subdomain = null               → platform-admin login
 *
 * We resolve the subdomain → tenantId via the public
 * `GET /api/v1/auth/tenant?subdomain=` endpoint and cache it so every request
 * can attach `X-Tenant-ID` transparently. The user never sees any of this — the
 * login form is just email + password.
 */
import { API_BASE_URL } from "./client";
import { createDpopProof } from "./dpop";

// Hosts that are NEVER treated as a tenant subdomain.
const RESERVED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "lvh.me",
  "harava-sandbox.com",
  "harava.com",
  "netlify.app",
  "lovable.app",
  "vercel.app",
]);
const RESERVED_LEADING = new Set(["www", "app", "admin", "api"]);

export function detectSubdomain(): string | null {
  if (typeof window === "undefined") return null;
  const host = window.location.hostname.toLowerCase();
  if (!host || RESERVED_HOSTS.has(host)) return null;

  const parts = host.split(".");
  if (parts.length < 2) return null; // bare `localhost`, `foo`
  const first = parts[0];
  if (RESERVED_LEADING.has(first)) return null;

  // Lovable / Netlify / Vercel preview hosts are not tenant subdomains.
  if (parts.slice(-2).join(".") === "lovable.app") return null;
  if (parts.slice(-2).join(".") === "netlify.app") return null;
  if (parts.slice(-2).join(".") === "vercel.app") return null;

  return first;
}

interface ResolvedTenant {
  tenantId: string;
  organizationName?: string;
  branding?: unknown;
}

let cached: ResolvedTenant | null = null;
let inflight: Promise<ResolvedTenant | null> | null = null;

/** Resolve `<subdomain>` → tenant record, cached for the session. */
export async function resolveTenant(): Promise<ResolvedTenant | null> {
  const subdomain = detectSubdomain();
  if (!subdomain) return null;
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const url = `${API_BASE_URL}/api/v1/auth/tenant?subdomain=${encodeURIComponent(subdomain)}`;
      // Plain fetch (avoids re-entering the api wrapper) — still DPoP-signed
      // because the backend enforces DPoP on every route.
      const proof = await createDpopProof("GET", url, null);
      const res = await fetch(url, {
        headers: { Accept: "application/json", DPoP: proof },
      });
      if (!res.ok) return null;
      const json = await res.json().catch(() => null);
      const data = (json?.data ?? json) as ResolvedTenant | null;
      if (!data?.tenantId) return null;
      cached = data;
      return data;
    } catch {
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/** Synchronous accessor — returns the cached tenant, or null before resolution. */
export function getResolvedTenant(): ResolvedTenant | null {
  return cached;
}

export function getResolvedTenantId(): string | null {
  return cached?.tenantId ?? null;
}

/** True when the current host has NO tenant subdomain → platform-admin flow. */
export function isPlatformHost(): boolean {
  return detectSubdomain() === null;
}

export function clearTenantCache() {
  cached = null;
}
