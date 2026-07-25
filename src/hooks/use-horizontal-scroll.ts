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
// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { prefersReducedMotion } from "@/lib/utils";

// gsap.registerPlugin(ScrollTrigger);

// interface UseHorizontalScrollOptions {
//   sectionRef: React.RefObject<HTMLElement | null>;
//   trackRef: React.RefObject<HTMLDivElement | null>;
//   cardSelector: string;
//   onCardOpen: (cardEl: Element, index: number) => void;
//   onCardClose: (cardEl: Element, index: number) => void;
//   enabled: boolean;
// }

// export function useHorizontalScroll({
//   sectionRef,
//   trackRef,
//   cardSelector,
//   onCardOpen,
//   onCardClose,
//   enabled,
// }: UseHorizontalScrollOptions) {
//   const triggersRef = useRef<ScrollTrigger[]>([]);
//   const cardStatesRef = useRef<Map<Element, { 
//     isOpen: boolean; 
//     timeout: NodeJS.Timeout | null;
//   }>>(new Map());

//   useEffect(() => {
//     if (!enabled || prefersReducedMotion() || !sectionRef.current || !trackRef.current) return;

//     const ctx = gsap.context(() => {
//       const track = trackRef.current!;
//       const scrollDistance = track.scrollWidth - window.innerWidth;
//       if (scrollDistance <= 0) return;

//       const horizontalTween = gsap.to(track, {
//         x: -scrollDistance,
//         ease: "none",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top top",
//           end: () => `+=${scrollDistance}`,
//           scrub: 1,
//           pin: true,
//           invalidateOnRefresh: true,
//         },
//       });

//       const cards = track.querySelectorAll(cardSelector);
//       cards.forEach((card, i) => {
//         cardStatesRef.current.set(card, { isOpen: false, timeout: null });

//         // Entrance animation
//         gsap.fromTo(
//           card,
//           { opacity: 0, scale: 0.92, y: 24 },
//           {
//             opacity: 1,
//             scale: 1,
//             y: 0,
//             ease: "none",
//             scrollTrigger: {
//               trigger: card,
//               containerAnimation: horizontalTween,
//               start: "left 85%",
//               end: "left 50%",
//               scrub: true,
//             },
//           }
//         );

//         // Exit animation
//         gsap.fromTo(
//           card,
//           { opacity: 1, scale: 1 },
//           {
//             opacity: 0,
//             scale: 0.92,
//             ease: "none",
//             scrollTrigger: {
//               trigger: card,
//               containerAnimation: horizontalTween,
//               start: "right 50%",
//               end: "right 15%",
//               scrub: true,
//             },
//           }
//         );

//         // Simple debounced handlers
//         const handleOpen = () => {
//           const state = cardStatesRef.current.get(card);
//           if (!state) return;
          
//           if (state.timeout) {
//             clearTimeout(state.timeout);
//             state.timeout = null;
//           }
          
//           if (!state.isOpen) {
//             state.isOpen = true;
//             console.log(`[Card ${i}] Opening`);
//             onCardOpen(card, i);
//           }
//         };

//         const handleClose = () => {
//           const state = cardStatesRef.current.get(card);
//           if (!state || !state.isOpen) return;
          
//           if (state.timeout) {
//             clearTimeout(state.timeout);
//           }
          
//           state.timeout = setTimeout(() => {
//             const currentState = cardStatesRef.current.get(card);
//             if (currentState?.isOpen) {
//               currentState.isOpen = false;
//               console.log(`[Card ${i}] Closing`);
//               onCardClose(card, i);
//             }
//             state.timeout = null;
//           }, 200);
//         };

//         const st = ScrollTrigger.create({
//           trigger: card,
//           containerAnimation: horizontalTween,
//           start: "left 52%",
//           end: "right 48%",
//           onEnter: handleOpen,
//           onLeave: handleClose,
//           onEnterBack: handleOpen,
//           onLeaveBack: handleClose,
//         });
//         triggersRef.current.push(st);
//       });
//     }, sectionRef);

//     return () => {
//       cardStatesRef.current.forEach((state) => {
//         if (state.timeout) clearTimeout(state.timeout);
//       });
//       cardStatesRef.current.clear();
//       triggersRef.current.forEach((st) => st.kill());
//       triggersRef.current = [];
//       ctx.revert();
//     };
//   }, [sectionRef, trackRef, cardSelector, onCardOpen, onCardClose, enabled]);
// }