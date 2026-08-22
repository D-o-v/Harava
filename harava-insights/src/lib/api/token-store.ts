import { Tokens } from "./types";

/**
 * In-memory token store with JWT-based role detection.
 * Access token lives only in memory (never localStorage).
 */

let accessToken: string | null = null;
let refreshToken: string | null = null;
let expiresAt: number | null = null;
let tenantId: string | null = null;

// ─── JWT decode (no library needed — just base64) ──────────────────────────

export interface JwtPayload {
  sub: string;
  tid?: string;   // tenant ID — present for tenant users, absent for platform admin
  email: string;
  roles: string[];
  typ: string;
  iat: number;
  exp: number;
  jti: string;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // base64url → base64 → JSON
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "="));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

// ─── Role helpers ──────────────────────────────────────────────────────────

/** Returns true when the stored token belongs to a platform admin */
export function isPlatformAdmin(): boolean {
  if (!accessToken) return false;
  const payload = decodeJwt(accessToken);
  if (!payload) return false;
  return payload.roles.includes("ROLE_PLATFORM_ADMIN");
}

/** Returns the decoded roles array from the current token */
export function getTokenRoles(): string[] {
  if (!accessToken) return [];
  return decodeJwt(accessToken)?.roles ?? [];
}

/** Returns the decoded JWT payload (or null if no token) */
export function getTokenPayload(): JwtPayload | null {
  if (!accessToken) return null;
  return decodeJwt(accessToken);
}

// ─── Token CRUD ────────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

export function getTenantId(): string | null {
  return tenantId;
}

export function setTenantId(value: string | null): void {
  tenantId = value;
}

export function isTokenExpired(): boolean {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt - 30_000;
}

export function setTokens(tokens: Tokens): void {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  expiresAt = Date.now() + tokens.expiresIn * 1000;
  // Auto-extract tenant ID from JWT — only for tenant users (platform admin has no tid)
  const payload = decodeJwt(tokens.accessToken);
  if (payload?.tid && !payload.roles.includes("ROLE_PLATFORM_ADMIN")) {
    tenantId = payload.tid;
  } else if (payload?.roles.includes("ROLE_PLATFORM_ADMIN")) {
    tenantId = null; // ensure no stale tenant ID leaks into platform admin session
  }
}

export function clearTokens(): void {
  accessToken = null;
  refreshToken = null;
  expiresAt = null;
}
