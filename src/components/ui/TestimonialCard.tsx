"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StarRating } from "@/components/ui/StarRating";
import { FiUser } from "react-icons/fi";
import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel flex h-full flex-col rounded-xl2 p-6 shadow-glow-sm"
    >
      <StarRating rating={testimonial.rating} className="mb-4" />

      <p className="flex-1 text-sm leading-relaxed text-text-muted">
        "{testimonial.quote}"
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-4">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/5">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <FiUser className="text-text-faint" aria-hidden="true" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
          <p className="text-xs text-text-muted">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}