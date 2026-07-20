"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Ambient drifting dust around the core — cheap, single draw call. */
export function OrbitParticles({ count = 60 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2;
      arr[i * 3] = Math.cos(theta) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#8B6CFF" size={0.03} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}