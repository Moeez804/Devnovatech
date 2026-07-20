"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/utils";

interface UseAutoSliderOptions {
  itemCount: number;
  interval?: number; // ms between auto-advances
}

/** Auto-advancing index with pause-on-hover/interaction and manual controls. Timer is a plain setTimeout loop (not setInterval) so pausing never causes a burst of missed-tick catch-up. */
export function useAutoSlider({ itemCount, interval = 5000 }: UseAutoSliderOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const paused = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    if (prefersReducedMotion()) return;

    timeoutRef.current = setTimeout(() => {
      if (!paused.current) {
        setActiveIndex((prev) => (prev + 1) % itemCount);
      }
      scheduleNext();
    }, interval);
  }, [clearTimer, interval, itemCount]);

  useEffect(() => {
    scheduleNext();
    return clearTimer;
  }, [scheduleNext, clearTimer]);

  function goTo(index: number) {
    setActiveIndex(((index % itemCount) + itemCount) % itemCount);
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function prev() {
    goTo(activeIndex - 1);
  }

  function setPaused(value: boolean) {
    paused.current = value;
  }

  return { activeIndex, goTo, next, prev, setPaused };
}