"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-navy text-white rounded-xl hover:bg-navy-light shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-[0.97] hover:-translate-y-[1px]",
        primary:
          "bg-gradient-to-r from-gold to-gold-light text-navy font-semibold rounded-xl hover:shadow-[0_8px_24px_-4px_rgba(193,155,63,0.35)] active:scale-[0.97] hover:-translate-y-[1px]",
        secondary:
          "bg-navy/[0.04] text-navy rounded-xl hover:bg-navy/[0.08] border border-navy/[0.08] hover:border-navy/[0.12] active:scale-[0.97]",
        outline:
          "border-[1.5px] border-navy/[0.12] bg-white text-navy rounded-xl hover:bg-navy/[0.03] hover:border-navy/[0.2] active:scale-[0.97]",
        ghost:
          "text-navy/60 rounded-xl hover:bg-navy/[0.04] hover:text-navy active:scale-[0.97]",
        destructive:
          "bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-[var(--shadow-sm)] active:scale-[0.97]",
        gold:
          "bg-gold text-navy font-semibold rounded-xl hover:bg-gold-light shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow-gold)] active:scale-[0.97] hover:-translate-y-[1px]",
      },
      size: {
        xs: "h-7 px-2.5 text-[11px] rounded-lg",
        sm: "h-8 px-3.5 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-[15px]",
        xl: "h-14 px-9 text-base",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
