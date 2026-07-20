"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural glowing wireframe-over-solid Earth — no texture/GLB asset required
 * (same zero-asset-risk approach used throughout: city, laptop, astronaut).
 * A stylized "digital globe" reads well against the dark theme and needs no
 * external equirectangular map to go missing at build/runtime.
 */
export function EarthModel() {
  const groupRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  const dotPositions = useMemo(() => {
    // Scatter "city light" dots across the sphere surface using fibonacci distribution
    const count = 180;
    const positions: [number, number, number][] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      positions.push([x * 1.52, y * 1.52, z * 1.52]);
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Solid core sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshStandardMaterial
          color="#10132A"
          metalness={0.3}
          roughness={0.7}
          emissive="#3B7CF6"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Wireframe lat/long shell, counter-rotating for a parallax "data grid" feel */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.52, 24, 24]} />
        <meshBasicMaterial color="#6C4CF1" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.65, 32, 32]} />
        <meshBasicMaterial color="#4CD8F1" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      {/* City-light dots */}
      {dotPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshBasicMaterial color="#8B6CFF" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}