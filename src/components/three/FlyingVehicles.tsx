"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface VehiclePath {
  radius: number;
  height: number;
  speed: number;
  offset: number;
  tilt: number;
}

interface FlyingVehiclesProps {
  count?: number;
  isDrone?: boolean; // drones: smaller, slower, more vertical bob; cars: faster, flatter orbit
}

/** Instanced flying cars / hovering drones on circular paths around the city, computed per-frame via useFrame (no per-instance React state). */
export function FlyingVehicles({ count = 12, isDrone = false }: FlyingVehiclesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const paths: VehiclePath[] = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        radius: isDrone ? 6 + Math.random() * 14 : 10 + Math.random() * 16,
        height: isDrone ? 4 + Math.random() * 10 : 2 + Math.random() * 3,
        speed: isDrone ? 0.15 + Math.random() * 0.15 : 0.35 + Math.random() * 0.25,
        offset: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 0.3,
      })),
    [count, isDrone]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    paths.forEach((p, i) => {
      const angle = t * p.speed + p.offset;
      const x = Math.cos(angle) * p.radius;
      const z = Math.sin(angle) * p.radius;
      const bob = isDrone ? Math.sin(t * 1.5 + p.offset) * 0.4 : 0;

      dummy.position.set(x, p.height + bob, z);
      dummy.rotation.y = -angle + Math.PI / 2;
      dummy.rotation.z = p.tilt;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {isDrone ? (
        <sphereGeometry args={[0.12, 8, 8]} />
      ) : (
        <boxGeometry args={[0.5, 0.15, 0.25]} />
      )}
      <meshStandardMaterial
        color={isDrone ? "#4CD8F1" : "#8B6CFF"}
        emissive={isDrone ? "#4CD8F1" : "#6C4CF1"}
        emissiveIntensity={1.2}
        toneMapped={false}
      />
    </instancedMesh>
  );
}