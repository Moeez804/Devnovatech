"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StatCard } from "@/components/ui/StatCard";
import { prefersReducedMotion } from "@/lib/utils";
import type { StatItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const STATS: StatItem[] = [
  { id: "projects", value: 100, suffix: "+", label: "Projects Completed" },
  { id: "technologies", value: 15, suffix: "+", label: "Technologies" },
  { id: "clients", value: 50, suffix: "+", label: "Happy Clients" },
  { id: "support", value: 24, suffix: "/7", label: "Support" },
];

const BRAND_LOGOS = ["logoipsum", "logoipsum", "logoipsum", "logoipsum"];

export function Statistics() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-10 -mt-16 px-6 md:px-10">
      <div
        ref={sectionRef}
        className="glass-panel mx-auto flex max-w-6xl flex-col gap-6 rounded-xl2 p-6 shadow-glow-sm md:flex-row md:items-center md:gap-0 md:p-8"
      >
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:gap-0 md:border-r md:border-white/10 md:pr-6">
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              divider={i < STATS.length - 1}
              duration={1.4 + i * 0.2}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 md:pl-6">
          <span className="text-center text-[10px] uppercase tracking-widest text-text-faint md:text-left">
            Trusted by global brands
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start">
            {BRAND_LOGOS.map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="text-sm font-medium italic text-text-faint opacity-60"
                aria-hidden="true"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}