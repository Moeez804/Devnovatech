"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * Fully procedural low-poly astronaut — no GLB required (same zero-asset-risk
 * approach as ProceduralBuildings/ProceduralLaptop). Built from primitives so
 * this module compiles and runs with no external files.
 * Swap for a real GLB later following the same pattern as CityModel.tsx if desired.
 */
export function AstronautModel() {
  const groupRef = useRef<THREE.Group>(null);
  const armLRef = useRef<THREE.Mesh>(null);
  const armRRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const reduced = prefersReducedMotion();

    // Gentle zero-gravity drift + slow spin
    groupRef.current.position.y = reduced ? 0 : Math.sin(t * 0.6) * 0.15;
    groupRef.current.rotation.y = reduced ? 0 : t * 0.2;
    groupRef.current.rotation.z = reduced ? 0 : Math.sin(t * 0.4) * 0.05;

    // Subtle independent arm sway to sell the "floating" feel
    if (armLRef.current && !reduced) {
      armLRef.current.rotation.z = 0.3 + Math.sin(t * 0.8) * 0.08;
    }
    if (armRRef.current && !reduced) {
      armRRef.current.rotation.z = -0.3 - Math.sin(t * 0.8 + 1) * 0.08;
    }
  });

  const suitMaterial = { color: "#E8E9F0", metalness: 0.1, roughness: 0.6 };
  const accentMaterial = { color: "#6C4CF1", emissive: "#6C4CF1", emissiveIntensity: 0.5 };
  const visorMaterial = { color: "#0A0C1B", metalness: 0.9, roughness: 0.1 };

  return (
    <group ref={groupRef}>
      {/* Torso */}
      <mesh position={[0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.55, 0.7, 8, 16]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>

      {/* Chest panel accent */}
      <mesh position={[0, 0.05, 0.5]}>
        <boxGeometry args={[0.35, 0.35, 0.06]} />
        <meshStandardMaterial {...accentMaterial} />
      </mesh>

      {/* Helmet */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 0.85, 0.28]}>
        <sphereGeometry args={[0.3, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial {...visorMaterial} />
      </mesh>

      {/* Visor glow reflection */}
      <mesh position={[0.08, 0.95, 0.45]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#8B6CFF" transparent opacity={0.6} />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 0, -0.45]}>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color="#171B3A" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Backpack thruster glow */}
      <mesh position={[0, -0.35, -0.5]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 12]} />
        <meshBasicMaterial color="#4CD8F1" transparent opacity={0.7} />
      </mesh>

      {/* Left arm */}
      <mesh ref={armLRef} position={[-0.6, 0.15, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.16, 0.55, 6, 12]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>

      {/* Right arm */}
      <mesh ref={armRRef} position={[0.6, 0.15, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.16, 0.55, 6, 12]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.22, -0.75, 0]} rotation={[0.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.5, 6, 12]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.22, -0.75, 0]} rotation={[-0.1, 0, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.5, 6, 12]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
    </group>
  );
}