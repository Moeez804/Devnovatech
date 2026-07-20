"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";

interface UseCountUpOptions {
  end: number;
  duration?: number; // seconds
  once?: boolean;
}

/** Animates a number from 0 to `end` when the bound ref scrolls into view. Uses requestAnimationFrame with an ease-out curve, not setInterval, for smooth 60fps counting. */
export function useCountUp({ end, duration = 1.8, once = true }: UseCountUpOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isInView || (once && hasRun.current)) return;

    if (prefersReducedMotion()) {
      setValue(end);
      hasRun.current = true;
      return;
    }

    hasRun.current = true;
    let rafId: number;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setValue(Math.round(eased * end));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, end, duration, once]);

  return { ref, value };
}