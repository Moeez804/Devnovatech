// "use client";

// import { useRef } from "react";
// import dynamic from "next/dynamic";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/Button";
// import { FloatingBadge } from "@/components/ui/FloatingBadge";
// import { useScrollCamera } from "@/hooks/use-scroll-camera";
// import { fadeUp, staggerContainer } from "@/styles/animations";
// import { FiArrowRight } from "react-icons/fi";
// import type * as THREE from "three";

// const CityScene = dynamic(
//   () => import("@/components/three/CityScene").then((m) => m.CityScene),
//   { ssr: false }
// );

// export function CityShowcase() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera>(null);
//   const progressRef = useScrollCamera({ triggerRef: sectionRef, cameraRef });

//   return (
//     <section
//       ref={sectionRef}
//       className="relative flex h-screen w-full items-center overflow-hidden bg-base-950"
//     >
//       <div className="absolute inset-0">
//         <CityScene progressRef={progressRef} />
//       </div>

//       {/* Gradient scrim so overlaid text stays readable over the bright skyline */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 bg-gradient-to-r from-base-950 via-base-950/40 to-transparent"
//       />

//       <div className="pointer-events-none absolute inset-0 hidden lg:block">
//         <FloatingBadge label="CLOUD" className="left-[14%] top-[28%]" delay={0.2} />
//         <FloatingBadge label="SECURITY" className="right-[32%] top-[18%]" delay={0.5} />
//         <FloatingBadge label="SOFTWARE" className="left-[6%] top-[58%]" delay={0.8} />
//         <FloatingBadge label="APPS" className="left-[38%] top-[68%]" delay={1.1} />
//       </div>

//       <motion.div
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-20% 0px" }}
//         variants={staggerContainer}
//         className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10"
//       >
//         <div className="ml-auto max-w-md text-right lg:text-left lg:pl-[55%]">
//           <motion.h2
//             variants={fadeUp}
//             className="font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl"
//           >
//             We Build Digital Experiences That Matter
//           </motion.h2>
//           <motion.p variants={fadeUp} className="mt-4 text-sm leading-relaxed text-text-muted">
//             From concept to deployment, we bring ideas to life with cutting-edge
//             technology and creative solutions.
//           </motion.p>
//           <motion.div variants={fadeUp} className="mt-6 flex justify-end lg:justify-start">
//             <Button variant="primary" showArrow>
//               Explore More
//               <FiArrowRight aria-hidden="true" />
//             </Button>
//           </motion.div>
//         </div>
//       </motion.div>
//     </section>
//   );
// }
"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useScrollCamera } from "@/hooks/use-scroll-camera";
import { fadeUp, staggerContainer } from "@/styles/animations";
import { FiArrowRight } from "react-icons/fi";
import type * as THREE from "three";

const CityScene = dynamic(
  () => import("@/components/three/CityScene").then((m) => m.CityScene),
  { ssr: false }
);

export function CityShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const progressRef = useScrollCamera({ triggerRef: sectionRef, cameraRef });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-base-950"
    >
      <div className="absolute inset-0">
        <CityScene progressRef={progressRef} />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          alignItems: "center",
          background:
            "linear-gradient(90deg, transparent 0%, transparent 35%, rgba(5,6,15,0.15) 55%, rgba(5,6,15,0.45) 72%, rgba(5,6,15,0.75) 100%)",
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20% 0px" }}
        variants={staggerContainer}
        className="relative z-10 flex w-full justify-end px-6 md:px-10 lg:px-24 xl:px-32"
      >
        <div className="w-full max-w-[33%] text-center lg:text-right">
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl"
          >
            We Build Digital Experiences That Matter
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-muted lg:mx-0 lg:ml-auto"
          >
            From concept to deployment, we bring ideas to life with cutting-edge
            technology and creative solutions.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-6 flex justify-center lg:justify-end">
            <Button variant="primary" showArrow>
              Explore More
              <FiArrowRight aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}