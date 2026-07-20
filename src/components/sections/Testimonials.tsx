"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { useAutoSlider } from "@/hooks/use-auto-slider";
import { TESTIMONIALS } from "@/lib/testimonials-data";
import { fadeUp, staggerContainer } from "@/styles/animations";
import { cn } from "@/lib/utils";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function Testimonials() {
  const { activeIndex, goTo, next, prev, setPaused } = useAutoSlider({
    itemCount: TESTIMONIALS.length,
    interval: 5000,
  });

  // Desktop shows 3 cards per view, centered on activeIndex; mobile shows 1
  const visibleCount = 3;
  const visibleTestimonials = Array.from({ length: visibleCount }, (_, i) => {
    const index = (activeIndex + i - Math.floor(visibleCount / 2) + TESTIMONIALS.length) % TESTIMONIALS.length;
    return TESTIMONIALS[index];
  });

  return (
    <section
      id="testimonials"
      className="relative px-6 py-24 md:px-10 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
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
              Testimonials
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-semibold text-text-primary sm:text-4xl"
            >
              What Our Clients Say
            </motion.h2>
          </div>

          <motion.div variants={fadeUp} className="flex gap-3">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="glass-panel flex h-10 w-10 items-center justify-center rounded-full text-text-primary transition-colors hover:border-white/20"
            >
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="glass-panel flex h-10 w-10 items-center justify-center rounded-full text-text-primary transition-colors hover:border-white/20"
            >
              <FiChevronRight aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>

        {/* Desktop: 3-up grid, crossfades on index change */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6">
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile: single card, swaps on index change */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <TestimonialCard key={TESTIMONIALS[activeIndex].id} testimonial={TESTIMONIALS[activeIndex]} />
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === activeIndex}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex ? "w-6 bg-accent-violet" : "w-1.5 bg-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}