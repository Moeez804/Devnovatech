"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  compact?: boolean; // true = mark only, no wordmark (used when navbar shrinks)
}

/** Reusable DN hexagon mark + wordmark. Pure SVG so it scales crisply at any size. */
export function Logo({ className, compact = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="dn-grad" x1="0" y1="0" x2="34" y2="34">
            <stop offset="0%" stopColor="#6C4CF1" />
            <stop offset="100%" stopColor="#3B7CF6" />
          </linearGradient>
        </defs>
        <path
          d="M17 1L31 9V25L17 33L3 25V9L17 1Z"
          stroke="url(#dn-grad)"
          strokeWidth="1.5"
          fill="rgba(108,76,241,0.08)"
        />
        <text
          x="17"
          y="21.5"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="url(#dn-grad)"
          fontFamily="var(--font-display)"
        >
          DN
        </text>
      </svg>

      {!compact && (
        <span className="font-display font-semibold leading-none tracking-tight text-text-primary">
          <span className="block text-[15px]">DEVNOVA</span>
          <span className="block text-[10px] tracking-[0.25em] text-text-muted">
            TECH
          </span>
        </span>
      )}
    </div>
  );
}