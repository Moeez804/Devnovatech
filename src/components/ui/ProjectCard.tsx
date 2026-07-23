// "use client";

// import { useEffect, useRef } from "react";
// import dynamic from "next/dynamic";
// import gsap from "gsap";
// import * as THREE from "three";
// import { cn, prefersReducedMotion } from "@/lib/utils";
// import type { Project } from "@/types";

// const LaptopCard3D = dynamic(
//   () =>
//     import("@/components/three/LaptopCard3D").then(
//       (m) => m.LaptopCard3D
//     ),
//   {
//     ssr: false,
//   }
// );

// interface ProjectCardProps {
//   project: Project;
//   accentColor?: string;
//   className?: string;
// }

// const OPEN_ROTATION = -0.1;
// const CLOSED_ROTATION = -1.55;

// export function ProjectCard({
//   project,
//   accentColor = "#6C4CF1",
//   className,
// }: ProjectCardProps) {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const screenGroupRef = useRef<THREE.Group>(null);

//   useEffect(() => {
//     if (!wrapperRef.current) return;

//     (wrapperRef.current as any).__openLaptop = () => {
//       if (!screenGroupRef.current) return;

//       if (prefersReducedMotion()) {
//         screenGroupRef.current.rotation.x = OPEN_ROTATION;
//         return;
//       }

//       gsap.killTweensOf(screenGroupRef.current.rotation);

//       gsap.to(screenGroupRef.current.rotation, {
//         x: OPEN_ROTATION,
//         duration: 1,
//         ease: "power3.out",
//       });
//     };

//     (wrapperRef.current as any).__closeLaptop = () => {
//       if (!screenGroupRef.current) return;

//       if (prefersReducedMotion()) {
//         screenGroupRef.current.rotation.x = CLOSED_ROTATION;
//         return;
//       }

//       gsap.killTweensOf(screenGroupRef.current.rotation);

//       gsap.to(screenGroupRef.current.rotation, {
//         x: CLOSED_ROTATION,
//         duration: 0.7,
//         ease: "power2.inOut",
//       });
//     };
//   }, []);

//   return (
//     <div
//       ref={wrapperRef}
//       className={cn(
//         "project-card",
//         "relative flex shrink-0 items-center justify-center",
//         "w-[90vw] sm:w-[620px] md:w-[760px]",
//         "h-[420px] md:h-[520px]",
//         className
//       )}
//     >
//       {/* Soft Glow */}

//       <div
//         className="absolute left-1/2 top-[78%] -translate-x-1/2 rounded-full blur-3xl"
//         style={{
//           width: "340px",
//           height: "80px",
//           background: `${accentColor}25`,
//         }}
//       />

//       {/* Floor Shadow */}

//       <div
//         className="absolute left-1/2 top-[79%] -translate-x-1/2 rounded-full bg-black/60 blur-2xl"
//         style={{
//           width: "260px",
//           height: "40px",
//         }}
//       />

//       {/* Floating Laptop */}

//       <div className="relative z-10 h-full w-full">
//         <LaptopCard3D
//           videoSrc={project.videoSrc}
//           accentColor={accentColor}
//           screenGroupRef={screenGroupRef}
//         />
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { FiArrowUpRight } from "react-icons/fi";
import type { Project } from "@/types";
import type { LaptopModelHandle } from "@/components/three/LaptopModel";

const LaptopCard3D = dynamic(
  () => import("@/components/three/LaptopCard3D").then((m) => m.LaptopCard3D),
  { ssr: false }
);

interface ProjectCardProps {
  project: Project;
  accentColor?: string;
  className?: string;
}

export function ProjectCard({ project, accentColor = "#6C4CF1", className }: ProjectCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const screenGroupRef = useRef<LaptopModelHandle>(null);
  const infoControls = useAnimation();
  const isOpenRef = useRef(false);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Called only once the card is confirmed fully visible/centered (see use-horizontal-scroll.ts trigger points)
    (wrapperRef.current as any).__openLaptop = () => {
      if (isOpenRef.current) return;
      isOpenRef.current = true;

      screenGroupRef.current?.open(() => {
        // Project info fades/slides in only once the laptop has actually finished opening + video started
        infoControls.start({ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } });
      });
    };

    (wrapperRef.current as any).__closeLaptop = () => {
      if (!isOpenRef.current) return;
      isOpenRef.current = false;

      // Info fades out immediately, laptop closes right after (video already stopped inside close())
      infoControls.start({ opacity: 0, y: 12, transition: { duration: 0.3, ease: "easeIn" } });
      screenGroupRef.current?.close();
    };
  }, [infoControls]);

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      className={cn(
        "project-card group relative flex shrink-0 flex-col items-center",
         "w-[70vw] sm:w-[460px] md:w-[520px]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
        style={{ background: `radial-gradient(circle at center, ${accentColor}30, transparent 70%)` }}
      />

      <div className="relative h-[300px] w-full md:h-[360px]">
        <LaptopCard3D videoSrc={project.videoSrc} accentColor={accentColor} screenGroupRef={screenGroupRef} />
      </div>

      <motion.div
        animate={infoControls}
        initial={{ opacity: 0, y: 12 }}
        className="relative z-10 mt-4 flex w-full items-center justify-between px-2"
      >
        <div>
          <h3 className="font-display text-lg font-semibold text-text-primary">{project.title}</h3>
          <p className="mt-0.5 text-sm text-text-muted">{project.category}</p>
        </div>

        <Link
          href={project.href}
          aria-label={`View ${project.title} project`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-text-primary transition-all duration-300 hover:scale-110"
          style={{ borderColor: `${accentColor}55` }}
        >
          <FiArrowUpRight aria-hidden="true" style={{ color: accentColor }} />
        </Link>
      </motion.div>
    </motion.div>
  );
}