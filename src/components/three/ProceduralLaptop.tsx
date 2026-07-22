"use client";

import { forwardRef, useMemo } from "react";
import { useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

interface ProceduralLaptopProps {
  videoSrc?: string;
  accentColor?: string;

  /** Overall laptop scale */
  scale?: number;
}

/**
 * Fully procedural laptop (Base + Hinged Screen)
 *
 * Features
 * ✓ Fully procedural (No GLB required)
 * ✓ Video texture support
 * ✓ Custom accent color
 * ✓ Adjustable size using scale prop
 *
 * Example:
 *
 * <ProceduralLaptop
 *    ref={screenRef}
 *    videoSrc={project.videoSrc}
 *    accentColor={project.accentColor}
 *    scale={0.65}
 * />
 */
export const ProceduralLaptop = forwardRef<
  THREE.Group,
  ProceduralLaptopProps
>(
  (
    {
      videoSrc,
      accentColor = "#6C4CF1",
      scale = 0.65, // ↓ Change this to resize laptop
    },
    screenRef
  ) => {
    const videoTexture = videoSrc
      ? useVideoTexture(videoSrc, {
          muted: true,
          loop: true,
          start: true,
        })
      : null;

    const bodyMaterial = useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color: "#ECECEC",
          metalness: 0.7,
          roughness: 0.3,
        }),
      []
    );

    return (
      <group scale={scale}>
        {/* ================= Base ================= */}

        <mesh
          position={[0, -0.05, 0.4]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[2.4, 0.1, 1.6]} />
          <primitive
            object={bodyMaterial}
            attach="material"
          />
        </mesh>

        {/* Keyboard Deck */}

        <mesh
          position={[0, 0.001, 0.35]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[2.1, 1.3]} />
          <meshStandardMaterial
            color="#171B3A"
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>

        {/* ================= Screen Group ================= */}

        <group
          ref={screenRef}
          position={[0, 0, -0.4]}
          rotation={[-1.55, 0, 0]}
        >
          {/* Screen Body */}

          <mesh
            position={[0, 0.75, 0]}
            castShadow
          >
            <boxGeometry args={[2.4, 1.5, 0.08]} />
            <primitive
              object={bodyMaterial}
              attach="material"
            />
          </mesh>

          {/* Screen */}

          <mesh position={[0, 0.75, 0.045]}>
            <planeGeometry args={[2.2, 1.3]} />

            {videoTexture ? (
              <meshBasicMaterial
                map={videoTexture}
                toneMapped={false}
              />
            ) : (
              <meshStandardMaterial
                color={accentColor}
                emissive={accentColor}
                emissiveIntensity={0.4}
              />
            )}
          </mesh>

          {/* Screen Glow */}

          <mesh position={[0, 0.75, 0.046]}>
            <ringGeometry
              args={[1.35, 1.36, 4]}
            />
            <meshBasicMaterial
              color={accentColor}
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      </group>
    );
  }
);

ProceduralLaptop.displayName = "ProceduralLaptop";