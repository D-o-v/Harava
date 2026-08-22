"use client";

import { Button } from "./button";

export function PageLoader({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 select-none">
      {/* Spinner ring */}
      <div className="relative w-16 h-16">
        {/* Outer track */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-navy/8"
          />
          <circle
            cx="32" cy="32" r="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="40 124"
            className="text-gold animate-[spin_1.1s_linear_infinite]"
            style={{ transformOrigin: "32px 32px" }}
          />
        </svg>
        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-navy/20 animate-pulse" />
        </div>
      </div>

      <p className="text-[13px] font-medium text-navy/40 tracking-wide">{message}</p>
    </div>
  );
}

export function PageError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 select-none">
      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <div className="text-center space-y-1">
        <p className="text-[13px] font-semibold text-navy/70">Something went wrong</p>
        <p className="text-[12px] text-red-500 max-w-xs text-center leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>
      )}
    </div>
  );
}
