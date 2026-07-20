"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { FiX } from "react-icons/fi";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus management + Escape to close + basic focus trap
  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-base-950/80 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="glass-panel fixed right-0 top-0 z-50 h-full w-[80%] max-w-sm md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-display text-sm tracking-widest text-text-muted">
                MENU
              </span>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-full p-2 text-text-primary hover:bg-white/5"
              >
                <FiX size={22} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  className="rounded-lg px-3 py-3 text-lg text-text-primary hover:bg-white/5 hover:text-accent-violet"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="px-6 pt-4">
              <Button variant="primary" showArrow className="w-full justify-center">
                Start Your Project
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}