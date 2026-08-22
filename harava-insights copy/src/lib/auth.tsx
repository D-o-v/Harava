"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

export type UserRole = "super_admin" | "accountant" | "consultant" | "learner" | "corporate_admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  products: string[];
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasAccess: (product: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded demo users with different roles
const DEMO_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "jay@harava.com",
    password: "admin123",
    user: {
      id: "1",
      email: "jay@harava.com",
      firstName: "Jay",
      lastName: "Jelenke",
      role: "super_admin",
      products: ["finsight", "accrediai", "proed", "admin"],
    },
  },
  {
    email: "accountant@demo.com",
    password: "demo123",
    user: {
      id: "2",
      email: "accountant@demo.com",
      firstName: "Mike",
      lastName: "Johnson",
      role: "accountant",
      products: ["finsight"],
    },
  },
  {
    email: "consultant@demo.com",
    password: "demo123",
    user: {
      id: "3",
      email: "consultant@demo.com",
      firstName: "Dr. Sarah",
      lastName: "Williams",
      role: "consultant",
      products: ["accrediai"],
    },
  },
  {
    email: "learner@demo.com",
    password: "demo123",
    user: {
      id: "4",
      email: "learner@demo.com",
      firstName: "Lisa",
      lastName: "Chen",
      role: "learner",
      products: ["proed"],
    },
  },
  {
    email: "corporate@demo.com",
    password: "demo123",
    user: {
      id: "5",
      email: "corporate@demo.com",
      firstName: "John",
      lastName: "Davis",
      role: "corporate_admin",
      products: ["proed", "finsight"],
    },
  },
];

// Role → product access mapping for display
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  accountant: "Accountant",
  consultant: "Consultant",
  learner: "Learner",
  corporate_admin: "Corporate Admin",
};

// Public routes that don't need auth
const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/auth/forgot-password"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("harava_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("harava_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Auth guard: redirect if not authenticated on protected routes
  useEffect(() => {
    if (isLoading) return;

    const isPublic = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith("/auth/")
    );

    if (!user && !isPublic) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, error: "Invalid email or password" };
    }

    setUser(found.user);
    localStorage.setItem("harava_user", JSON.stringify(found.user));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("harava_user");
    router.replace("/auth/login");
  };

  const hasAccess = (product: string) => {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    return user.products.includes(product);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
