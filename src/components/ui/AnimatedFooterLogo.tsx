"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

/** Reuses Module 02's Logo component with a subtle looping glow-pulse, avoiding any duplicated logo markup. */
export function AnimatedFooterLogo() {
  return (
    <motion.div
      animate={{ filter: ["drop-shadow(0 0 0px #6C4CF1)", "drop-shadow(0 0 12px #6C4CF1)", "drop-shadow(0 0 0px #6C4CF1)"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <Logo />
    </motion.div>
  );
}