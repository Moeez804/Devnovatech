"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type * as THREE from "three";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface UseScrollCameraOptions {
  triggerRef: React.RefObject<HTMLElement | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
}

/** Scrubs the R3F camera through a fly-through path as the pinned section scrolls, driven by GSAP ScrollTrigger. */
export function useScrollCamera({ triggerRef, cameraRef }: UseScrollCameraOptions) {
  const progress = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion() || !triggerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "+=200%",
      scrub: 0.8,
      pin: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    return () => st.kill();
  }, [triggerRef, cameraRef]);

  return progress;
}