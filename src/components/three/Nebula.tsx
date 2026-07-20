"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered);
    float glow = smoothstep(0.5, 0.0, dist);
    float pulse = sin(uTime * 0.3) * 0.05 + 0.95;
    vec3 color = mix(uColorB, uColorA, glow) * glow * pulse;
    gl_FragColor = vec4(color, glow * 0.6);
  }
`;

/** Soft additive-blended radial gradient plane simulating a nebula glow behind the logo. */
export function Nebula() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#6C4CF1") },
      uColorB: { value: new THREE.Color("#05060F") },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -3]} scale={[9, 9, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}