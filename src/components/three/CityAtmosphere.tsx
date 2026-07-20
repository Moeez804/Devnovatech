"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Drifting particle haze + fog to sell scale/depth in the city scene. */
export function CityAtmosphere() {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 400;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = Math.random() * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#101A3B", 35, 95]} />

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
<pointsMaterial
  color="#8FB4FF"
  size={0.08}
  transparent
  opacity={0.8}
  depthWrite={false}
  blending={THREE.AdditiveBlending}
/>
      </points>
    </>
  );
}