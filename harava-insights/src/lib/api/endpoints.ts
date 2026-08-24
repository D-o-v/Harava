"use client";

import { apiRequest } from "./client";

/* =========================================================
 * Auth (tenant staff + company user share these endpoints)
 * ========================================================= */

export interface LoginResponse {
  // flat shape (platform login / MFA verify)
  accessToken?: string;
  refreshToken?: string;
  // nested shape returned by the tenant MFA verification endpoint
  tokens?: { accessToken?: string; refreshToken?: string; tokenType?: string; expiresIn?: number };
  // nested shape (tenant staff login)
  session?: {
    tokens?: { accessToken?: string; refreshToken?: string };
    user?: UserProfile;
    tenant?: { id: string; slug: string; name: string };
    company?: { id: string; name: string } | null;
    roles?: string[];
    permissions?: string[];
  };
  mfaRequired?: boolean;
  mfaToken?: string;
  mfaMethod?: string;
  mfaChannels?: string[];
  scope?: "STAFF" | "CLIENT" | "PLATFORM";
  user?: UserProfile;
  roles?: string[];
  permissions?: string[];
  company?: { id: string; name: string } | null;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  roles?: string[];
  scope?: "STAFF" | "CLIENT" | "PLATFORM";
  tenantId?: string;
  companyId?: string;
  phoneNumber?: string;
  mfaEnabled?: boolean;
  mfaMethods?: string[];
  organizationName?: string;
  branding?: { logoUrl?: string; primaryColor?: string; name?: string };
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
      scope: "none",
    }),
  mfaVerify: (mfaToken: string, code: string) =>
    apiRequest<LoginResponse>("/api/v1/auth/mfa/verify", {
      method: "POST",
      body: { mfaToken, code },
      scope: "none",
    }),
  refresh: (refreshToken: string) =>
    apiRequest<LoginResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      scope: "none",
    }),
  logout: () => apiRequest<void>("/api/v1/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    apiRequest<void>("/api/v1/auth/password/forgot", {
      method: "POST",
      body: { email },
      scope: "none",
    }),
  resetPassword: (token: string, newPassword: string) =>
    apiRequest<void>("/api/v1/auth/password/reset", {
      method: "POST",
      body: { token, newPassword },
      scope: "none",
    }),
  verifyEmail: (token: string) =>
    apiRequest<void>("/api/v1/auth/verify-email", {
      method: "POST",
      body: { token },
      scope: "none",
    }),
  resendVerification: (email: string) =>
    apiRequest<void>("/api/v1/auth/resend-verification", {
      method: "POST",
      body: { email },
      scope: "none",
    }),
  resolveTenant: (subdomain: string) =>
    apiRequest<{ tenantId: string; organizationName: string; branding?: unknown }>(
      "/api/v1/auth/tenant",
      { query: { subdomain }, scope: "none" },
    ),
  subdomainAvailable: (subdomain: string) =>
    apiRequest<{ available: boolean }>("/api/v1/auth/subdomain-available", {
      query: { subdomain },
      scope: "none",
    }),
  previewInvitation: (token: string) =>
    apiRequest<{
      email: string;
      role?: string;
      firstName?: string;
      lastName?: string;
      organizationName?: string;
      companyName?: string;
      invitationType?: "OWNER" | "STAFF" | "COMPANY_USER";
      expiresAt?: string;
    }>("/api/v1/auth/invitations/preview", { query: { token }, scope: "none" }),
  acceptInvitation: (payload: {
    token: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }) =>
    apiRequest<LoginResponse>("/api/v1/auth/invitations/accept", {
      method: "POST",
      body: payload,
      scope: "none",
    }),
};

/* =========================================================
 * Platform admin
 * ========================================================= */

export interface Tenant {
  id: string;
  organizationName: string;
  subdomain: string;
  status: string;
  ownerEmail?: string;
  createdAt?: string;
  countryCode?: string;
  defaultCurrency?: string;
  billingMode?: string;
}

export const platformApi = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>("/api/v1/platform/auth/login", {
      method: "POST",
      body: { email, password },
      scope: "none",
    }),
  refresh: (refreshToken: string) =>
    apiRequest<LoginResponse>("/api/v1/platform/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      scope: "none",
    }),
  logout: () => apiRequest<void>("/api/v1/platform/auth/logout", { method: "POST" }),
  getMe: () => apiRequest<UserProfile>("/api/v1/platform/me"),
  listTenants: () => apiRequest<Tenant[]>("/api/v1/platform/tenants"),
  provisionTenant: (payload: {
    organizationName: string;
    subdomain: string;
    ownerEmail: string;
    billingMode: string;
    countryCode: string;
    defaultCurrency: string;
    timezone: string;
  }) => apiRequest<Tenant>("/api/v1/platform/tenants", { method: "POST", body: payload }),
  suspend: (tenantId: string) =>
    apiRequest<void>(`/api/v1/platform/tenants/${tenantId}/suspend`, { method: "POST" }),
  activate: (tenantId: string) =>
    apiRequest<void>(`/api/v1/platform/tenants/${tenantId}/activate`, { method: "POST" }),
  broadcast: (payload: { title: string; body: string; url?: string }) =>
    apiRequest<{ id: string }>("/api/v1/platform/notifications/broadcast", {
      method: "POST",
      body: payload,
    }),
};

/* =========================================================
 * Account (staff & company user)
 * ========================================================= */

export const accountApi = {
  me: () => apiRequest<UserProfile>("/api/v1/account/me"),
  permissions: () =>
    apiRequest<{ roles: string[]; permissions: string[] }>("/api/v1/account/permissions"),
  updateProfile: (payload: { firstName?: string; lastName?: string; phoneNumber?: string }) =>
    apiRequest<UserProfile>("/api/v1/account/me", { method: "PATCH", body: payload }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<void>("/api/v1/account/password/change", {
      method: "POST",
      body: { currentPassword, newPassword },
    }),
  audit: (params?: { page?: number; size?: number }) =>
    apiRequest<{ content: unknown[]; totalElements: number; totalPages: number }>(
      "/api/v1/account/audit",
      { query: params },
    ),
};

/* =========================================================
 * Staff invitations & users (firm-scope)
 * ========================================================= */

export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  expiresAt?: string;
}

export interface StaffUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  enabled: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export const staffApi = {
  listInvitations: () => apiRequest<Invitation[]>("/api/v1/account/invitations"),
  invite: (payload: { email: string; role?: string; roleId?: string }) =>
    apiRequest<Invitation>("/api/v1/account/invitations", { method: "POST", body: payload }),
  resend: (id: string) =>
    apiRequest<void>(`/api/v1/account/invitations/${id}/resend`, { method: "POST" }),
  revoke: (id: string) => apiRequest<void>(`/api/v1/account/invitations/${id}`, { method: "DELETE" }),
  list: () => apiRequest<StaffUser[]>("/api/v1/account/users"),
  get: (id: string) => apiRequest<StaffUser>(`/api/v1/account/users/${id}`),
  update: (id: string, payload: Partial<StaffUser> & { roleId?: string }) =>
    apiRequest<StaffUser>(`/api/v1/account/users/${id}`, { method: "PATCH", body: payload }),
  remove: (id: string) => apiRequest<void>(`/api/v1/account/users/${id}`, { method: "DELETE" }),
};

/* =========================================================
 * MFA
 * ========================================================= */

type MfaEnableResponse = { method: string; backupCodes?: string[]; message?: string };

export const mfaApi = {
  totpSetup: () =>
    apiRequest<{ secret: string; otpauthUri: string; qrCodeDataUri: string }>(
      "/api/v1/account/mfa/totp/setup",
      { method: "POST" },
    ),
  totpEnable: (code: string) =>
    apiRequest<MfaEnableResponse>("/api/v1/account/mfa/totp/enable", { method: "POST", body: { code } }),
  emailSetup: () =>
    apiRequest<{ message: string }>("/api/v1/account/mfa/email/setup", { method: "POST" }),
  emailEnable: (code: string) =>
    apiRequest<MfaEnableResponse>("/api/v1/account/mfa/email/enable", { method: "POST", body: { code } }),
  sendEmailOtp: () =>
    apiRequest<{ message: string }>("/api/v1/account/mfa/otp/send", { method: "POST" }),
  smsSetup: () =>
    apiRequest<{ message: string }>("/api/v1/account/mfa/sms/setup", { method: "POST" }),
  smsEnable: (code: string) =>
    apiRequest<MfaEnableResponse>("/api/v1/account/mfa/sms/enable", { method: "POST", body: { code } }),
  sendSmsOtp: () =>
    apiRequest<{ message: string }>("/api/v1/account/mfa/sms/send", { method: "POST" }),
  disable: (code: string) =>
    apiRequest<{ message: string }>("/api/v1/account/mfa/disable", { method: "POST", body: { code } }),
};

/* =========================================================
 * Companies (firm console)
 * ========================================================= */

export interface Company {
  id: string;
  name: string;
  externalRef?: string;
  status: string;
  countryCode?: string;
  currency?: string;
  quickbooksConnected?: boolean;
  createdAt?: string;
}

export interface CompanyUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: string;
  role?: string;
  lastLoginAt?: string;
}

export const companiesApi = {
  list: () => apiRequest<Company[]>("/api/v1/tenant/companies"),
  get: (id: string) => apiRequest<Company>(`/api/v1/tenant/companies/${id}`),
  update: (id: string, payload: Partial<Company>) =>
    apiRequest<Company>(`/api/v1/tenant/companies/${id}`, { method: "PATCH", body: payload }),
  suspend: (id: string) =>
    apiRequest<void>(`/api/v1/tenant/companies/${id}/suspend`, { method: "POST" }),
  activate: (id: string) =>
    apiRequest<void>(`/api/v1/tenant/companies/${id}/activate`, { method: "POST" }),
  listUsers: (id: string) =>
    apiRequest<CompanyUser[]>(`/api/v1/tenant/companies/${id}/users`),
  inviteUser: (id: string, payload: { email: string; roleId: string }) =>
    apiRequest<Invitation>(`/api/v1/tenant/companies/${id}/users/invite`, {
      method: "POST",
      body: payload,
    }),
};

/* =========================================================
 * QuickBooks connect + data
 * ========================================================= */

export interface QbStatus {
  connected: boolean;
  realmId?: string;
  connectedAt?: string;
  lastSyncAt?: string;
  syncState?: string;
  entitiesSynced?: number;
  totalEntities?: number;
}

export const quickbooksApi = {
  status: (companyId: string) =>
    apiRequest<QbStatus>(`/api/v1/tenant/companies/${companyId}/quickbooks`),
  startConnect: () =>
    apiRequest<{ authorizationUrl: string; state?: string }>(
      "/api/v1/tenant/quickbooks/connect",
      { method: "POST" },
    ),
  reconnect: (companyId: string) =>
    apiRequest<{ authorizationUrl: string }>(
      `/api/v1/tenant/companies/${companyId}/quickbooks/reconnect`,
      { method: "POST" },
    ),
  disconnect: (companyId: string) =>
    apiRequest<void>(`/api/v1/tenant/companies/${companyId}/quickbooks`, { method: "DELETE" }),
  syncStatus: (companyId: string) =>
    apiRequest<QbStatus>(`/api/v1/tenant/companies/${companyId}/quickbooks/status`),
  entities: (companyId: string) =>
    apiRequest<Array<{ slug: string; name: string; count: number }>>(
      `/api/v1/tenant/companies/${companyId}/quickbooks/entities`,
    ),
  list: <T = Record<string, unknown>>(companyId: string, slug: string, page = 0, size = 50) =>
    apiRequest<{ items?: T[]; content?: T[]; total: number; totalElements?: number; page: number; size: number }>(
      `/api/v1/tenant/companies/${companyId}/quickbooks/${slug}`,
      { query: { page, size } },
    ),
  get: <T = Record<string, unknown>>(companyId: string, slug: string, objectId: string) =>
    apiRequest<T>(`/api/v1/tenant/companies/${companyId}/quickbooks/${slug}/${objectId}`),
};

/* =========================================================
 * Firm-console dashboards + reports (per company)
 * ========================================================= */

export const dashboardApi = {
  kpis: (companyId: string) =>
    apiRequest<Record<string, unknown>>(
      `/api/v1/tenant/companies/${companyId}/dashboard/kpis`,
    ),
  pnl: (companyId: string, months = 12) =>
    apiRequest<Record<string, unknown>>(
      `/api/v1/tenant/companies/${companyId}/dashboard/pnl`,
      { query: { months } },
    ),
  cashFlow: (companyId: string, months = 12) =>
    apiRequest<Record<string, unknown>>(
      `/api/v1/tenant/companies/${companyId}/dashboard/cash-flow`,
      { query: { months } },
    ),
  balanceSheet: (companyId: string) =>
    apiRequest<Record<string, unknown>>(
      `/api/v1/tenant/companies/${companyId}/dashboard/balance-sheet`,
    ),
  receivables: (companyId: string) =>
    apiRequest<Record<string, unknown>>(
      `/api/v1/tenant/companies/${companyId}/dashboard/receivables`,
    ),
  payables: (companyId: string) =>
    apiRequest<Record<string, unknown>>(
      `/api/v1/tenant/companies/${companyId}/dashboard/payables`,
    ),
  sales: (companyId: string, months = 12) =>
    apiRequest<Record<string, unknown>>(
      `/api/v1/tenant/companies/${companyId}/dashboard/sales`,
      { query: { months } },
    ),
  expenses: (companyId: string, months = 12) =>
    apiRequest<Record<string, unknown>>(
      `/api/v1/tenant/companies/${companyId}/dashboard/expenses`,
      { query: { months } },
    ),
  inventory: (companyId: string) =>
    apiRequest<Record<string, unknown>>(
      `/api/v1/tenant/companies/${companyId}/dashboard/inventory`,
    ),
  activity: (companyId: string, limit = 20) =>
    apiRequest<Record<string, unknown>[]>(
      `/api/v1/tenant/companies/${companyId}/dashboard/activity`,
      { query: { limit } },
    ),
  report: (companyId: string, slug: string, query?: Record<string, string | number>) =>
    apiRequest<Record<string, unknown>>(
      `/api/v1/tenant/companies/${companyId}/dashboard/reports/${slug}`,
      { query },
    ),
};

/* =========================================================
 * Client portal (company user, /portal/*)
 * ========================================================= */

export const portalApi = {
  me: () => apiRequest<UserProfile>("/api/v1/portal/me"),
  syncStatus: () => apiRequest<QbStatus>("/api/v1/portal/quickbooks/status"),
  entities: () =>
    apiRequest<Array<{ slug: string; name: string; count: number }>>(
      "/api/v1/portal/quickbooks/entities",
    ),
  list: <T = Record<string, unknown>>(slug: string, page = 0, size = 50) =>
    apiRequest<{ content: T[]; totalElements: number; totalPages: number }>(
      `/api/v1/portal/quickbooks/${slug}`,
      { query: { page, size } },
    ),
  get: <T = Record<string, unknown>>(slug: string, id: string) =>
    apiRequest<T>(`/api/v1/portal/quickbooks/${slug}/${id}`),
  dashboard: {
    kpis: () => apiRequest<Record<string, unknown>>("/api/v1/portal/dashboard/kpis"),
    pnl: (months = 12) =>
      apiRequest<Record<string, unknown>>("/api/v1/portal/dashboard/pnl", { query: { months } }),
    cashFlow: (months = 12) =>
      apiRequest<Record<string, unknown>>("/api/v1/portal/dashboard/cash-flow", { query: { months } }),
    balanceSheet: () => apiRequest<Record<string, unknown>>("/api/v1/portal/dashboard/balance-sheet"),
    receivables: () => apiRequest<Record<string, unknown>>("/api/v1/portal/dashboard/receivables"),
    payables: () => apiRequest<Record<string, unknown>>("/api/v1/portal/dashboard/payables"),
    sales: (months = 12) =>
      apiRequest<Record<string, unknown>>("/api/v1/portal/dashboard/sales", { query: { months } }),
    expenses: (months = 12) =>
      apiRequest<Record<string, unknown>>("/api/v1/portal/dashboard/expenses", { query: { months } }),
    inventory: () => apiRequest<Record<string, unknown>>("/api/v1/portal/dashboard/inventory"),
    activity: (limit = 20) =>
      apiRequest<Record<string, unknown>[]>("/api/v1/portal/dashboard/activity", { query: { limit } }),
    report: (slug: string, query?: Record<string, string | number>) =>
      apiRequest<Record<string, unknown>>(`/api/v1/portal/dashboard/reports/${slug}`, { query }),
  },
};

/* =========================================================
 * Reference data
 * ========================================================= */

export interface Country {
  code: string;
  name: string;
  currency?: string;
  currencyName?: string;
  timezones?: string[];
}
export interface Currency { code: string; name: string; symbol?: string }

export const referenceApi = {
  timezones: () => apiRequest<string[]>("/api/v1/reference/timezones", { scope: "none" }),
  countries: () => apiRequest<Country[]>("/api/v1/reference/countries", { scope: "none" }),
  country: (code: string) => apiRequest<Country>(`/api/v1/reference/countries/${code}`, { scope: "none" }),
  currencies: () => apiRequest<Currency[]>("/api/v1/reference/currencies", { scope: "none" }),
};

/* =========================================================
 * Notifications
 * ========================================================= */

export interface Notification {
  id: string;
  title: string;
  body?: string;
  url?: string;
  category?: string;
  read: boolean;
  createdAt: string;
}

export const notificationsApi = {
  registerDevice: (payload: { token: string; platform: "WEB" | "ANDROID" | "IOS"; label?: string }) =>
    apiRequest<{ id: string }>("/api/v1/notifications/devices", { method: "POST", body: payload }),
  listDevices: () => apiRequest<Array<{ id: string; platform: string; label?: string; lastSeenAt?: string }>>("/api/v1/notifications/devices"),
  unregisterDevice: (id: string) =>
    apiRequest<void>(`/api/v1/notifications/devices/${id}`, { method: "DELETE" }),
  list: (params?: { unread?: boolean; page?: number; size?: number }) =>
    apiRequest<{ content: Notification[]; totalElements: number; totalPages: number }>(
      "/api/v1/notifications",
      { query: params as Record<string, string | number | boolean | undefined> },
    ),
  unreadCount: () => apiRequest<{ count: number }>("/api/v1/notifications/unread-count"),
  markRead: (id: string) =>
    apiRequest<void>(`/api/v1/notifications/${id}/read`, { method: "POST" }),
  markAllRead: () => apiRequest<void>("/api/v1/notifications/read-all", { method: "POST" }),
  tenantBroadcast: (payload: {
    audience: "COMPANY" | "ALL_STAFF";
    companyId?: string;
    title: string;
    body: string;
    url?: string;
  }) =>
    apiRequest<{ id: string }>("/api/v1/tenant/notifications/broadcast", { method: "POST", body: payload }),
};

/* =========================================================
 * Roles (dropdowns)
 * ========================================================= */

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export const rolesApi = {
  staff: () => apiRequest<Role[]>("/api/v1/account/roles/staff"),
  company: () => apiRequest<Role[]>("/api/v1/account/roles/company"),
};

/* =========================================================
 * Platform god-mode (users & admins)
 * ========================================================= */

export interface PlatformUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tenantId?: string;
  enabled: boolean;
  roles?: string[];
  createdAt?: string;
}

export interface PlatformAdmin {
  id: string;
  email: string;
  name?: string;
  superAdmin: boolean;
  enabled: boolean;
  createdAt?: string;
}

export const platformGodApi = {
  listUsers: (params?: { email?: string; tenantId?: string }) =>
    apiRequest<PlatformUser[]>("/api/v1/platform/users", { query: params }),
  getUser: (id: string) => apiRequest<PlatformUser>(`/api/v1/platform/users/${id}`),
  disableUser: (id: string) =>
    apiRequest<void>(`/api/v1/platform/users/${id}/disable`, { method: "POST", body: {} }),
  enableUser: (id: string) =>
    apiRequest<void>(`/api/v1/platform/users/${id}/enable`, { method: "POST", body: {} }),
  forceLogout: (id: string) =>
    apiRequest<void>(`/api/v1/platform/users/${id}/force-logout`, { method: "POST", body: {} }),
  triggerPasswordReset: (id: string) =>
    apiRequest<void>(`/api/v1/platform/users/${id}/reset-password`, { method: "POST", body: {} }),
  deleteUser: (id: string) =>
    apiRequest<void>(`/api/v1/platform/users/${id}`, { method: "DELETE" }),
  tenantRoles: (tenantId: string) =>
    apiRequest<Role[]>(`/api/v1/platform/tenants/${tenantId}/roles`),
  listAdmins: () => apiRequest<PlatformAdmin[]>("/api/v1/platform/admins"),
  createAdmin: (payload: { email: string; password: string; name?: string; superAdmin?: boolean }) =>
    apiRequest<PlatformAdmin>("/api/v1/platform/admins", { method: "POST", body: payload }),
  updateAdmin: (id: string, payload: { name?: string; enabled?: boolean }) =>
    apiRequest<PlatformAdmin>(`/api/v1/platform/admins/${id}`, { method: "PATCH", body: payload }),
  deleteAdmin: (id: string) =>
    apiRequest<void>(`/api/v1/platform/admins/${id}`, { method: "DELETE" }),
};

/* =========================================================
 * Payroll
 * ========================================================= */

export interface PayrollEmployee {
  id: string;
  fullName: string;
  email?: string;
  jobTitle?: string;
  bankName?: string;
  bankAccountNumber?: string;
  baseSalary: number;
  currency: string;
  companyId?: string;
  active: boolean;
  createdAt?: string;
}

export interface PayrollApprovalChain {
  id: string;
  scope: "STAFF" | "COMPANY";
  steps: Array<{
    id?: string;
    name?: string;
    order?: number;
    userIds?: string[];
    roleId?: string;
  }>;
}

export type PayrollRunStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "PAID";

export interface PayrollRun {
  id: string;
  label?: string;
  periodStart: string;
  periodEnd: string;
  payDate?: string;
  currency?: string;
  status: PayrollRunStatus;
  companyId?: string;
  note?: string;
  totalGross?: number;
  totalNet?: number;
  createdAt?: string;
  lines?: PayrollLine[];
  approvalSteps?: PayrollApprovalStep[];
}

export interface PayrollLine {
  id?: string;
  employeeId: string;
  note?: string;
  grossPay?: number;
  netPay?: number;
  components: Array<{
    kind: "EARNING" | "DEDUCTION";
    label: string;
    amount: number;
  }>;
}

export interface PayrollApprovalStep {
  id: string;
  stepOrder: number;
  name?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: string;
  comment?: string;
  actedAt?: string;
}

export const payrollApi = {
  // Employees
  createEmployee: (payload: {
    fullName: string;
    email?: string;
    jobTitle?: string;
    bankName?: string;
    bankAccountNumber?: string;
    baseSalary: number;
    currency: string;
    companyId?: string;
  }) => apiRequest<PayrollEmployee>("/api/v1/tenant/payroll/employees", { method: "POST", body: payload }),
  listEmployees: (params?: { companyId?: string }) =>
    apiRequest<PayrollEmployee[]>("/api/v1/tenant/payroll/employees", { query: params }),
  getEmployee: (id: string) =>
    apiRequest<PayrollEmployee>(`/api/v1/tenant/payroll/employees/${id}`),
  updateEmployee: (id: string, payload: Partial<PayrollEmployee>) =>
    apiRequest<PayrollEmployee>(`/api/v1/tenant/payroll/employees/${id}`, { method: "PATCH", body: payload }),
  deactivateEmployee: (id: string) =>
    apiRequest<void>(`/api/v1/tenant/payroll/employees/${id}`, { method: "DELETE" }),

  // Approval chains
  getApprovalChain: (scope: "STAFF" | "COMPANY") =>
    apiRequest<PayrollApprovalChain>("/api/v1/tenant/payroll/approval-chains", { query: { scope } }),
  configureApprovalChain: (
    scope: "STAFF" | "COMPANY",
    steps: PayrollApprovalChain["steps"],
  ) =>
    apiRequest<PayrollApprovalChain>("/api/v1/tenant/payroll/approval-chains", {
      method: "PUT",
      body: { steps },
      query: { scope },
    }),

  // Runs
  createRun: (payload: {
    label?: string;
    periodStart: string;
    periodEnd: string;
    currency?: string;
    companyId?: string;
    payDate?: string;
  }) => apiRequest<PayrollRun>("/api/v1/tenant/payroll/runs", { method: "POST", body: payload }),
  listRuns: (params?: { companyId?: string; firmOnly?: boolean }) =>
    apiRequest<PayrollRun[]>("/api/v1/tenant/payroll/runs", { query: params }),
  pendingApproval: () =>
    apiRequest<PayrollRun[]>("/api/v1/tenant/payroll/runs/pending-approval"),
  getRun: (id: string) => apiRequest<PayrollRun>(`/api/v1/tenant/payroll/runs/${id}`),
  updateRun: (id: string, payload: { note?: string; payDate?: string }) =>
    apiRequest<PayrollRun>(`/api/v1/tenant/payroll/runs/${id}`, { method: "PATCH", body: payload }),
  replaceLines: (id: string, lines: PayrollLine[]) =>
    apiRequest<PayrollRun>(`/api/v1/tenant/payroll/runs/${id}/lines`, { method: "PUT", body: { lines } }),
  submit: (id: string) =>
    apiRequest<PayrollRun>(`/api/v1/tenant/payroll/runs/${id}/submit`, { method: "POST" }),
  approve: (id: string, comment?: string) =>
    apiRequest<PayrollRun>(`/api/v1/tenant/payroll/runs/${id}/approve`, { method: "POST", body: { comment } }),
  reject: (id: string, comment?: string) =>
    apiRequest<PayrollRun>(`/api/v1/tenant/payroll/runs/${id}/reject`, { method: "POST", body: { comment } }),
  reopen: (id: string, comment?: string) =>
    apiRequest<PayrollRun>(`/api/v1/tenant/payroll/runs/${id}/reopen`, { method: "POST", body: { comment } }),
  markPaid: (id: string) =>
    apiRequest<PayrollRun>(`/api/v1/tenant/payroll/runs/${id}/pay`, { method: "POST" }),
  bankFile: (id: string) =>
    apiRequest<Response>(`/api/v1/tenant/payroll/runs/${id}/bank-file`, { raw: true }),
  approvalHistory: (id: string) =>
    apiRequest<PayrollApprovalStep[]>(`/api/v1/tenant/payroll/runs/${id}/approvals`),
};

/* =========================================================
 * News
 * ========================================================= */

export interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  url: string;
  source?: string;
  publishedAt: string;
  category?: string;
  country?: string;
  imageUrl?: string;
}

export const newsApi = {
  feed: (params?: { category?: string; country?: string; q?: string; companyId?: string; page?: number; size?: number }) =>
    apiRequest<{ content: NewsArticle[]; totalElements: number; totalPages: number } | NewsArticle[]>(
      "/api/v1/news",
      { query: params as Record<string, string | number | undefined> },
    ),
  search: (params: { q: string; category?: string; country?: string; page?: number; size?: number }) =>
    apiRequest<{ content: NewsArticle[]; totalElements: number; totalPages: number } | NewsArticle[]>(
      "/api/v1/news/search",
      { query: params as Record<string, string | number | undefined> },
    ),
};
