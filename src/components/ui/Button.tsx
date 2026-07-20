"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { FiArrowRight } from "react-icons/fi";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  showArrow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", showArrow = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium",
          "transition-all duration-300 ease-out focus-visible:outline-none",
          variant === "primary" &&
            "bg-brand-gradient bg-[length:200%_100%] text-white hover:shadow-glow hover:bg-[position:100%_0]",
          variant === "ghost" &&
            "glass-panel text-text-primary hover:border-white/20",
          className
        )}
        {...props}
      >
        {children}
        {showArrow && <FiArrowRight className="text-base" aria-hidden="true" />}
      </button>
    );
  }
);

Button.displayName = "Button";