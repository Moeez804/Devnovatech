"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Button } from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/styles/animations";
import {
  FiSmartphone,
  FiCode,
  FiServer,
  FiCloud,
} from "react-icons/fi";
import { BsCpu } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import type { Service } from "@/types";

const SERVICES: (Service & { iconComponent: typeof FiSmartphone; iconColor: string })[] = [
  {
    id: "mobile",
    title: "Mobile App Development",
    description: "We build high-performance mobile apps for Android and iOS.",
    icon: "smartphone",
    iconComponent: FiSmartphone,
    iconColor: "text-accent-violet",
    href: "#",
  },
  {
    id: "web",
    title: "Web Development",
    description: "Modern, responsive and scalable web applications that perform.",
    icon: "code",
    iconComponent: FiCode,
    iconColor: "text-accent-blue",
    href: "#",
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Robust, secure and scalable backend solutions.",
    icon: "server",
    iconComponent: FiServer,
    iconColor: "text-emerald-400",
    href: "#",
  },
  {
    id: "ai",
    title: "AI & Automation",
    description: "Intelligent solutions and automation to accelerate your business.",
    icon: "cpu",
    iconComponent: BsCpu,
    iconColor: "text-orange-400",
    href: "#",
  },
  {
    id: "cloud",
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure for modern businesses.",
    icon: "cloud",
    iconComponent: FiCloud,
    iconColor: "text-sky-400",
    href: "#",
  },
];

export function Services() {
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          ref={headerRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerContainer}
          className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <motion.span
              variants={fadeUp}
              className="mb-3 block text-xs font-medium uppercase tracking-widest text-accent-violet"
            >
              Our Services
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl"
            >
              Solutions That Drive
              <br />
              Your Business Forward
            </motion.h2>
          </div>

          <motion.div variants={fadeUp}>
            <Button variant="ghost" className="whitespace-nowrap">
              View All Services
              <FiArrowRight aria-hidden="true" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {SERVICES.map((service) => (
            <motion.div key={service.id} variants={fadeUp}>
              <ServiceCard
                icon={service.iconComponent}
                iconColor={service.iconColor}
                title={service.title}
                description={service.description}
                href={service.href}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}