"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StatCard } from "@/components/ui/StatCard";
import { prefersReducedMotion } from "@/lib/utils";
import { FiBox, FiHeadphones } from "react-icons/fi";
import { HiOutlineRocketLaunch, HiOutlineUserGroup } from "react-icons/hi2";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { id: "projects", icon: FiBox, accentColor: "#4C9EFF", value: 100, suffix: "+", label: "Projects Completed" },
  { id: "technologies", icon: HiOutlineRocketLaunch, accentColor: "#B366FF", value: 15, suffix: "+", label: "Technologies" },
  { id: "clients", icon: HiOutlineUserGroup, accentColor: "#4C9EFF", value: 50, suffix: "+", label: "Happy Clients" },
  { id: "support", icon: FiHeadphones, accentColor: "#B366FF", value: 24, suffix: "/7", label: "Support Available" },
];

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
        className="relative mx-auto flex max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/8 bg-base-900/70 backdrop-blur-xl sm:flex-row"
      >
        {/* Glowing gradient line across the top edge */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-violet to-transparent opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1/4 -top-8 h-16 rounded-full bg-accent-violet/20 blur-2xl"
        />

        {STATS.map((stat, i) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            accentColor={stat.accentColor}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            divider={i < STATS.length - 1}
            duration={1.4 + i * 0.2}
          />
        ))}
      </div>
    </section>
  );
}