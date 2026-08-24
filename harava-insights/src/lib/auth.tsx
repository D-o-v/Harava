"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { tokens, type TokenScope, decodeJwt } from "@/lib/api/tokens";
import { accountApi, authApi, platformApi, portalApi, type LoginResponse, type UserProfile } from "@/lib/api/endpoints";
import { isPlatformHost, resolveTenant } from "@/lib/api/tenant-context";

export type UserRole = "super_admin" | "accountant" | "consultant" | "learner" | "corporate_admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  products: string[];
  scope: TokenScope;
  tenantId?: string;
  companyId?: string;
  mfaEnabled?: boolean;
  raw?: UserProfile;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  accountant: "Accountant",
  consultant: "Consultant",
  learner: "Learner",
  corporate_admin: "Corporate Admin",
};

export function defaultRouteForRole(role: string): string {
  const normalized = role.toLowerCase();
  if (normalized.includes("platform") || normalized.includes("owner") || normalized.includes("admin")) {
    return "/admin";
  }
  if (normalized.includes("client") || normalized.includes("portal")) {
    return "/portal";
  }
  return "/finsight";
}

function scopeFromSession(res: LoginResponse): TokenScope {
  if (res.scope === "PLATFORM") return "platform";
  // Company is the backend's canonical signal for a portal session.  Keep the
  // explicit scope check as a compatibility fallback for older API responses.
  if (res.scope === "CLIENT" || res.company || res.session?.company || res.user?.companyId || res.session?.user?.companyId) {
    return "portal";
  }
  return "staff";
}

type LoginResult =
  | { success: true; mfa?: false }
  | { success: true; mfa: true; mfaToken: string; mfaMethod?: string; channels?: string[] }
  | { success: false; error: string };

interface AuthContextType {
  user: User | null;
  permissions: Set<string>;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  verifyMfa: (mfaToken: string, code: string) => Promise<LoginResult>;
  finalizeFromLoginResponse: (res: LoginResponse, scope: TokenScope) => Promise<User | null>;
  logout: () => void;
  hasAccess: (product: string) => boolean;
  can: (permission: string) => boolean;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password", "/auth/accept", "/auth/verify", "/finsight/quickbooks/callback"];

function toUser(profile: UserProfile, scope: TokenScope): User {
  const rawRole = (profile.role || profile.roles?.[0] || "").toLowerCase();
  const allRoles = (profile.roles ?? (profile.role ? [profile.role] : [])).map(r => r.toLowerCase());
  const hasRole = (s: string) => allRoles.some(r => r.includes(s)) || rawRole.includes(s);
  let role: UserRole = "learner";
  let products: string[] = [];
  if (scope === "platform") {
    role = "super_admin";
    products = ["admin", "finsight", "accrediai", "proed"];
  } else if (scope === "portal") {
    role = "corporate_admin";
    products = ["finsight"];
  } else {
    if (hasRole("owner") || hasRole("super") || hasRole("platform")) role = "super_admin";
    else if (hasRole("admin")) role = "corporate_admin";
    else if (hasRole("consult")) role = "consultant";
    else if (hasRole("account")) role = "accountant";
    else role = "accountant";
    // Tenant staff always only get finsight — they are NOT platform admins
    products = ["finsight"];
  }
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    role,
    products,
    scope,
    tenantId: profile.tenantId,
    companyId: profile.companyId,
    mfaEnabled: profile.mfaEnabled,
    raw: profile,
  };
}

// Platform admin gets all permissions by default
const PLATFORM_PERMISSIONS = new Set([
  "company.read","company.manage","insights.view","quickbooks.read","quickbooks.manage",
  "staff.read","staff.invite","staff.manage","company_user.read","company_user.invite",
  "company_user.manage","broadcast.send","audit.view","payroll.read","payroll.manage",
  "payroll.approve","payroll.pay","payroll.config",
  "portal.dashboard.view","portal.reports.view","portal.transactions.view",
]);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadMeFor = useCallback(async (scope: TokenScope): Promise<User | null> => {
    try {
      if (scope === "platform") {
        const tok = tokens.get("platform");
        const payload = tok.access ? decodeJwt(tok.access) : null;
        const claim = (key: string) => typeof payload?.[key] === "string" ? payload[key] : "";
        const u: User = {
          id: claim("sub"),
          email: claim("email"),
          firstName: "Platform",
          lastName: "Admin",
          role: "super_admin",
          products: ["admin", "finsight", "accrediai", "proed"],
          scope: "platform",
        };
        setUser(u);
        setPermissions(PLATFORM_PERMISSIONS);
        return u;
      }
      let profile: UserProfile;
      if (scope === "portal") profile = await portalApi.me();
      else profile = await accountApi.me();
      const u = toUser(profile, scope);
      setUser(u);
      // Fetch permissions from server
      try {
        const permsData = await accountApi.permissions();
        setPermissions(new Set(permsData.permissions ?? []));
      } catch {
        setPermissions(new Set());
      }
      return u;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      const active = tokens.getActive();
      if (active && tokens.get(active).access) {
        tokens.setActive(active);
        await loadMeFor(active);
      }
      setIsLoading(false);
    })();
  }, [loadMeFor]);

  useEffect(() => {
    if (isLoading) return;
    const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
    if (!user && !isPublic) router.replace("/auth/login");
  }, [user, isLoading, pathname, router]);

  const finalizeFromLoginResponse = useCallback(
    async (res: LoginResponse, scope: TokenScope): Promise<User | null> => {
      const accessToken = res.accessToken ?? res.tokens?.accessToken ?? res.session?.tokens?.accessToken;
      const refreshToken = res.refreshToken ?? res.tokens?.refreshToken ?? res.session?.tokens?.refreshToken ?? null;
      if (!accessToken) return null;
      tokens.set(scope, accessToken, refreshToken);
      tokens.setActive(scope);
      // Extract permissions from login response if present
      const permsFromResponse = res.permissions ?? res.session?.permissions;
      if (permsFromResponse) setPermissions(new Set(permsFromResponse));
      const profileFromResponse = res.user ?? res.session?.user;
      if (profileFromResponse) {
        const u = toUser(profileFromResponse, scope);
        setUser(u);
        // If no permissions in response, fetch them
        if (!permsFromResponse && scope !== "platform") {
          try {
            const permsData = await accountApi.permissions();
            setPermissions(new Set(permsData.permissions ?? []));
          } catch { /* ignore */ }
        }
        if (scope === "platform") setPermissions(PLATFORM_PERMISSIONS);
        return u;
      }
      return loadMeFor(scope);
    },
    [loadMeFor],
  );

  const login = useCallback<AuthContextType["login"]>(
    async (email, password) => {
      try {
        const platform = isPlatformHost();
        if (!platform) {
          const resolved = await resolveTenant();
          if (!resolved) return { success: false, error: "Unknown workspace subdomain" };
        }
        const res = platform
          ? await platformApi.login(email, password)
          : await authApi.login(email, password);
        if (res.mfaRequired && res.mfaToken) {
          return { success: true, mfa: true, mfaToken: res.mfaToken, mfaMethod: res.mfaMethod, channels: res.mfaChannels };
        }
        const scope: TokenScope = platform ? "platform" : scopeFromSession(res);
        const u = await finalizeFromLoginResponse(res, scope);
        if (!u) return { success: false, error: "Session could not be loaded" };
        return { success: true };
      } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : "Login failed" };
      }
    },
    [finalizeFromLoginResponse],
  );

  const verifyMfa = useCallback<AuthContextType["verifyMfa"]>(
    async (mfaToken, code) => {
      try {
        const res = await authApi.mfaVerify(mfaToken, code);
        const scope = scopeFromSession(res);
        const u = await finalizeFromLoginResponse(res, scope);
        if (!u) return { success: false, error: "Session could not be loaded" };
        return { success: true };
      } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : "Invalid code" };
      }
    },
    [finalizeFromLoginResponse],
  );

  const logout = useCallback(() => {
    const active = tokens.getActive();
    (async () => {
      try {
        if (active === "platform") await platformApi.logout();
        else if (active) await authApi.logout();
      } catch { /* ignore */ }
    })();
    tokens.clearAll();
    setUser(null);
    setPermissions(new Set());
    router.replace("/auth/login");
  }, [router]);

  const hasAccess = (product: string) => {
    if (!user) return false;
    // Platform admin sees all products
    if (user.scope === "platform") return true;
    // Tenant staff only see finsight
    return user.products.includes(product);
  };

  const can = (permission: string) => {
    if (!user) return false;
    if (user.scope === "platform") return true;
    return permissions.has(permission);
  };

  const refreshMe = useCallback(async () => {
    const active = tokens.getActive();
    if (active) await loadMeFor(active);
  }, [loadMeFor]);

  return (
    <AuthContext.Provider value={{ user, permissions, isLoading, login, verifyMfa, finalizeFromLoginResponse, logout, hasAccess, can, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
