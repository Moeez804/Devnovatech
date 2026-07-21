// "use client";

// import Link from "next/link";
// import { useTilt } from "@/hooks/use-tilt";
// import { cn } from "@/lib/utils";
// import { FiArrowRight } from "react-icons/fi";
// import type { IconType } from "react-icons";

// interface ServiceCardProps {
//   icon: IconType;
//   iconColor: string; // tailwind text-color class for icon + glow tint
//   title: string;
//   description: string;
//   href: string;
//   className?: string;
// }

// export function ServiceCard({
//   icon: Icon,
//   iconColor,
//   title,
//   description,
//   href,
//   className,
// }: ServiceCardProps) {
//   const { ref, glowRef, onMouseMove, onMouseLeave } = useTilt({ max: 6, scale: 1.03 });

//   return (
//     <div
//       ref={ref}
//       onMouseMove={onMouseMove}
//       onMouseLeave={onMouseLeave}
//       className={cn(
//         "glass-panel group relative overflow-hidden rounded-xl2 p-6 transition-[border-color,box-shadow] duration-300",
//         "hover:border-white/20 hover:shadow-glow-sm",
//         "[transform-style:preserve-3d] will-change-transform",
//         className
//       )}
//     >
//       {/* Cursor-following radial glow, purely decorative */}
//       <div
//         ref={glowRef}
//         aria-hidden="true"
//         className="pointer-events-none absolute -inset-8 rounded-full bg-accent-violet/20 opacity-0 blur-2xl"
//       />

//       <div
//         className={cn(
//           "relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5",
//           "transition-transform duration-300 group-hover:scale-110"
//         )}
//         style={{ transform: "translateZ(30px)" }}
//       >
//         <Icon className={cn("text-2xl", iconColor)} aria-hidden="true" />
//       </div>

//       <h3
//         className="relative font-display text-lg font-semibold text-text-primary"
//         style={{ transform: "translateZ(20px)" }}
//       >
//         {title}
//       </h3>

//       <p
//         className="relative mt-2 text-sm leading-relaxed text-text-muted"
//         style={{ transform: "translateZ(20px)" }}
//       >
//         {description}
//       </p>

//       <Link
//         href={href}
//         className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-violet transition-colors hover:text-accent-blue"
//         style={{ transform: "translateZ(20px)" }}
//       >
//         Learn More
//         <FiArrowRight
//           className="transition-transform duration-300 group-hover:translate-x-1"
//           aria-hidden="true"
//         />
//       </Link>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";
import { FiArrowUpRight } from "react-icons/fi";
import type { IconType } from "react-icons";

interface ServiceCardProps {
  icon: IconType;
  accentColor: string; // hex used for icon, glow border, and arrow button
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function ServiceCard({
  icon: Icon,
  accentColor,
  title,
  description,
  href,
  className,
}: ServiceCardProps) {
  const { ref, glowRef, onMouseMove, onMouseLeave } = useTilt({ max: 5, scale: 1.02 });

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ "--card-accent": accentColor } as React.CSSProperties}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-base-900/60 p-6 transition-all duration-300",
        "hover:border-[color:var(--card-accent)]/50",
        "[transform-style:preserve-3d] will-change-transform",
        className
      )}
    >
      {/* Radial accent glow, top-left origin, tinted per-card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-25 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: accentColor }}
      />

      {/* Cursor-following glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-full opacity-0 blur-2xl"
        style={{ background: accentColor }}
      />

      <div
        className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110"
        style={{
          borderColor: `${accentColor}55`,
          background: `${accentColor}0D`,
        }}
      >
        <Icon className="text-2xl" style={{ color: accentColor }} aria-hidden="true" />
      </div>

      <h3 className="relative font-display text-base font-semibold text-text-primary">
        {title}
      </h3>

      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-text-muted">
        {description}
      </p>

      <Link
        href={href}
        aria-label={`Learn more about ${title}`}
        className="relative mt-5 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110"
        style={{
          borderColor: `${accentColor}55`,
          color: accentColor,
        }}
      >
        <FiArrowUpRight aria-hidden="true" />
      </Link>
    </div>
  );
}