"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EarthModel } from "@/components/three/EarthModel";
import { isLowPowerDevice } from "@/lib/utils";

export function EarthScene() {
  const lowPower = isLowPowerDevice();

  return (
    <Canvas
      dpr={lowPower ? 1 : 1.5}
      camera={{ position: [0, 0, 4.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2, 3]} intensity={1.1} color="#6C4CF1" />
      <pointLight position={[-3, -1, 2]} intensity={0.6} color="#3B7CF6" />

      <Suspense fallback={null}>
        <EarthModel />
        <Stars radius={40} depth={20} count={lowPower ? 500 : 1500} factor={2} fade speed={0.3} />
      </Suspense>
    </Canvas>
  );
}