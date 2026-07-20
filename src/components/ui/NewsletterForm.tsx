"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiCheck } from "react-icons/fi";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    // Wire this to a real newsletter API route once available
    setSubscribed(true);
    setEmail("");
  }

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">
        Newsletter
      </p>
      <p className="mb-4 text-sm text-text-muted">
        Get our latest updates and insights.
      </p>

      <AnimatePresence mode="wait">
        {subscribed ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-emerald-400"
          >
            <FiCheck aria-hidden="true" />
            Subscribed! Thanks for joining.
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            noValidate
            className="flex gap-2"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? "newsletter-error" : undefined}
              className="glass-panel w-full rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-accent-violet/50"
            />
            <button
              type="submit"
              aria-label="Subscribe to newsletter"
              className="bg-brand-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
            >
              <FiSend size={15} aria-hidden="true" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {error && (
        <p id="newsletter-error" role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}