"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FloatingBadge } from "@/components/ui/FloatingBadge";
import { fadeUp, staggerContainer } from "@/styles/animations";
import { prefersReducedMotion } from "@/lib/utils";
import { FiPlay, FiArrowDown } from "react-icons/fi";
import Image from "next/image";

// 3D scene is client-only and heavy — load it without SSR, no layout shift since it's absolutely positioned.
const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Fade + parallax the text content out as the user scrolls past the hero
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -60,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
<section
  ref={sectionRef}
  className="relative flex min-h-screen w-full items-center overflow-hidden bg-base-950"
>
  {/* 3D background: nebula, stars, sparkles — the hex logo itself is no longer rendered here */}
  <div className="absolute inset-0">
    <HeroScene />
  </div>

  {/* Static hero logo image, layered above the 3D background */}
{/* Static hero logo image — feathered mask blends all edges into the dark hero background */}
<div className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16 lg:pr-24">
  <div className="relative h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] md:h-[600px] md:w-[600px]">
    <Image
      src="/images/hero-logo.png"
      alt="DevNova Tech logo"
      fill
      priority
      sizes="(max-width: 768px) 400px, 600px"
      className="object-contain"
      style={{
        maskImage:
          "radial-gradient(circle at center, black 40%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(circle at center, black 40%, transparent 70%)",
      }}
    />
  </div>
</div>

      {/* Floating UI labels positioned around the 3D mark — hidden on small screens to avoid clutter */}
<div className="pointer-events-none absolute inset-0 hidden md:block">
  <FloatingBadge label="AI" className="right-[35%] top-[23%] lg:right-[30%]" delay={0.2} />
  <FloatingBadge label="SECURITY" className="right-[34%] top-[35%] lg:right-[43%]" delay={0.5} />
  <FloatingBadge label="WEB" className="right-[20%] top-[35%] lg:right-[20%]" delay={0.8} floatDuration={5} />
  <FloatingBadge label="CLOUD" className="right-[43%] top-[59%] lg:right-[43%]" delay={1.1} floatDuration={4.5} />
  <FloatingBadge label="MOBILE" className="right-[17%] top-[54%] lg:right-[18%]" delay={1.4} />
</div>
      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.span
            variants={fadeUp}
            className="glass-panel mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-medium tracking-widest text-accent-violet"
          >
            INNOVATE · BUILD · ELEVATE
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl font-semibold leading-[1.1] text-text-primary sm:text-5xl md:text-6xl"
          >
            Building the Future
            <br />
            with{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Code
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-base leading-relaxed text-text-muted"
          >
            DevNova Tech builds powerful digital solutions that drive business
            growth and create exceptional experiences.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
            <Button variant="primary" showArrow>
              Start Your Project
            </Button>
            <Button variant="ghost">
              <FiPlay className="text-sm" aria-hidden="true" />
              View Our Work
            </Button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}