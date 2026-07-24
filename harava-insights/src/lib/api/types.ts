// ─── API envelope ───────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export interface LoginResponse {
  mfaRequired: boolean;
  mfaMethod: "TOTP" | "EMAIL" | "SMS" | null;
  mfaToken: string | null;
  tokens: Tokens | null;
}

export interface MfaVerifyResponse {
  tokens: Tokens;
}

// ─── User / Account ────────────────────────────────────────────────────────

export type UserRole = "OWNER" | "ADMIN" | "MEMBER" | "CLIENT" | "PLATFORM_ADMIN";

export interface UserResponse {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  emailVerified: boolean;
  mfaEnabled: boolean;
  mfaMethod: "TOTP" | "EMAIL" | "SMS" | null;
}

// ─── Invitations ───────────────────────────────────────────────────────────

export interface InvitationPreview {
  organizationName: string;
  role: string;
  email: string;
}

export interface InvitationResponse {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface AcceptInviteResponse extends Tokens {}

// ─── Companies ─────────────────────────────────────────────────────────────

export interface CompanyResponse {
  id: string;
  name: string;
  externalRef: string | null;
  status: "ACTIVE" | "SUSPENDED";
  quickbooksConnected: boolean;
  userCount: number;
  createdAt: string;
}

export interface CompanyUserResponse {
  id: string;
  email: string;
  fullName: string;
  enabled: boolean;
  lastLoginAt: string | null;
}

// ─── Insights ──────────────────────────────────────────────────────────────

export interface InsightSummaryResponse {
  companyId: string;
  companyName: string;
  currency: string;
  asOf: string;
  cashPosition: number;
  incomeThisMonth: number;
  expensesThisMonth: number;
  netProfitThisMonth: number;
  source: "QUICKBOOKS" | "PLACEHOLDER";
}

export interface CashflowPoint {
  period: string;
  inflow: number;
  outflow: number;
  net: number;
}

export interface CashflowResponse {
  companyId: string;
  currency: string;
  source: "QUICKBOOKS" | "PLACEHOLDER";
  points: CashflowPoint[];
}

export interface PnlPoint {
  period: string;
  revenue: number;
  costs: number;
  net: number;
}

export interface PnlResponse {
  companyId: string;
  currency: string;
  source: "QUICKBOOKS" | "PLACEHOLDER";
  points: PnlPoint[];
}

export interface ReportSummaryResponse {
  key: string;
  title: string;
  period: string;
  available: boolean;
}

// ─── QuickBooks ────────────────────────────────────────────────────────────

export interface ConnectionResponse {
  companyId: string;
  status: "CONNECTED" | "DISCONNECTED";
  realmId: string | null;
  connectedAt: string | null;
  lastSyncedAt: string | null;
}

// ─── Client Portal ─────────────────────────────────────────────────────────

export interface PortalProfileResponse {
  userId: string;
  email: string;
  fullName: string;
  companyId: string;
  companyName: string;
  firmName: string;
  currency: string;
}

// ─── Audit ─────────────────────────────────────────────────────────────────

export interface AuditEvent {
  id: string;
  eventType: string;
  outcome: "SUCCESS" | "FAILURE";
  actorUserId: string;
  actorEmail: string;
  ipAddress: string;
  description: string;
  occurredAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ─── MFA Setup ─────────────────────────────────────────────────────────────

export interface TotpSetupResponse {
  secret: string;
  otpauthUri: string;
  qrCodeDataUri: string;
}

// ─── API Error class ───────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  code: string;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    code: string,
    fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}
