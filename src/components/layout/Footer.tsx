"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedFooterLogo } from "@/components/ui/AnimatedFooterLogo";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { FOOTER_LINK_GROUPS } from "@/lib/footer-links";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/styles/animations";
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub, FiTwitter, FiInstagram } from "react-icons/fi";
import type { IconType } from "react-icons";

const FooterScene = dynamic(
  () => import("@/components/three/FooterScene").then((m) => m.FooterScene),
  { ssr: false }
);

const SOCIAL_ICONS: Record<string, IconType> = {
  LinkedIn: FiLinkedin,
  GitHub: FiGithub,
  Twitter: FiTwitter,
  Instagram: FiInstagram,
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-base-900">
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
        <FooterScene />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-16 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]"
        >
          {/* Brand column */}
          <motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-1">
            <AnimatedFooterLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              Building the future with code. DevNova Tech delivers powerful
              digital solutions for growing businesses.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label];
                return (
                    <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-all duration-300 hover:text-accent-violet hover:border-white/20"
                  >
                    {Icon && <Icon size={15} aria-hidden="true" />}
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Link groups */}
          {FOOTER_LINK_GROUPS.map((group) => (
            <motion.div key={group.title} variants={fadeUp}>
              <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-text-primary">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted transition-colors hover:text-accent-violet"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact + newsletter */}
          <motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-1">
            <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-text-primary">
              Contact
            </h4>
            <ul className="mb-6 flex flex-col gap-2.5 text-sm text-text-muted">
              <li className="flex items-center gap-2">
                <FiMail className="shrink-0 text-accent-violet" aria-hidden="true" />
                {SITE_CONFIG.email}
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="shrink-0 text-accent-violet" aria-hidden="true" />
                {SITE_CONFIG.phone}
              </li>
              <li className="flex items-center gap-2">
                <FiMapPin className="shrink-0 text-accent-violet" aria-hidden="true" />
                {SITE_CONFIG.location}
              </li>
            </ul>

            <NewsletterForm />
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/8 pt-6 text-xs text-text-faint sm:flex-row sm:justify-between">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="transition-colors hover:text-text-muted">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-text-muted">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}