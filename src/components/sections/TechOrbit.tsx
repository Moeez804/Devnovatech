"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/styles/animations";
import { FiMonitor, FiServer, FiSmartphone, FiCloud, FiCpu, FiGitBranch } from "react-icons/fi";

const TechOrbitScene = dynamic(
  () => import("@/components/three/TechOrbitScene").then((m) => m.TechOrbitScene),
  { ssr: false }
);

const TECH_NAMES = ["React", ".NET", "MongoDB", "Docker", "Python", "Flutter", "Node.js"];

const HIGHLIGHTS = [
  { label: "Frontend", icon: FiMonitor },
  { label: "Backend", icon: FiServer },
  { label: "Mobile", icon: FiSmartphone },
  { label: "Cloud", icon: FiCloud },
  { label: "AI", icon: FiCpu },
  { label: "DevOps", icon: FiGitBranch },
];

export function TechOrbit() {
  return (
    <section id="technologies" className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
      {/* Layered background — cyber grid + radial glow + vignette, pure CSS, no shader risk */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(108,76,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(108,76,241,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-accent-violet/10 blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-base-950 via-transparent to-base-950" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeUp}
            className="mb-3 block text-xs font-medium uppercase tracking-widest text-accent-violet"
          >
            Technologies We Use
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl font-semibold leading-tight sm:text-4xl"
          >
            <span className="bg-gradient-to-r from-text-primary via-accent-violet to-accent-blue bg-clip-text text-transparent">
              Modern Tech
            </span>
            <br />
            <span className="relative inline-block text-text-primary">
              for Modern Problems
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left bg-brand-gradient"
              />
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-4 max-w-md text-sm leading-relaxed text-text-muted">
            We work across a carefully chosen stack — proven where it matters,
            cutting-edge where it counts — to ship fast without cutting corners.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
            {HIGHLIGHTS.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="glass-panel group flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-text-muted transition-all duration-300 hover:border-white/20 hover:text-accent-violet hover:shadow-glow-sm"
              >
                <Icon className="text-sm transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                {label}
              </div>
            ))}
          </motion.div>

          <p className="sr-only">Technologies we use include: {TECH_NAMES.join(", ")}.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[380px] w-full sm:h-[440px] md:h-[500px]"
          aria-hidden="true"
        >
          <TechOrbitScene />
        </motion.div>
      </div>
    </section>
  );
}