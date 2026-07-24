"use client";

import { tokens, type TokenScope } from "./tokens";
import { createDpopProof } from "./dpop";
import { resolveTenant, getResolvedTenantId } from "./tenant-context";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface ApiRequestInit extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  scope?: TokenScope | "auto" | "none";
  raw?: boolean; // return raw Response instead of unwrapping
  /** Skip attaching X-Tenant-ID (used for platform-only endpoints). */
  skipTenant?: boolean;
  /** Backward-compatible alias used by older API modules. */
  noAuth?: boolean;
  /** Backward-compatible alias used by older API modules. */
  skipTenantHeader?: boolean;
  /** Backward-compatible flag kept for older token endpoint callers. */
  isTokenEndpoint?: boolean;
}

interface Envelope<T> {
  data?: T;
  error?: { code?: string; message?: string; details?: unknown };
  message?: string;
}

const REFRESH_PATHS: Record<TokenScope, string> = {
  platform: "/api/v1/platform/auth/refresh",
  staff: "/api/v1/auth/refresh",
  portal: "/api/v1/auth/refresh",
};

let refreshInFlight: Promise<boolean> | null = null;

async function refreshToken(scope: TokenScope): Promise<boolean> {
  const { refresh } = tokens.get(scope);
  if (!refresh) return false;
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const url = `${API_BASE_URL}${REFRESH_PATHS[scope]}`;
      const proof = await createDpopProof("POST", url, null);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", DPoP: proof },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (!res.ok) return false;
      const json = (await res.json()) as Envelope<{ accessToken: string; refreshToken?: string }>;
      const data = json.data;
      if (!data?.accessToken) return false;
      tokens.set(scope, data.accessToken, data.refreshToken ?? refresh);
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

function buildUrl(path: string, query?: ApiRequestInit["query"]) {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function resolveScope(explicit: ApiRequestInit["scope"]): TokenScope | null {
  if (!explicit || explicit === "auto") return tokens.getActive();
  if (explicit === "none") return null;
  return explicit;
}

export async function apiRequest<T = unknown>(
  path: string,
  init: ApiRequestInit = {},
): Promise<T> {
  const { body, query, scope, headers, raw, skipTenant, noAuth, skipTenantHeader, isTokenEndpoint: _isTokenEndpoint, ...rest } = init;
  const activeScope = noAuth ? null : resolveScope(scope);
  const method = (rest.method || "GET").toUpperCase();
  const fullUrl = buildUrl(path, query);
  const isPlatformPath = path.startsWith("/api/v1/platform/");
  const shouldSkipTenant = Boolean(skipTenant || skipTenantHeader);

  // Kick off tenant resolution once per session; safe to await concurrently.
  // Platform endpoints never carry X-Tenant-ID.
  const tenantPromise =
    shouldSkipTenant || isPlatformPath ? Promise.resolve(null) : resolveTenant();

  const doFetch = async (): Promise<Response> => {
    const h = new Headers(headers as HeadersInit | undefined);
    if (!h.has("Accept")) h.set("Accept", "application/json");
    if (body !== undefined && !(body instanceof FormData)) {
      if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
    }

    let bearer: string | null = null;
    if (activeScope) {
      bearer = tokens.get(activeScope).access;
      if (bearer) h.set("Authorization", `Bearer ${bearer}`);
    }

    // Tenant header — resolved from current subdomain (localhost dev included).
    await tenantPromise;
    const tenantId = getResolvedTenantId();
    if (tenantId && !shouldSkipTenant && !isPlatformPath && !h.has("X-Tenant-ID")) {
      h.set("X-Tenant-ID", tenantId);
    }

    // DPoP proof — required by backend on every request; harmless when disabled.
    try {
      const proof = await createDpopProof(method, fullUrl.split("?")[0], bearer);
      h.set("DPoP", proof);
    } catch {
      // DPoP failure shouldn't kill the request outright — server will 401 if required.
    }

    return fetch(fullUrl, {
      ...rest,
      headers: h,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    });
  };

  let res = await doFetch();
  if (res.status === 401 && activeScope) {
    const ok = await refreshToken(activeScope);
    if (ok) res = await doFetch();
  }

  if (raw) return res as unknown as T;

  const text = await res.text();
  let json: Envelope<T> | null = null;
  try {
    json = text ? (JSON.parse(text) as Envelope<T>) : null;
  } catch {
    // non-json response
  }

  if (!res.ok) {
    const msg =
      json?.error?.message ||
      json?.message ||
      (typeof json === "object" && json && "error" in json && typeof (json as { error?: unknown }).error === "string"
        ? String((json as { error: string }).error)
        : "") ||
      res.statusText ||
      "Request failed";
    throw new ApiError(res.status, msg, json?.error?.code, json?.error?.details);
  }

  if (json && "data" in json) return json.data as T;
  return (json ?? (text as unknown)) as T;
}

export const api = apiRequest;
