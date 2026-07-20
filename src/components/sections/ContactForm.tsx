"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { validateContactForm, type ContactFormValues, type ContactFormErrors } from "@/lib/validation";
import { FiCheckCircle, FiSend } from "react-icons/fi";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const INITIAL_VALUES: ContactFormValues = { name: "", email: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function handleChange(field: keyof ContactFormValues, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    if (touched[field]) {
      setErrors(validateContactForm(nextValues));
    }
  }

  function handleBlur(field: keyof ContactFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateContactForm(values));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      // Wire this up to your actual API route / email service (e.g. /api/contact)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus("success");
      setValues(INITIAL_VALUES);
      setTouched({});
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="glass-panel relative overflow-hidden rounded-xl2 p-6 md:p-8">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <FiCheckCircle className="mb-4 text-4xl text-emerald-400" aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold text-text-primary">
              Message Sent!
            </h3>
            <p className="mt-2 max-w-xs text-sm text-text-muted">
              Thanks for reaching out — we'll get back to you within 24 hours.
            </p>
            <Button
              variant="ghost"
              className="mt-6"
              onClick={() => setStatus("idle")}
            >
              Send Another Message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                label="Your Name"
                placeholder="John Doe"
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                error={touched.name ? errors.name : undefined}
              />
              <FormField
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={values.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                error={touched.email ? errors.email : undefined}
              />
            </div>

            <FormField
              label="Project Details"
              as="textarea"
              rows={5}
              placeholder="Tell us about your project..."
              value={values.message}
              onChange={(e) => handleChange("message", e.target.value)}
              onBlur={() => handleBlur("message")}
              error={touched.message ? errors.message : undefined}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={status === "submitting"}
              className="mt-2 w-full justify-center disabled:opacity-60"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
              {status !== "submitting" && <FiSend aria-hidden="true" />}
            </Button>

            {status === "error" && (
              <p role="alert" className="text-center text-sm text-red-400">
                Something went wrong. Please try again.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}