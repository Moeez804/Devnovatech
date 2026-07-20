"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  className?: string;
  divider?: boolean; // renders a vertical divider after this card (desktop only)
}

export function StatCard({
  value,
  suffix = "",
  label,
  duration = 1.8,
  className,
  divider = true,
}: StatCardProps) {
  const { ref, value: animatedValue } = useCountUp({ end: value, duration });

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-1 flex-col items-center gap-1 px-6 py-4 text-center sm:items-start sm:text-left",
        divider &&
          "after:absolute after:right-0 after:top-1/2 after:hidden after:h-10 after:w-px after:-translate-y-1/2 after:bg-white/10 sm:after:block",
        className
      )}
    >
      <span
        className="font-display text-3xl font-semibold text-text-primary md:text-4xl"
        aria-live="off"
      >
        {animatedValue}
        {suffix}
      </span>
      <span className="text-xs uppercase tracking-wider text-text-muted">
        {label}
      </span>
    </div>
  );
}