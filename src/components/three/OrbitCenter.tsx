"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/** The AI Core — glass shell, rotating inner hex, breathing glow. Replaces the flat "DN" square. */
export function OrbitCenter() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (innerRef.current) {
      innerRef.current.rotation.y += delta * 0.6;
      innerRef.current.rotation.x += delta * 0.2;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y -= delta * 0.15;
    }
    if (glowRef.current) {
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 1.4) * 0.5;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + pulse * 0.2;
      glowRef.current.scale.setScalar(1 + pulse * 0.08);
    }
  });

  return (
    <group>
      {/* Breathing outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#6C4CF1" transparent opacity={0.2} />
      </mesh>

      {/* Glass outer shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#6C4CF1"
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0.2}
          transmission={0.6}
          thickness={0.5}
        />
      </mesh>

      {/* Rotating inner hexagon core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#3B7CF6"
          emissive="#8B6CFF"
          emissiveIntensity={0.9}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      <Html center transform={false} occlude={false} style={{ pointerEvents: "none" }}>
        <div className="font-display text-sm font-bold text-white/90 drop-shadow-[0_0_8px_rgba(139,108,255,0.8)]">
          DN
        </div>
      </Html>
    </group>
  );
}