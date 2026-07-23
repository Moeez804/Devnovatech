"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, MeshReflectorMaterial } from "@react-three/drei";
import { LaptopModel, type LaptopModelHandle } from "@/components/three/LaptopModel";
import { isLowPowerDevice } from "@/lib/utils";

interface LaptopCard3DProps {
  videoSrc?: string;
  accentColor?: string;
  screenGroupRef: React.RefObject<LaptopModelHandle | null>;
}

export function LaptopCard3D({ videoSrc, accentColor = "#6C4CF1", screenGroupRef }: LaptopCard3DProps) {
  const lowPower = isLowPowerDevice();

  return (
    <Canvas
      dpr={lowPower ? 1 : 1.5}
      camera={{ position: [0, 0.18, 0.62], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
      shadows={!lowPower}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[0.7, 0.9, 0.6]} intensity={1.4} color={accentColor} castShadow={!lowPower} />
      <pointLight position={[-0.7, 0.5, -0.3]} intensity={0.7} color="#3B7CF6" />
      <spotLight position={[0, 1.2, 0.4]} intensity={0.7} angle={0.5} penumbra={1} color="#FFFFFF" />

      <Suspense fallback={null}>
        <LaptopModel ref={screenGroupRef} videoSrc={videoSrc} accentColor={accentColor} scale={0.65} />

        {/* {!lowPower && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
            <planeGeometry args={[1.8, 1.8]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={512}
              mixBlur={1}
              mixStrength={2}
              roughness={0.9}
              depthScale={0.3}
              minDepthThreshold={0.9}
              color="#050608"
              metalness={0.4}
            />
          </mesh>
        )} */}

        <ContactShadows position={[0, -0.02, 0]} opacity={0.5} scale={1.5} blur={2} far={0.35} />
        <Environment preset="city" environmentIntensity={0.3} />
      </Suspense>
    </Canvas>
  );
}