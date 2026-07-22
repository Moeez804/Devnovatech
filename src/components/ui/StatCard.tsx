"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";

interface StatCardProps {
  icon: IconType;
  accentColor: string;
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  className?: string;
  divider?: boolean;
}

export function StatCard({
  icon: Icon,
  accentColor,
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
        "relative flex flex-1 items-center gap-3 px-6 py-5",
        divider &&
          "after:absolute after:right-0 after:top-1/2 after:hidden after:h-8 after:w-px after:-translate-y-1/2 after:bg-white/10 sm:after:block",
        className
      )}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{
          background: `${accentColor}1A`,
          boxShadow: `0 0 16px ${accentColor}40`,
        }}
      >
        <Icon className="text-lg" style={{ color: accentColor }} aria-hidden="true" />
      </div>

      <div className="flex flex-col">
        <span className="font-display text-xl font-bold leading-none text-text-primary md:text-2xl">
          {animatedValue}
          {suffix}
        </span>
        <span className="mt-1 text-[11px] text-text-muted">{label}</span>
      </div>
    </div>
  );
}