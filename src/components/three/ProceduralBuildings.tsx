"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ProceduralBuildingsProps {
  count?: number;
  radius?: number;
}

export function ProceduralBuildings({ count = 220, radius = 26 }: ProceduralBuildingsProps) {
  const buildingsRef = useRef<THREE.InstancedMesh>(null);
  const windowsRef = useRef<THREE.InstancedMesh>(null);

  const { buildingMatrices, windowData } = useMemo(() => {
    const buildingMatrices: THREE.Matrix4[] = [];
    const windowData: { matrix: THREE.Matrix4; flicker: number }[] = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * radius;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      const heightFalloff = 1 - dist / radius;
      const height = 2 + Math.random() * 14 * Math.max(0.2, heightFalloff);
      const width = 0.8 + Math.random() * 1.4;

      dummy.position.set(x, height / 2, z);
      dummy.scale.set(width, height, width);
      dummy.rotation.y = Math.random() * Math.PI * 0.1;
      dummy.updateMatrix();
      buildingMatrices.push(dummy.matrix.clone());

      const windowCount = Math.floor(height * 1.5);
      for (let w = 0; w < windowCount; w++) {
        const wy = Math.random() * height - height / 2 + height / 2;
        const side = Math.floor(Math.random() * 4);
        const offset = width / 2 + 0.01;
        const wx = side === 0 ? offset : side === 1 ? -offset : (Math.random() - 0.5) * width;
        const wz = side === 2 ? offset : side === 3 ? -offset : (Math.random() - 0.5) * width;

        dummy.position.set(x + wx, wy, z + wz);
        dummy.scale.set(0.08, 0.08, 0.08);
        dummy.rotation.y = 0;
        dummy.updateMatrix();
        windowData.push({ matrix: dummy.matrix.clone(), flicker: Math.random() });
      }
    }

    return { buildingMatrices, windowData };
  }, [count, radius]);

  // FIX: useEffect runs AFTER mount, once refs are actually attached — useMemo ran too early and silently did nothing.
  useEffect(() => {
    if (buildingsRef.current) {
      buildingMatrices.forEach((m, i) => buildingsRef.current!.setMatrixAt(i, m));
      buildingsRef.current.instanceMatrix.needsUpdate = true;
    }
    if (windowsRef.current) {
      windowData.forEach((w, i) => windowsRef.current!.setMatrixAt(i, w.matrix));
      windowsRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [buildingMatrices, windowData]);

  useFrame((state) => {
    if (!windowsRef.current) return;
    const t = state.clock.elapsedTime;
    const color = new THREE.Color();
    windowData.forEach((w, i) => {
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.6 + w.flicker * 20);
      color.setRGB(0.4 + pulse * 0.6, 0.3 + pulse * 0.4, 1);
      windowsRef.current!.setColorAt(i, color);
    });
    if (windowsRef.current.instanceColor) {
      windowsRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={buildingsRef} args={[undefined, undefined, count]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#10132A" metalness={0.6} roughness={0.4} />
      </instancedMesh>

      <instancedMesh ref={windowsRef} args={[undefined, undefined, windowData.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[radius + 4, 48]} />
        <meshStandardMaterial color="#05060F" metalness={0.3} roughness={0.8} />
      </mesh>
    </group>
  );
}