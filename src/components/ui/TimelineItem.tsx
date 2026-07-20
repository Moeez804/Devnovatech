"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TimelineEntry } from "@/lib/timeline-data";

interface TimelineItemProps {
  entry: TimelineEntry;
  index: number;
  isLast: boolean;
}

export function TimelineItem({ entry, index, isLast }: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <div className="relative flex gap-6 md:gap-0">
      {/* Left side (desktop): content for even items */}
      <div className="hidden flex-1 md:block md:pr-10">
        {isEven && <TimelineCard entry={entry} align="right" />}
      </div>

      {/* Center rail */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-glow-sm"
        >
          <span className="font-display text-[10px] font-semibold text-accent-violet">
            {entry.year}
          </span>
        </motion.div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-accent-violet/50 to-white/5 md:min-h-[100px]" />
        )}
      </div>

      {/* Right side (desktop): content for odd items. Mobile: always here regardless of index */}
      <div className="flex-1 pb-10 md:pl-10">
        <div className="md:hidden">
          <TimelineCard entry={entry} align="left" />
        </div>
        <div className={cn("hidden md:block", isEven && "md:invisible")}>
          {!isEven && <TimelineCard entry={entry} align="left" />}
        </div>
      </div>
    </div>
  );
}

function TimelineCard({ entry, align }: { entry: TimelineEntry; align: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass-panel rounded-xl2 p-5",
        align === "right" ? "text-left md:text-right" : "text-left"
      )}
    >
      <h4 className="font-display text-base font-semibold text-text-primary">
        {entry.title}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        {entry.description}
      </p>
    </motion.div>
  );
}