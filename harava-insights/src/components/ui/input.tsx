"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-navy/75 tracking-[-0.01em]">
            {label}
          </label>
        )}
        <input
          id={id}
          className={cn(
            "flex h-11 w-full rounded-xl border-[1.5px] border-navy/8 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/30 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "focus:border-gold focus:outline-none focus:ring-[3px] focus:ring-gold/8 focus:bg-white",
            "hover:border-navy/15 hover:bg-white",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-navy/2",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          ref={ref}
          {...props}
        />
        {hint && !error && <p className="text-[11px] text-navy/40 mt-1">{hint}</p>}
        {error && <p className="text-[11px] text-red-600 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
