"use client";

import { useEffect, useState, useRef } from "react";

/** Tracks whether the page has scrolled past `threshold`, rAF-throttled to avoid layout thrash. */
export function useScrollShrink(threshold = 60) {
  const [shrunk, setShrunk] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        setShrunk(window.scrollY > threshold);
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return shrunk;
}