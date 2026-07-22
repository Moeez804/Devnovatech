"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface UseHorizontalScrollOptions {
  sectionRef: React.RefObject<HTMLElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  cardSelector: string; // e.g. ".project-card"
  onCardOpen: (cardEl: Element, index: number) => void;
  onCardClose: (cardEl: Element, index: number) => void;
  enabled: boolean; // pass false on mobile to skip pin-scroll entirely
}

/** Pins the section and translates the track horizontally as the user scrolls vertically, then fires per-card open/close triggers keyed to the same scrub via containerAnimation. */
export function useHorizontalScroll({
  sectionRef,
  trackRef,
  cardSelector,
  onCardOpen,
  onCardClose,
  enabled,
}: UseHorizontalScrollOptions) {
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!enabled || prefersReducedMotion() || !sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const scrollDistance = track.scrollWidth - window.innerWidth;
      if (scrollDistance <= 0) return;

      const horizontalTween = gsap.to(track, {
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

      const cards = track.querySelectorAll(cardSelector);
      cards.forEach((card, i) => {
        const st = ScrollTrigger.create({
          trigger: card,
          containerAnimation: horizontalTween,
          start: "left 65%",
          end: "right 35%",
          onEnter: () => onCardOpen(card, i),
          onLeave: () => onCardClose(card, i),
          onEnterBack: () => onCardOpen(card, i),
          onLeaveBack: () => onCardClose(card, i),
        });
        triggersRef.current.push(st);
      });
    }, sectionRef);

    return () => {
      triggersRef.current.forEach((st) => st.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, [sectionRef, trackRef, cardSelector, onCardOpen, onCardClose, enabled]);
}