"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { ProceduralLaptop } from "@/components/three/ProceduralLaptop";
import { isLowPowerDevice } from "@/lib/utils";

interface LaptopCard3DProps {
  videoSrc?: string;
  accentColor?: string;
  screenGroupRef: React.RefObject<THREE.Group | null>;
}

/** Isolated per-card canvas — kept small/cheap since many of these mount at once in the horizontal track. */
export function LaptopCard3D({ videoSrc, accentColor, screenGroupRef }: LaptopCard3DProps) {
  const lowPower = isLowPowerDevice();

  return (
    <Canvas
      dpr={lowPower ? 1 : 1.5}
      camera={{ position: [0, 1.4, 3.2], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 3, 2]} intensity={1} color={accentColor} />
      <pointLight position={[-2, 1, -2]} intensity={0.5} color="#3B7CF6" />

      <Suspense fallback={null}>
        <ProceduralLaptop ref={screenGroupRef} videoSrc={videoSrc} accentColor={accentColor} />
      </Suspense>
    </Canvas>
  );
}