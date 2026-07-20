"use client";

import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  as?: "input" | "textarea";
  rows?: number;
}

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, error, as = "input", rows = 4, className, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${fieldId}-error`;

    const sharedClasses = cn(
      "glass-panel w-full rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-faint",
      "transition-colors duration-200 focus:outline-none",
      error ? "border-red-400/50" : "focus:border-accent-violet/50",
      className
    );

    return (
      <div className="w-full">
        <label htmlFor={fieldId} className="mb-2 block text-xs font-medium text-text-muted">
          {label}
        </label>

        {as === "textarea" ? (
          <textarea
            id={fieldId}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(sharedClasses, "resize-none")}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={fieldId}
            ref={ref as React.Ref<HTMLInputElement>}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={sharedClasses}
            {...props}
          />
        )}

        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5 text-xs text-red-400"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FormField.displayName = "FormField";