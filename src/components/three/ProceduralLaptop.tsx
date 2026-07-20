"use client";

import { forwardRef, useMemo } from "react";
import { useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

interface ProceduralLaptopProps {
  videoSrc?: string;
  accentColor?: string;
}

/**
 * Fully procedural laptop (base + hinged screen) — no GLB required.
 * The screen group is forwarded as a ref so GSAP can tween its rotation directly
 * (hinge closed = rotation.x ≈ -1.55, open = rotation.x ≈ -0.1).
 * Swap for a real GLB later (see LaptopModel.tsx pattern from CityModel.tsx) if you have one.
 */
export const ProceduralLaptop = forwardRef<THREE.Group, ProceduralLaptopProps>(
  ({ videoSrc, accentColor = "#6C4CF1" }, screenRef) => {
    const videoTexture = videoSrc ? useVideoTexture(videoSrc, { muted: true, loop: true, start: true }) : null;

    const bodyMaterial = useMemo(
      () => new THREE.MeshStandardMaterial({ color: "#10132A", metalness: 0.7, roughness: 0.3 }),
      []
    );

    return (
      <group>
        {/* Base */}
        <mesh position={[0, -0.05, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.1, 1.6]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>

        {/* Keyboard deck accent strip */}
        <mesh position={[0, 0.001, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.1, 1.3]} />
          <meshStandardMaterial color="#171B3A" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Hinged screen group — pivot sits at the back edge of the base */}
        <group ref={screenRef} position={[0, 0, -0.4]} rotation={[-1.55, 0, 0]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <boxGeometry args={[2.4, 1.5, 0.08]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          {/* Screen surface — video texture if provided, otherwise emissive brand glow */}
          <mesh position={[0, 0.75, 0.045]}>
            <planeGeometry args={[2.2, 1.3]} />
            {videoTexture ? (
              <meshBasicMaterial map={videoTexture} toneMapped={false} />
            ) : (
              <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.4} />
            )}
          </mesh>

          {/* Bezel glow line */}
          <mesh position={[0, 0.75, 0.046]}>
            <ringGeometry args={[1.35, 1.36, 4]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.3} />
          </mesh>
        </group>
      </group>
    );
  }
);

ProceduralLaptop.displayName = "ProceduralLaptop";