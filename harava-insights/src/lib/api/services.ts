/**
 * Role-aware service layer.
 *
 * Every exported function automatically calls the correct endpoint:
 *   ROLE_PLATFORM_ADMIN  →  /api/v1/platform/tenants/...
 *   Tenant user          →  /api/v1/tenant/companies/...
 *
 * Components call e.g. companyService.getCompanies() and never
 * need to know which namespace is active.
 */

import { api } from "./client";
import { isPlatformAdmin } from "./token-store";
import {
  CompanyResponse,
  CompanyUserResponse,
  InsightSummaryResponse,
  CashflowResponse,
  PnlResponse,
  ReportSummaryResponse,
  ConnectionResponse,
  InvitationResponse,
  PortalProfileResponse,
  AuditEvent,
  Page,
} from "./types";
import type { TenantResponse, ProvisionTenantRequest } from "./platform";

// ─── Namespace resolver ────────────────────────────────────────────────────

/**
 * Returns the correct base path for "companies" depending on the
 * authenticated user's role.
 *
 *   Platform admin  →  /api/v1/platform/tenants
 *   Tenant user     →  /api/v1/tenant/companies
 */
function companiesBase(): string {
  return isPlatformAdmin()
    ? "/api/v1/platform/tenants"
    : "/api/v1/tenant/companies";
}

// ─── Companies / Tenants ───────────────────────────────────────────────────

/**
 * List companies (tenant) or tenants (platform admin).
 * Returns a unified CompanyResponse[] shape for tenant users,
 * or maps TenantResponse → CompanyResponse for platform admins.
 */
export async function getCompanies(): Promise<CompanyResponse[]> {
  if (isPlatformAdmin()) {
    const tenants = await api<TenantResponse[]>("/api/v1/platform/tenants");
    return tenants.map(tenantToCompany);
  }
  return api<CompanyResponse[]>("/api/v1/tenant/companies");
}

export async function getCompany(id: string): Promise<CompanyResponse> {
  if (isPlatformAdmin()) {
    // Platform API doesn't have a single-tenant GET — use list and filter
    const tenants = await api<TenantResponse[]>("/api/v1/platform/tenants");
    const t = tenants.find((t) => t.id === id);
    if (!t) throw new Error("Tenant not found");
    return tenantToCompany(t);
  }
  return api<CompanyResponse>(`/api/v1/tenant/companies/${id}`);
}

export async function createCompany(
  name: string,
  externalRef?: string
): Promise<CompanyResponse> {
  if (isPlatformAdmin()) {
    // Platform admin provisions a tenant — requires more fields;
    // this simplified version is used from the finsight clients page
    // (platform admins should use the admin/clients page instead)
    throw new Error("Platform admins provision tenants via the Admin panel.");
  }
  return api<CompanyResponse>("/api/v1/tenant/companies", {
    method: "POST",
    body: { name, externalRef },
  });
}

export async function updateCompany(
  id: string,
  data: { name?: string; externalRef?: string }
): Promise<CompanyResponse> {
  return api<CompanyResponse>(`/api/v1/tenant/companies/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function suspendCompany(id: string): Promise<CompanyResponse> {
  const path = isPlatformAdmin()
    ? `/api/v1/platform/tenants/${id}/suspend`
    : `/api/v1/tenant/companies/${id}/suspend`;
  if (isPlatformAdmin()) {
    const t = await api<TenantResponse>(path, { method: "POST" });
    return tenantToCompany(t);
  }
  return api<CompanyResponse>(path, { method: "POST" });
}

export async function activateCompany(id: string): Promise<CompanyResponse> {
  const path = isPlatformAdmin()
    ? `/api/v1/platform/tenants/${id}/activate`
    : `/api/v1/tenant/companies/${id}/activate`;
  if (isPlatformAdmin()) {
    const t = await api<TenantResponse>(path, { method: "POST" });
    return tenantToCompany(t);
  }
  return api<CompanyResponse>(path, { method: "POST" });
}

export async function getCompanyUsers(companyId: string): Promise<CompanyUserResponse[]> {
  // Only available for tenant users
  if (isPlatformAdmin()) return [];
  return api<CompanyUserResponse[]>(`/api/v1/tenant/companies/${companyId}/users`);
}

export async function inviteCompanyUser(
  companyId: string,
  email: string,
  roleId: string,
): Promise<InvitationResponse> {
  return api<InvitationResponse>(
    `/api/v1/tenant/companies/${companyId}/users/invite`,
    { method: "POST", body: { email, roleId } }
  );
}

// ─── Insights (tenant only) ────────────────────────────────────────────────

export async function getInsightSummary(companyId: string): Promise<InsightSummaryResponse> {
  return api<InsightSummaryResponse>(
    `/api/v1/tenant/companies/${companyId}/dashboard/kpis`
  );
}

export async function getCashflow(companyId: string): Promise<CashflowResponse> {
  return api<CashflowResponse>(
    `/api/v1/tenant/companies/${companyId}/dashboard/cash-flow`
  );
}

export async function getPnl(companyId: string): Promise<PnlResponse> {
  return api<PnlResponse>(`/api/v1/tenant/companies/${companyId}/dashboard/pnl`);
}

export async function getReports(companyId: string): Promise<ReportSummaryResponse[]> {
  const slugs = ["profit-loss", "balance-sheet", "cash-flow", "aged-receivables", "aged-payables", "trial-balance"];
  const results = await Promise.allSettled(
    slugs.map((slug) => api<ReportSummaryResponse>(`/api/v1/tenant/companies/${companyId}/dashboard/reports/${slug}`))
  );
  return results.flatMap((r) => r.status === "fulfilled" ? [r.value] : []);
}

// ─── QuickBooks (tenant only) ──────────────────────────────────────────────

export async function getQuickbooksStatus(companyId: string): Promise<ConnectionResponse> {
  return api<ConnectionResponse>(`/api/v1/tenant/companies/${companyId}/quickbooks`);
}

export async function connectQuickbooks(): Promise<ConnectionResponse> {
  return api<ConnectionResponse>(
    `/api/v1/tenant/quickbooks/connect`,
    { method: "POST" }
  );
}

export async function disconnectQuickbooks(companyId: string): Promise<ConnectionResponse> {
  return api<ConnectionResponse>(
    `/api/v1/tenant/companies/${companyId}/quickbooks`,
    { method: "DELETE" }
  );
}

// ─── Client Portal (portal user only) ─────────────────────────────────────

export async function getPortalProfile(): Promise<PortalProfileResponse> {
  return api<PortalProfileResponse>("/api/v1/portal/me");
}

export async function getPortalInsightSummary(): Promise<InsightSummaryResponse> {
  return api<InsightSummaryResponse>("/api/v1/portal/dashboard/kpis");
}

export async function getPortalCashflow(): Promise<CashflowResponse> {
  return api<CashflowResponse>("/api/v1/portal/dashboard/cash-flow");
}

export async function getPortalPnl(): Promise<PnlResponse> {
  return api<PnlResponse>("/api/v1/portal/dashboard/pnl");
}

export async function getPortalReports(): Promise<ReportSummaryResponse[]> {
  // Portal reports are fetched individually by slug via /api/v1/portal/dashboard/reports/{slug}
  const slugs = ["profit-loss", "balance-sheet", "cash-flow", "aged-receivables", "aged-payables", "trial-balance"];
  const results = await Promise.allSettled(slugs.map((slug) => api<ReportSummaryResponse>(`/api/v1/portal/dashboard/reports/${slug}`)));
  return results.flatMap((r) => r.status === "fulfilled" ? [r.value] : []);
}

// ─── Staff Invitations (tenant owner/admin) ────────────────────────────────

export async function getInvitations(): Promise<InvitationResponse[]> {
  return api<InvitationResponse[]>("/api/v1/account/invitations");
}

export async function createInvitation(
  email: string,
  role: "ADMIN" | "MEMBER"
): Promise<InvitationResponse> {
  return api<InvitationResponse>("/api/v1/account/invitations", {
    method: "POST",
    body: { email, role },
  });
}

export async function resendInvitation(id: string): Promise<void> {
  await api(`/api/v1/account/invitations/${id}/resend`, { method: "POST" });
}

export async function revokeInvitation(id: string): Promise<void> {
  await api(`/api/v1/account/invitations/${id}`, { method: "DELETE" });
}

// ─── Audit ─────────────────────────────────────────────────────────────────

export async function getAuditLog(page = 0, size = 20): Promise<Page<AuditEvent>> {
  return api<Page<AuditEvent>>(`/api/v1/account/audit?page=${page}&size=${size}`);
}

// ─── Internal: map TenantResponse → CompanyResponse ───────────────────────

function tenantToCompany(t: TenantResponse): CompanyResponse {
  return {
    id: t.id,
    name: t.organizationName,
    externalRef: t.subdomain,
    status: t.status,
    quickbooksConnected: false,
    userCount: 0,
    createdAt: t.createdAt,
  };
}
