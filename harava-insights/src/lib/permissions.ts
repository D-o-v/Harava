export const PERMISSIONS = {
  COMPANY_READ: "company.read",
  COMPANY_MANAGE: "company.manage",
  INSIGHTS_VIEW: "insights.view",
  QUICKBOOKS_READ: "quickbooks.read",
  QUICKBOOKS_MANAGE: "quickbooks.manage",
  STAFF_READ: "staff.read",
  STAFF_INVITE: "staff.invite",
  STAFF_MANAGE: "staff.manage",
  COMPANY_USER_READ: "company_user.read",
  COMPANY_USER_INVITE: "company_user.invite",
  COMPANY_USER_MANAGE: "company_user.manage",
  BROADCAST_SEND: "broadcast.send",
  AUDIT_VIEW: "audit.view",
  PAYROLL_READ: "payroll.read",
  PAYROLL_MANAGE: "payroll.manage",
  PAYROLL_APPROVE: "payroll.approve",
  PAYROLL_PAY: "payroll.pay",
  PAYROLL_CONFIG: "payroll.config",
  PORTAL_DASHBOARD_VIEW: "portal.dashboard.view",
  PORTAL_REPORTS_VIEW: "portal.reports.view",
  PORTAL_TRANSACTIONS_VIEW: "portal.transactions.view",
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export function hasPermission(perms: Set<string>, key: string) {
  return perms.has(key);
}
export function hasAny(perms: Set<string>, keys: string[]) {
  return keys.some((k) => perms.has(k));
}
export function hasAll(perms: Set<string>, keys: string[]) {
  return keys.every((k) => perms.has(k));
}
