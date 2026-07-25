 //"use client";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { ProjectCard } from "@/components/ui/ProjectCard";
// import { Button } from "@/components/ui/Button";
// import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
// import { fadeUp, staggerContainer } from "@/styles/animations";
// import { FiArrowRight } from "react-icons/fi";
// import type { Project } from "@/types";

// const PROJECTS: (Project & { accentColor: string })[] = [
//   {
//     id: "skyreserve",
//     title: "SkyReserve",
//     category: "Travel Booking Platform",
//     thumbnail: "/images/projects/skyreserve.jpg",
//     videoSrc: "/videos/skyreserve.mp4",
//     href: "#",
//     accentColor: "#3B7CF6",
//   },
//   {
//     id: "nutrifactor",
//     title: "Nutrifactor Shop",
//     category: "E-commerce Mobile App",
//     thumbnail: "/images/projects/nutrifactor.jpg",
//     videoSrc: "/videos/nutrifactor.mp4",
//     href: "#",
//     accentColor: "#4CD8F1",
//   },
//   {
//     id: "eduvate",
//     title: "EduVATE LMS",
//     category: "Learning Management System",
//     thumbnail: "/images/projects/eduvate.jpg",
//     videoSrc: "/videos/eduvate.mp4",
//     href: "#",
//     accentColor: "#6C4CF1",
//   },
//   {
//     id: "queuenova",
//     title: "QueueNova",
//     category: "Queue Management System",
//     thumbnail: "/images/projects/queuenova.png",
//     videoSrc: "/videos/queuenova.mp4",
//     href: "#",
//     accentColor: "#8B6CFF",
//   },
// ];

// export function Projects() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const trackRef = useRef<HTMLDivElement>(null);
//   const [isDesktop, setIsDesktop] = useState(false);

//   useEffect(() => {
//     const mq = window.matchMedia("(min-width: 768px)");
//     setIsDesktop(mq.matches);
//     const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
//     mq.addEventListener("change", listener);
//     return () => mq.removeEventListener("change", listener);
//   }, []);

//   const handleOpen = useCallback((cardEl: Element) => {
//     (cardEl as any).__openLaptop?.();
//   }, []);

//   const handleClose = useCallback((cardEl: Element) => {
//     (cardEl as any).__closeLaptop?.();
//   }, []);

//   useHorizontalScroll({
//     sectionRef,
//     trackRef,
//     cardSelector: ".project-card",
//     onCardOpen: handleOpen,
//     onCardClose: handleClose,
//     enabled: isDesktop,
//   });

//   return (
//     <section
//       ref={sectionRef}
//       id="portfolio"
//       className="relative overflow-hidden bg-base-950 py-20 md:py-0"
//     >
//       <motion.div
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-15% 0px" }}
//         variants={staggerContainer}
//         className="mx-auto mb-10 flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-end md:px-10 md:pt-24"
//       >
//         <div>
//           <motion.span
//             variants={fadeUp}
//             className="mb-3 block text-xs font-medium uppercase tracking-widest text-accent-violet"
//           >
//             Our Portfolio
//           </motion.span>
//           <motion.h2
//             variants={fadeUp}
//             className="font-display text-3xl font-semibold text-text-primary sm:text-4xl"
//           >
//             Products We're Proud Of
//           </motion.h2>
//         </div>

//         <motion.div variants={fadeUp}>
//           <Button variant="ghost" className="whitespace-nowrap">
//             View All Projects
//             <FiArrowRight aria-hidden="true" />
//           </Button>
//         </motion.div>
//       </motion.div>

//       {/* Desktop: pinned horizontal scroll track. Mobile: native horizontal swipe with scroll-snap, no pin-jacking. */}
// <div
//   ref={trackRef}
//   className={
//     isDesktop
//       ? "flex items-center gap-6 px-[10vw] will-change-transform md:px-[15vw]"
//       : "flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [-webkit-overflow-scrolling:touch]"
//   }
// >
//         {PROJECTS.map((project) => (
//           <div key={project.id} className={!isDesktop ? "snap-center" : ""}>
//             <ProjectCard project={project} accentColor={project.accentColor} />
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import { fadeUp, staggerContainer } from "@/styles/animations";
import { FiArrowRight } from "react-icons/fi";
import type { Project } from "@/types";

const PROJECTS: (Project & { accentColor: string })[] = [
  {
    id: "skyreserve",
    title: "SkyReserve",
    category: "Travel Booking Platform",
    thumbnail: "/images/projects/skyreserve.jpg",
    videoSrc: "/videos/skyreserve.mp4",
    href: "#",
    accentColor: "#3B7CF6",
  },
  {
    id: "nutrifactor",
    title: "Nutrifactor Shop",
    category: "E-commerce Mobile App",
    thumbnail: "/images/projects/nutrifactor.jpg",
    videoSrc: "/videos/nutrifactor.mp4",
    href: "#",
    accentColor: "#4CD8F1",
  },
  {
    id: "eduvate",
    title: "EduVATE LMS",
    category: "Learning Management System",
    thumbnail: "/images/projects/eduvate.jpg",
    videoSrc: "/videos/eduvate.mp4",
    href: "#",
    accentColor: "#6C4CF1",
  },
  {
    id: "queuenova",
    title: "QueueNova",
    category: "Queue Management System",
    thumbnail: "/images/projects/queuenova.jpg",
    videoSrc: "/videos/queuenova.mp4",
    href: "#",
    accentColor: "#8B6CFF",
  },
];

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const handleOpen = useCallback((cardEl: Element) => {
    (cardEl as any).__openLaptop?.();
  }, []);

  const handleClose = useCallback((cardEl: Element) => {
    (cardEl as any).__closeLaptop?.();
  }, []);

  useHorizontalScroll({
    sectionRef,
    trackRef,
    cardSelector: ".project-card",
    onCardOpen: handleOpen,
    onCardClose: handleClose,
    enabled: isDesktop,
  });

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative overflow-hidden bg-base-950 py-20 md:py-0"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px" }}
        variants={staggerContainer}
        className="mx-auto mb-10 flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-end md:px-10 md:pt-24"
      >
        <div>
          <motion.span
            variants={fadeUp}
            className="mb-3 block text-xs font-medium uppercase tracking-widest text-accent-violet"
          >
            Our Portfolio
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl font-semibold text-text-primary sm:text-4xl"
          >
            Products We're Proud Of
          </motion.h2>
        </div>

        <motion.div variants={fadeUp}>
          <Button variant="ghost" className="whitespace-nowrap">
            View All Projects
            <FiArrowRight aria-hidden="true" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Desktop: pinned horizontal scroll track. Mobile: native horizontal swipe with scroll-snap, no pin-jacking. */}
      <div
        ref={trackRef}
        className={
          isDesktop
            ? "flex gap-6 px-6 will-change-transform md:px-10"
            : "flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [-webkit-overflow-scrolling:touch]"
        }
      >
        {PROJECTS.map((project) => (
          <div key={project.id} className={!isDesktop ? "snap-center" : ""}>
            <ProjectCard project={project} accentColor={project.accentColor} />
          </div>
        ))}
      </div>
    </section>
  );
}