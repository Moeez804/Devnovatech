"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { AstronautModel } from "@/components/three/AstronautModel";
import { isLowPowerDevice } from "@/lib/utils";

export function AstronautScene() {
  const lowPower = isLowPowerDevice();

  return (
    <Canvas
      dpr={lowPower ? 1 : 1.5}
      camera={{ position: [0, 0, 4.2], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#6C4CF1" />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#3B7CF6" />
      <directionalLight position={[0, 5, 5]} intensity={0.4} />

      <Suspense fallback={null}>
        <AstronautModel />
        <Sparkles
          count={lowPower ? 20 : 60}
          scale={5}
          size={1.5}
          speed={0.2}
          color="#8B6CFF"
          opacity={0.5}
        />
      </Suspense>
    </Canvas>
  );
}