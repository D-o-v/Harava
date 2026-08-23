"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface TenantAdminContextType {
  activeTenantId: string | null;
  activeTenantName: string | null;
  isExiting: boolean;
  isReady: boolean;
  enterTenant: (id: string, name: string) => void;
  exitTenant: () => void;
}

const TenantAdminContext = createContext<TenantAdminContextType>({
  activeTenantId: null,
  activeTenantName: null,
  isExiting: false,
  isReady: false,
  enterTenant: () => {},
  exitTenant: () => {},
});

export function TenantAdminProvider({ children }: { children: ReactNode }) {
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);
  const [activeTenantName, setActiveTenantName] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const saved = window.sessionStorage.getItem("harava-active-tenant");
      if (saved) {
        try {
          const tenant = JSON.parse(saved) as { id?: string; name?: string };
          if (tenant.id && tenant.name) {
            setActiveTenantId(tenant.id);
            setActiveTenantName(tenant.name);
          }
        } catch {
          window.sessionStorage.removeItem("harava-active-tenant");
        }
      }
      setIsReady(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  const enterTenant = (id: string, name: string) => {
    setActiveTenantId(id);
    setActiveTenantName(name);
    window.sessionStorage.setItem("harava-active-tenant", JSON.stringify({ id, name }));
  };

  const exitTenant = () => {
    setIsExiting(true);
    setTimeout(() => {
      setActiveTenantId(null);
      setActiveTenantName(null);
      window.sessionStorage.removeItem("harava-active-tenant");
      setIsExiting(false);
    }, 900);
  };

  return (
    <TenantAdminContext.Provider value={{ activeTenantId, activeTenantName, isExiting, isReady, enterTenant, exitTenant }}>
      {children}
    </TenantAdminContext.Provider>
  );
}

export function useTenantAdmin() {
  return useContext(TenantAdminContext);
}
