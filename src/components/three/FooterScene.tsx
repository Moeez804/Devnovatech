"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { FooterParticles } from "@/components/three/FooterParticles";
import { isLowPowerDevice } from "@/lib/utils";

export function FooterScene() {
  const lowPower = isLowPowerDevice();

  return (
    <Canvas
      dpr={lowPower ? 1 : 1.5}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <FooterParticles count={lowPower ? 100 : 250} />
      </Suspense>
    </Canvas>
  );
}