// "use client";

// import { useEffect, useRef } from "react";
// import dynamic from "next/dynamic";
// import Link from "next/link";
// import gsap from "gsap";
// import * as THREE from "three";
// import { cn, prefersReducedMotion } from "@/lib/utils";
// import { FiArrowUpRight } from "react-icons/fi";
// import type { Project } from "@/types";

// const LaptopCard3D = dynamic(
//   () => import("@/components/three/LaptopCard3D").then((m) => m.LaptopCard3D),
//   { ssr: false }
// );

// interface ProjectCardProps {
//   project: Project;
//   accentColor?: string;
//   className?: string;
// }

// const OPEN_ROTATION = -0.1;
// const CLOSED_ROTATION = -1.55;

// export function ProjectCard({ project, accentColor = "#6C4CF1", className }: ProjectCardProps) {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const screenGroupRef = useRef<THREE.Group>(null);

//   // Exposed as data attributes so the parent's ScrollTrigger loop can target this exact card + its 3D ref
//   useEffect(() => {
//     if (!wrapperRef.current) return;
//     (wrapperRef.current as any).__openLaptop = () => {
//       if (screenGroupRef.current && !prefersReducedMotion()) {
//         gsap.to(screenGroupRef.current.rotation, {
//           x: OPEN_ROTATION,
//           duration: 1,
//           ease: "power3.out",
//         });
//       } else if (screenGroupRef.current) {
//         screenGroupRef.current.rotation.x = OPEN_ROTATION;
//       }
//     };
//     (wrapperRef.current as any).__closeLaptop = () => {
//       if (screenGroupRef.current && !prefersReducedMotion()) {
//         gsap.to(screenGroupRef.current.rotation, {
//           x: CLOSED_ROTATION,
//           duration: 0.7,
//           ease: "power2.inOut",
//         });
//       } else if (screenGroupRef.current) {
//         screenGroupRef.current.rotation.x = CLOSED_ROTATION;
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={wrapperRef}
//       className={cn(
//         "project-card glass-panel group relative flex h-[420px] w-[85vw] shrink-0 flex-col overflow-hidden rounded-xl2 sm:w-[520px] md:h-[480px] md:w-[620px]",
//         "transition-[border-color,box-shadow] duration-300 hover:border-white/20 hover:shadow-glow",
//         className
//       )}
//     >
//       <div className="relative flex-1">
//         <LaptopCard3D videoSrc={project.videoSrc} accentColor={accentColor} screenGroupRef={screenGroupRef} />
//       </div>

//       <div className="relative z-10 flex items-center justify-between border-t border-white/8 px-6 py-5">
//         <div>
//           <h3 className="font-display text-lg font-semibold text-text-primary">{project.title}</h3>
//           <p className="mt-0.5 text-sm text-text-muted">{project.category}</p>
//         </div>

//         <Link
//           href={project.href}
//           aria-label={`View ${project.title} project`}
//           className="glass-panel flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-primary transition-all duration-300 group-hover:bg-brand-gradient group-hover:text-white"
//         >
//           <FiArrowUpRight aria-hidden="true" />
//         </Link>
//       </div>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { FiArrowUpRight } from "react-icons/fi";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  accentColor?: string;
  className?: string;
}

export function ProjectCard({
  project,
  className,
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        "project-card glass-panel group relative flex h-[420px] w-[85vw] shrink-0 flex-col overflow-hidden rounded-xl2 border border-white/10 transition-all duration-500 hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(108,76,241,0.35)] sm:w-[520px] md:h-[480px] md:w-[620px]",
        className
      )}
    >
      {/* Video */}
      <div className="relative flex-1 overflow-hidden">
        <video
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={project.videoSrc}
          poster={project.thumbnail}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 bg-[#0d0d18]/80 px-6 py-5 backdrop-blur-xl">
        <div>
          <h3 className="font-display text-xl font-semibold text-white">
            {project.title}
          </h3>

          <p className="mt-1 text-sm text-white/60">
            {project.category}
          </p>
        </div>

        <Link
          href={project.href}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition hover:bg-violet-600"
        >
          <FiArrowUpRight />
        </Link>
      </div>
    </div>
  );
}