import type { Variants } from "framer-motion";

/** Standard fade-up reveal, used across sections on scroll-into-view. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Staggered container for lists of cards/items. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** GSAP ease tokens kept centralized so every module references the same feel. */
export const EASE = {
  smooth: "power3.out",
  snappy: "power2.inOut",
  elastic: "elastic.out(1, 0.5)",
} as const;

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 1,
} as const;