"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/utils";

interface UseOrbitRotationOptions {
  speed?: number; // radians/sec
}

/** Continuously rotates a group ref around Y, slowing to a near-stop when `paused` (hover) is true. Runs entirely on the RAF loop — no React state, no re-renders. */
export function useOrbitRotation({ speed = 0.15 }: UseOrbitRotationOptions = {}) {
  const groupRef = useRef<THREE.Group>(null);
  const paused = useRef(false);
  const currentSpeed = useRef(prefersReducedMotion() ? 0 : speed);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const target = paused.current || prefersReducedMotion() ? 0 : speed;
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, target, 0.05);
    groupRef.current.rotation.y += currentSpeed.current * delta;
  });

  return { groupRef, paused };
}