"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { companiesApi } from "@/lib/api/endpoints";
import { tokens } from "@/lib/api/tokens";

interface CompanyContextType {
  selectedCompanyId: string | null;
  selectedCompanyName: string | null;
  selectedCompanyQuickbooksConnected: boolean | null;
  setSelectedCompanyId: (id: string | null, name?: string, quickbooksConnected?: boolean) => void;
}

const CompanyContext = createContext<CompanyContextType>({
  selectedCompanyId: null,
  selectedCompanyName: null,
  selectedCompanyQuickbooksConnected: null,
  setSelectedCompanyId: () => {},
});

const STORAGE_KEY = "harava_selected_company";
const STORAGE_NAME_KEY = "harava_selected_company_name";
const STORAGE_QB_KEY = "harava_selected_company_quickbooks_connected";

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selectedCompanyId, setSelectedCompanyIdState] = useState<string | null>(null);
  const [selectedCompanyName, setSelectedCompanyNameState] = useState<string | null>(null);
  const [selectedCompanyQuickbooksConnected, setSelectedCompanyQuickbooksConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const storedName = sessionStorage.getItem(STORAGE_NAME_KEY);
    const storedQuickbooksConnected = sessionStorage.getItem(STORAGE_QB_KEY);
    if (stored) {
      setSelectedCompanyIdState(stored);
      setSelectedCompanyNameState(storedName);
      setSelectedCompanyQuickbooksConnected(storedQuickbooksConnected === null ? null : storedQuickbooksConnected === "true");
      return;
    }
    // Tenant workspaces always need an active company for financial pages.
    // Prefer an active QuickBooks-connected company, then the first active one.
    const active = tokens.getActive();
    if (active === "staff") {
      companiesApi.list().then((list) => {
        const company = list.find((item) => item.status?.toUpperCase() === "ACTIVE" && item.quickbooksConnected)
          ?? list.find((item) => item.status?.toUpperCase() === "ACTIVE")
          ?? list[0];
        if (company) {
          setSelectedCompanyIdState(company.id);
          setSelectedCompanyNameState(company.name);
          setSelectedCompanyQuickbooksConnected(Boolean(company.quickbooksConnected));
          sessionStorage.setItem(STORAGE_KEY, company.id);
          sessionStorage.setItem(STORAGE_NAME_KEY, company.name);
          sessionStorage.setItem(STORAGE_QB_KEY, String(Boolean(company.quickbooksConnected)));
        }
      }).catch(() => {});
    }
  }, []);

  // The company catalogue is the source of truth for the connection badge.
  // Refresh it after restoring a selection so old session values cannot make
  // product pages disagree with the Clients screen.
  useEffect(() => {
    if (!selectedCompanyId) return;

    companiesApi.list().then((companies) => {
      const company = companies.find((item) => item.id === selectedCompanyId);
      if (!company) return;

      setSelectedCompanyNameState(company.name);
      setSelectedCompanyQuickbooksConnected(Boolean(company.quickbooksConnected));
      sessionStorage.setItem(STORAGE_NAME_KEY, company.name);
      sessionStorage.setItem(STORAGE_QB_KEY, String(Boolean(company.quickbooksConnected)));
    }).catch(() => {});
  }, [selectedCompanyId]);

  const setSelectedCompanyId = (id: string | null, name?: string, quickbooksConnected?: boolean) => {
    setSelectedCompanyIdState(id);
    setSelectedCompanyNameState(name ?? null);
    setSelectedCompanyQuickbooksConnected(id ? (quickbooksConnected ?? null) : null);
    if (id) {
      sessionStorage.setItem(STORAGE_KEY, id);
      if (name) sessionStorage.setItem(STORAGE_NAME_KEY, name);
      if (quickbooksConnected !== undefined) sessionStorage.setItem(STORAGE_QB_KEY, String(quickbooksConnected));
      else sessionStorage.removeItem(STORAGE_QB_KEY);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_NAME_KEY);
      sessionStorage.removeItem(STORAGE_QB_KEY);
    }
  };

  return (
    <CompanyContext.Provider value={{ selectedCompanyId, selectedCompanyName, selectedCompanyQuickbooksConnected, setSelectedCompanyId }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyContext() {
  return useContext(CompanyContext);
}
