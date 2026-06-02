"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: "bg-white border-emerald-200/60 text-navy shadow-(--shadow-lg)",
    error: "bg-white border-red-200/60 text-navy shadow-(--shadow-lg)",
    warning: "bg-white border-amber-200/60 text-navy shadow-(--shadow-lg)",
    info: "bg-white border-blue-200/60 text-navy shadow-(--shadow-lg)",
  };

  const iconColors = {
    success: "text-emerald-500",
    error: "text-red-500",
    warning: "text-amber-500",
    info: "text-blue-500",
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-100 space-y-2.5 max-w-sm">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-sm animate-slide-in-left",
                colors[t.type]
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", iconColors[t.type])} />
              <p className="text-[13px] flex-1 font-medium">{t.message}</p>
              <button onClick={() => removeToast(t.id)} className="shrink-0 text-navy/30 hover:text-navy/60 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
