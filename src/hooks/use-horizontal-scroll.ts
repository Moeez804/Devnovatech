"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface UseHorizontalScrollOptions {
  sectionRef: React.RefObject<HTMLElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  cardSelector: string;
  onCardOpen: (cardEl: Element, index: number) => void;
  onCardClose: (cardEl: Element, index: number) => void;
  enabled: boolean;
}

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
        // Entrance: card fades/scales in smoothly as it approaches center, driven by scrub (not a hard trigger)
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.92, y: 24 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "left 85%",
              end: "left 50%",
              scrub: true,
            },
          }
        );

        // Exit: fades/scales out as the card leaves center toward the left
        gsap.fromTo(
          card,
          { opacity: 1, scale: 1 },
          {
            opacity: 0,
            scale: 0.92,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: "right 50%",
              end: "right 15%",
              scrub: true,
            },
          }
        );

        // Open/close trigger: narrowed to "left 52% / right 48%" — the card must be
        // almost fully centered/visible before the laptop starts opening, and closes
        // as soon as it starts leaving center (not at the wide 65%/35% margins used before)
        const st = ScrollTrigger.create({
          trigger: card,
          containerAnimation: horizontalTween,
          start: "left 52%",
          end: "right 48%",
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