"use client";

import { useEffect, useRef } from "react";

interface Pointer {
  x: number; // normalized -1 to 1
  y: number;
}

/** Tracks normalized pointer position for parallax/tilt effects. Falls back to center on touch devices. */
export function useMouseParallax() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return pointer;
}