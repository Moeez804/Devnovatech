"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { NAV_LINKS } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useScrollShrink } from "@/hooks/use-scroll-shrink";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { FiMenu } from "react-icons/fi";

type NavHref = (typeof NAV_LINKS)[number]["href"];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Updated
  const [activeHref, setActiveHref] = useState<NavHref>(NAV_LINKS[0].href);

  const shrunk = useScrollShrink(60);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !navRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".nav-link-item", {
        y: -12,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        delay: 0.3,
        ease: "power2.out",
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out",
          shrunk ? "py-2" : "py-4"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 transition-all duration-500",
            "glass-panel",
            shrunk
              ? "py-2 shadow-glow-sm"
              : "py-3 border-transparent bg-transparent backdrop-blur-0"
          )}
        >
          <a href="/" aria-label="DevNova Tech — home" className="shrink-0">
            <Logo compact={shrunk} />
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveHref(link.href)}
                aria-current={activeHref === link.href ? "page" : undefined}
                className={cn(
                  "nav-link-item relative px-3 py-2 text-sm font-medium transition-colors duration-200",
                  activeHref === link.href
                    ? "text-accent-violet"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {link.label}

                {activeHref === link.href && (
                  <span
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-accent-violet"
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button variant="primary" showArrow>
              Start Your Project
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="rounded-full p-2 text-text-primary hover:bg-white/5 md:hidden"
          >
            <FiMenu size={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div id="mobile-menu">
        <MobileMenu
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      </div>
    </>
  );
}