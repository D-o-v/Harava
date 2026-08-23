"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/lib/toast";
import { ThemeProvider } from "@/lib/theme";
import { NavigationLoader } from "@/components/ui/navigation-loader";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <NavigationLoader />
          {children}
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
