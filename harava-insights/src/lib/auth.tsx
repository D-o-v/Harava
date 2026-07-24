"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { tokens, type TokenScope } from "@/lib/api/tokens";
import { accountApi, authApi, platformApi, portalApi, type LoginResponse, type UserProfile } from "@/lib/api/endpoints";

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

type LoginResult =
  | { success: true; mfa?: false }
  | { success: true; mfa: true; mfaToken: string; channels?: string[] }
  | { success: false; error: string };

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, opts?: { scope?: "auto" | "platform" }) => Promise<LoginResult>;
  verifyMfa: (mfaToken: string, code: string) => Promise<LoginResult>;
  finalizeFromLoginResponse: (res: LoginResponse, scope: TokenScope) => Promise<User | null>;
  logout: () => void;
  hasAccess: (product: string) => boolean;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password", "/auth/accept", "/auth/verify"];

function toUser(profile: UserProfile, scope: TokenScope): User {
  const rawRole = (profile.role || "").toLowerCase();
  let role: UserRole = "learner";
  let products: string[] = [];
  if (scope === "platform") {
    role = "super_admin";
    products = ["admin", "finsight", "accrediai", "proed"];
  } else if (scope === "portal") {
    role = "corporate_admin";
    products = ["finsight"];
  } else {
    if (rawRole.includes("owner") || rawRole.includes("super")) role = "super_admin";
    else if (rawRole.includes("admin")) role = "corporate_admin";
    else if (rawRole.includes("consult")) role = "consultant";
    else if (rawRole.includes("account")) role = "accountant";
    else role = "accountant";
    products = ["finsight"];
    if (role === "super_admin") products = ["admin", "finsight", "accrediai", "proed"];
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadMeFor = useCallback(async (scope: TokenScope): Promise<User | null> => {
    try {
      let profile: UserProfile;
      if (scope === "portal") profile = await portalApi.me();
      else profile = await accountApi.me();
      const u = toUser(profile, scope);
      setUser(u);
      return u;
    } catch {
      return null;
    }
  }, []);

  // Bootstrap from any stored active scope.
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

  // Auth guard.
  useEffect(() => {
    if (isLoading) return;
    const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
    if (!user && !isPublic) router.replace("/auth/login");
  }, [user, isLoading, pathname, router]);

  const finalizeFromLoginResponse = useCallback(
    async (res: LoginResponse, scope: TokenScope): Promise<User | null> => {
      if (!res.accessToken) return null;
      tokens.set(scope, res.accessToken, res.refreshToken ?? null);
      tokens.setActive(scope);
      return loadMeFor(scope);
    },
    [loadMeFor],
  );

  const login = useCallback<AuthContextType["login"]>(
    async (email, password, opts = {}) => {
      try {
        const scopeChoice = opts.scope ?? "auto";
        const res =
          scopeChoice === "platform"
            ? await platformApi.login(email, password)
            : await authApi.login(email, password);
        if (res.mfaRequired && res.mfaToken) {
          return { success: true, mfa: true, mfaToken: res.mfaToken, channels: res.mfaChannels };
        }
        const scope: TokenScope =
          scopeChoice === "platform"
            ? "platform"
            : res.scope === "PLATFORM"
              ? "platform"
              : res.scope === "CLIENT"
                ? "portal"
                : "staff";
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
        const scope: TokenScope =
          res.scope === "PLATFORM" ? "platform" : res.scope === "CLIENT" ? "portal" : "staff";
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
      } catch {
        // ignore
      }
    })();
    tokens.clearAll();
    setUser(null);
    router.replace("/auth/login");
  }, [router]);

  const hasAccess = (product: string) => {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    return user.products.includes(product);
  };

  const refreshMe = useCallback(async () => {
    const active = tokens.getActive();
    if (active) await loadMeFor(active);
  }, [loadMeFor]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, verifyMfa, finalizeFromLoginResponse, logout, hasAccess, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
