"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-navy/[0.06] text-navy border border-navy/[0.08]",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
        warning: "bg-amber-50 text-amber-700 border border-amber-200/60",
        error: "bg-red-50 text-red-700 border border-red-200/60",
        info: "bg-blue-50 text-blue-700 border border-blue-200/60",
        gold: "bg-gold/[0.08] text-gold-dark border border-gold/[0.15]",
        navy: "bg-navy/[0.06] text-navy border border-navy/[0.1]",
        outline: "bg-transparent text-navy/70 border border-navy/[0.12]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] rounded-md",
        md: "px-2.5 py-1 text-[11px] rounded-lg",
        lg: "px-3 py-1.5 text-xs rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
