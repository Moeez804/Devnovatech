"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Sparkles, PerformanceMonitor } from "@react-three/drei";
import { Nebula } from "@/components/three/Nebula";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { isLowPowerDevice } from "@/lib/utils";
import { useState } from "react";

/** Root R3F canvas for the hero — isolated so Suspense/DPR/perf logic stays contained. */
export function HeroScene() {
  const pointer = useMouseParallax();
  const [dpr, setDpr] = useState(isLowPowerDevice() ? 1 : 1.5);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(isLowPowerDevice() ? 1 : 1.75)}
      />

      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 4]} intensity={1.2} color="#6C4CF1" />
      <pointLight position={[-3, -2, 3]} intensity={0.8} color="#3B7CF6" />

      <Suspense fallback={null}>
        <Nebula />

        <Stars
          radius={60}
          depth={40}
          count={isLowPowerDevice() ? 1200 : 3500}
          factor={3}
          fade
          speed={0.4}
        />

        <Sparkles
          count={isLowPowerDevice() ? 40 : 100}
          scale={6}
          size={2}
          speed={0.3}
          color="#8B6CFF"
          opacity={0.6}
        />

        
      </Suspense>
    </Canvas>
  );
}