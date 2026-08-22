// Public API for the integration layer
export { api } from "./client";
export { apiConfig } from "./config";
export * from "./types";
export * from "./auth";
export * from "./services";
export * from "./platform";
export {
  authApi,
  platformApi,
  accountApi,
  staffApi,
  mfaApi,
  companiesApi,
  quickbooksApi,
  dashboardApi,
  portalApi,
  referenceApi,
  notificationsApi,
  newsApi,
  rolesApi,
  platformGodApi,
  payrollApi,
} from "./endpoints";
export type {
  Role,
  PlatformUser,
  PlatformAdmin,
  PayrollEmployee,
  PayrollApprovalChain,
  PayrollRun,
  PayrollLine,
  PayrollApprovalStep,
  PayrollRunStatus,
} from "./endpoints";
export {
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getTenantId,
  setTenantId,
  isPlatformAdmin,
  getTokenRoles,
  getTokenPayload,
} from "./token-store";
export { createDpopProof, clearKeyPair } from "./dpop";
