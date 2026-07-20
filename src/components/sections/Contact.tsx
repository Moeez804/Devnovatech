"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/sections/ContactForm";
import { fadeUp, staggerContainer } from "@/styles/animations";
import { SITE_CONFIG } from "@/lib/constants";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const EarthScene = dynamic(
  () => import("@/components/three/EarthScene").then((m) => m.EarthScene),
  { ssr: false }
);

const CONTACT_DETAILS = [
  { icon: FiMail, label: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
  { icon: FiPhone, label: SITE_CONFIG.phone, href: `tel:${SITE_CONFIG.phone.replace(/\s+/g, "")}` },
  { icon: FiMapPin, label: SITE_CONFIG.location, href: undefined },
];

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
      {/* Earth sits behind the whole section, positioned toward the right */}
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 opacity-70 md:right-0 md:h-[600px] md:w-[600px]"
        aria-hidden="true"
      >
        <EarthScene />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl"
            >
              Let's Build Something
              <br />
              Amazing Together
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-md text-sm leading-relaxed text-text-muted">
              Have a project in mind? Let's discuss your idea and turn it into
              a powerful digital solution.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-widest text-accent-violet">
                Contact Info
              </span>
              {CONTACT_DETAILS.map(({ icon: Icon, label, href }) => {
                const content = (
                  <span className="flex items-center gap-3 text-sm text-text-primary">
                    <span className="glass-panel flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                      <Icon className="text-accent-violet" aria-hidden="true" />
                    </span>
                    {label}
                  </span>
                );
                return href ? (
                  <a key={label} href={href} className="w-fit transition-opacity hover:opacity-80">
                    {content}
                  </a>
                ) : (
                  <div key={label}>{content}</div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}