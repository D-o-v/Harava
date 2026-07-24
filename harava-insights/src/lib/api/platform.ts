/**
 * Platform Admin endpoints (/api/v1/platform/*).
 * These are for the PLATFORM_ADMIN role — separate console.
 * Included for completeness; the guide recommends a separate mini-app.
 */

import { api } from "./client";
import { setTokens, clearTokens } from "./token-store";

// ─── Platform Auth ─────────────────────────────────────────────────────────

export interface PlatformLoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export async function platformLogin(
  email: string,
  password: string
): Promise<PlatformLoginResponse> {
  const data = await api<PlatformLoginResponse>("/api/v1/platform/auth/login", {
    method: "POST",
    body: { email, password },
    noAuth: true,
    isTokenEndpoint: true,
    skipTenantHeader: true,
  });

  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    tokenType: data.tokenType,
    expiresIn: data.expiresIn,
  });

  return data;
}

export async function platformRefresh(refreshToken: string): Promise<PlatformLoginResponse> {
  const data = await api<PlatformLoginResponse>("/api/v1/platform/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    noAuth: true,
    isTokenEndpoint: true,
    skipTenantHeader: true,
  });

  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    tokenType: data.tokenType,
    expiresIn: data.expiresIn,
  });

  return data;
}

export async function platformLogout(refreshToken: string): Promise<void> {
  try {
    await api("/api/v1/platform/auth/logout", {
      method: "POST",
      body: { refreshToken },
    });
  } finally {
    clearTokens();
  }
}

// ─── Tenant Management ─────────────────────────────────────────────────────

export interface ProvisionTenantRequest {
  organizationName: string;
  subdomain: string;
  ownerEmail: string;
  billingMode?: "SUBSCRIPTION" | "OPEN";
  countryCode?: string;
  defaultCurrency?: string;
  timezone?: string;
}

export interface TenantResponse {
  id: string;
  organizationName: string;
  subdomain: string;
  status: "ACTIVE" | "SUSPENDED";
  billingMode: "SUBSCRIPTION" | "OPEN";
  ownerEmail: string;
  countryCode?: string;
  defaultCurrency?: string;
  timezone?: string;
  createdAt: string;
}

export async function provisionTenant(
  data: ProvisionTenantRequest
): Promise<TenantResponse> {
  return api<TenantResponse>("/api/v1/platform/tenants", {
    method: "POST",
    body: data,
  });
}

export async function listTenants(): Promise<TenantResponse[]> {
  return api<TenantResponse[]>("/api/v1/platform/tenants");
}

export async function suspendTenant(tenantId: string): Promise<TenantResponse> {
  return api<TenantResponse>(`/api/v1/platform/tenants/${tenantId}/suspend`, {
    method: "POST",
  });
}

export async function activateTenant(tenantId: string): Promise<TenantResponse> {
  return api<TenantResponse>(`/api/v1/platform/tenants/${tenantId}/activate`, {
    method: "POST",
  });
}
