"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingBadgeProps {
  label: string;
  className?: string; // positions the badge absolutely within the hero
  delay?: number;
  floatDuration?: number;
}

/** A glass-pill label that drifts gently — used for AI / SECURITY / WEB / CLOUD / MOBILE tags around the logo. */
export function FloatingBadge({
  label,
  className,
  delay = 0,
  floatDuration = 4,
}: FloatingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: {
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
      className={cn(
        "glass-panel absolute rounded-xl px-3.5 py-2 text-xs font-medium tracking-wide text-text-primary shadow-glow-sm",
        className
      )}
    >
      {label}
    </motion.div>
  );
}