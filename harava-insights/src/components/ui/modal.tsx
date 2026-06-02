"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, description, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm animate-fade-in"
        style={{ animationDuration: "200ms" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-[var(--shadow-2xl)] border border-navy/[0.06] animate-scale-in-bounce overflow-hidden",
          sizeClasses[size]
        )}
      >
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold via-gold-light to-gold opacity-80" />

        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && <h2 className="text-lg font-semibold text-navy tracking-tight">{title}</h2>}
                {description && <p className="text-sm text-navy/50 mt-1">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-navy/30 hover:text-navy/60 hover:bg-navy/[0.04] transition-all duration-200 -mt-1 -mr-1"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        )}

        {/* Close button if no header */}
        {!title && !description && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-navy/30 hover:text-navy/60 hover:bg-navy/[0.04] transition-all duration-200 z-10"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        )}

        {/* Content */}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
