"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { Button } from "@/components/ui/Button";
import { TIMELINE } from "@/lib/timeline-data";
import { fadeUp, staggerContainer } from "@/styles/animations";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

const AstronautScene = dynamic(
  () => import("@/components/three/AstronautScene").then((m) => m.AstronautScene),
  { ssr: false }
);

const VALUES = [
  "Client-Centric Approach",
  "Innovative Solutions",
  "Quality & Performance",
  "On-Time Delivery",
];

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Intro row: passionate developers copy + astronaut */}
        <div className="mb-24 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
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
              About Us
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl"
            >
              Passionate Developers.
              <br />
              Innovative Thinkers.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-md text-sm leading-relaxed text-text-muted"
            >
              DevNova Tech is a software development company focused on
              building high-quality, scalable digital solutions for startups
              and enterprises.
            </motion.p>

            <motion.ul variants={fadeUp} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {VALUES.map((value) => (
                <li key={value} className="flex items-center gap-2 text-sm text-text-primary">
                  <FiCheckCircle className="shrink-0 text-accent-violet" aria-hidden="true" />
                  {value}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="mt-8">
              <Button variant="primary" showArrow>
                Know More About Us
                <FiArrowRight aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>

          <div className="relative h-[360px] w-full sm:h-[420px] lg:h-[480px]" aria-hidden="true">
            <AstronautScene />
          </div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="mb-12 text-center font-display text-2xl font-semibold text-text-primary sm:text-3xl">
            Our Journey So Far
          </h3>

          <div className="mx-auto max-w-4xl">
            {TIMELINE.map((entry, i) => (
              <TimelineItem
                key={entry.id}
                entry={entry}
                index={i}
                isLast={i === TIMELINE.length - 1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}