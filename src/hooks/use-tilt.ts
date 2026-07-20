"use client";

import { useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/utils";

interface UseTiltOptions {
  max?: number; // max tilt in degrees
  scale?: number; // hover scale
}

/** GSAP-driven 3D tilt-on-hover for a card. Returns handlers to spread onto the card element. */
export function useTilt({ max = 8, scale = 1.02 }: UseTiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion() || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 - 1
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * max * 2;
    const rotateX = (0.5 - y) * max * 2;

    gsap.to(ref.current, {
      rotateX,
      rotateY,
      scale,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 600,
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 1,
        x: (x - 0.5) * 40,
        y: (y - 0.5) * 40,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }

  function onMouseLeave() {
    if (!ref.current) return;

    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.6)",
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
    }
  }

  return { ref, glowRef, onMouseMove, onMouseLeave };
}