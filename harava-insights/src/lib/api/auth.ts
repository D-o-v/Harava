/**
 * Auth service — single login flow, role derived from JWT.
 *
 * Login logic:
 *   - tenantId provided  → POST /api/v1/auth/login  (tenant user)
 *   - no tenantId        → POST /api/v1/platform/auth/login  (platform admin)
 *
 * After login the JWT is decoded and isPlatformAdmin() drives all routing.
 */

import { api } from "./client";
import { setTokens, getRefreshToken, clearTokens, setTenantId, isPlatformAdmin } from "./token-store";
import {
  LoginResponse,
  MfaVerifyResponse,
  UserResponse,
  InvitationPreview,
  AcceptInviteResponse,
  Tokens,
} from "./types";
import type { PlatformLoginResponse } from "./platform";

// ─── Unified Login ─────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string,
  tenantId?: string
): Promise<LoginResponse> {
  if (tenantId?.trim()) {
    // Tenant user — set tenant context then call tenant login
    setTenantId(tenantId.trim());
    const data = await api<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
      noAuth: true,
      isTokenEndpoint: true,
    });
    if (!data.mfaRequired && data.tokens) {
      setTokens(data.tokens);
    }
    return data;
  }

  // No tenantId — try platform admin login
  setTenantId(null);
  const data = await api<PlatformLoginResponse>("/api/v1/platform/auth/login", {
    method: "POST",
    body: { email, password },
    noAuth: true,
    isTokenEndpoint: true,
    skipTenantHeader: true,
  });

  // Platform login returns flat token object (not wrapped in LoginResponse)
  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    tokenType: data.tokenType,
    expiresIn: data.expiresIn,
  });

  // Return in LoginResponse shape so callers are uniform
  return {
    mfaRequired: false,
    mfaMethod: null,
    mfaToken: null,
    tokens: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tokenType: data.tokenType,
      expiresIn: data.expiresIn,
    },
  };
}

// ─── MFA Verify ────────────────────────────────────────────────────────────

export async function verifyMfa(mfaToken: string, code: string): Promise<Tokens> {
  const data = await api<MfaVerifyResponse>("/api/v1/auth/mfa/verify", {
    method: "POST",
    body: { mfaToken, code },
    noAuth: true,
    isTokenEndpoint: true,
  });
  setTokens(data.tokens);
  return data.tokens;
}

// ─── Logout ────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  const path = isPlatformAdmin()
    ? "/api/v1/platform/auth/logout"
    : "/api/v1/auth/logout";
  try {
    if (refreshToken) {
      await api(path, { method: "POST", body: { refreshToken } });
    }
  } finally {
    clearTokens();
  }
}

// ─── Get current user ──────────────────────────────────────────────────────

export async function getMe(): Promise<UserResponse> {
  return api<UserResponse>("/api/v1/account/me");
}

// ─── Password ──────────────────────────────────────────────────────────────

export async function forgotPassword(email: string): Promise<void> {
  await api("/api/v1/auth/password/forgot", {
    method: "POST",
    body: { email },
    noAuth: true,
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await api("/api/v1/auth/password/reset", {
    method: "POST",
    body: { token, newPassword },
    noAuth: true,
  });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api("/api/v1/account/password/change", {
    method: "POST",
    body: { currentPassword, newPassword },
  });
}

// ─── Email verification ────────────────────────────────────────────────────

export async function verifyEmail(token: string): Promise<void> {
  await api("/api/v1/auth/verify-email", { method: "POST", body: { token }, noAuth: true });
}

export async function resendVerification(email: string): Promise<void> {
  await api("/api/v1/auth/resend-verification", { method: "POST", body: { email }, noAuth: true });
}

// ─── Invitations ───────────────────────────────────────────────────────────

export async function previewInvitation(token: string): Promise<InvitationPreview> {
  return api<InvitationPreview>(
    `/api/v1/auth/invitations/preview?token=${encodeURIComponent(token)}`,
    { noAuth: true }
  );
}

export async function acceptInvitation(
  token: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber?: string
): Promise<Tokens> {
  const data = await api<AcceptInviteResponse>("/api/v1/auth/invitations/accept", {
    method: "POST",
    body: { token, password, firstName, lastName, ...(phoneNumber ? { phoneNumber } : {}) },
    noAuth: true,
    isTokenEndpoint: true,
  });
  // data is flat Tokens (accessToken, refreshToken, tokenType, expiresIn)
  setTokens(data);
  return data;
}

// ─── MFA Setup ────────────────────────────────────────────────────────────

export async function setupTotp() {
  return api<{ secret: string; otpauthUri: string; qrCodeDataUri: string }>(
    "/api/v1/account/mfa/totp/setup",
    { method: "POST" }
  );
}

export async function enableTotp(code: string) {
  return api("/api/v1/account/mfa/totp/enable", { method: "POST", body: { code } });
}

export async function enableEmailMfa() {
  return api("/api/v1/account/mfa/email/enable", { method: "POST" });
}

export async function enableSmsMfa() {
  return api("/api/v1/account/mfa/sms/enable", { method: "POST" });
}

export async function sendEmailOtp() {
  return api("/api/v1/account/mfa/otp/send", { method: "POST" });
}

export async function sendSmsOtp() {
  return api("/api/v1/account/mfa/sms/send", { method: "POST" });
}

export async function disableMfa(code: string) {
  return api("/api/v1/account/mfa/disable", { method: "POST", body: { code } });
}

// ─── Tenant Resolution ─────────────────────────────────────────────────────

export interface TenantInfo {
  tenantId: string;
  organizationName: string;
  subdomain: string;
}

export async function resolveTenant(subdomain: string): Promise<TenantInfo> {
  return api<TenantInfo>(
    `/api/v1/auth/tenant?subdomain=${encodeURIComponent(subdomain)}`,
    { noAuth: true }
  );
}

export async function isSubdomainAvailable(subdomain: string): Promise<{ available: boolean }> {
  return api<{ available: boolean }>(
    `/api/v1/auth/subdomain-available?subdomain=${encodeURIComponent(subdomain)}`,
    { noAuth: true }
  );
}
