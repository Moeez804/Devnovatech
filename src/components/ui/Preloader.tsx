"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { prefersReducedMotion } from "@/lib/utils";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress(100);
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";

    const intervalId = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 9 + 3, 100);
        if (next >= 100) {
          clearInterval(intervalId);
          setDone(true);
        }
        return Math.round(next);
      });
    }, 120);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = "";
    }, 700);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(8px)",
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-base-950"
        >
          {/* Drifting ambient orbs */}
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -left-20 top-1/4 h-[420px] w-[420px] rounded-full bg-accent-violet/15 blur-[110px]"
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="pointer-events-none absolute -right-16 bottom-1/4 h-[380px] w-[380px] rounded-full bg-accent-blue/15 blur-[110px]"
          />

          {/* Floating particles */}
          <FloatingDust />

          <div className="relative flex flex-col items-center gap-10">
            {/* Glassmorphic card with spinning conic-gradient halo around the logo */}
            <div className="relative flex h-40 w-40 items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, #6C4CF1 15%, transparent 30%, transparent 70%, #3B7CF6 85%, transparent 100%)",
                  mask: "radial-gradient(closest-side, transparent 78%, black 80%)",
                  WebkitMask: "radial-gradient(closest-side, transparent 78%, black 80%)",
                }}
              />

              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="glass-panel flex h-28 w-28 items-center justify-center rounded-full shadow-glow"
              >
                <Logo compact className="scale-110" />
              </motion.div>
            </div>

            {/* Percentage + label */}
            <div className="flex flex-col items-center gap-3">
              <span className="font-display text-3xl font-semibold tabular-nums text-text-primary">
                {progress}<span className="text-lg text-text-faint">%</span>
              </span>

              {/* Sleek progress bar with shimmer sweep */}
              <div className="relative h-[3px] w-48 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-brand-gradient"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
                <motion.div
                  animate={{ x: ["-100%", "300%"] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </div>

              <span className="text-[10px] uppercase tracking-[0.3em] text-text-faint">
                DevNova Tech
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatingDust() {
  const [particles, setParticles] = useState<
    { id: number; left: number; top: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    // Generated only on the client, after mount — avoids SSR/client hydration mismatch from Math.random()
    setParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 3,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-1 w-1 rounded-full bg-accent-violet/40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}