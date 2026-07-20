"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface UseHorizontalScrollOptions {
  sectionRef: React.RefObject<HTMLElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  cardSelector: string;
  enabled: boolean;
}

export function useHorizontalScroll({
  sectionRef,
  trackRef,
  enabled,
}: UseHorizontalScrollOptions) {
  useEffect(() => {
    if (
      !enabled ||
      prefersReducedMotion() ||
      !sectionRef.current ||
      !trackRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const scrollDistance = track.scrollWidth - window.innerWidth;

      if (scrollDistance <= 0) return;

      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      ctx.revert();
    };
  }, [sectionRef, trackRef, enabled]);
}