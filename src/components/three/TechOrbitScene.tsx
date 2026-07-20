"use client";

import { Suspense, useCallback, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { OrbitNode } from "@/components/three/OrbitNode";
import { OrbitCenter } from "@/components/three/OrbitCenter";
import { OrbitParticles } from "@/components/three/OrbitParticles";
import { useOrbitRotation } from "@/hooks/use-orbit-rotation";
import { isLowPowerDevice } from "@/lib/utils";
import * as THREE from "three";
import {
  SiReact, SiDotnet, SiMongodb, SiDocker, SiPython, SiFlutter, SiNodedotjs,
} from "react-icons/si";

const TECHS = [
  { id: "react", icon: SiReact, label: "React", color: "#61DAFB" },
  { id: "dotnet", icon: SiDotnet, label: ".NET", color: "#8B6CFF" },
  { id: "mongodb", icon: SiMongodb, label: "MongoDB", color: "#4CD48A" },
  { id: "docker", icon: SiDocker, label: "Docker", color: "#3B7CF6" },
  { id: "python", icon: SiPython, label: "Python", color: "#F1C24C" },
  { id: "flutter", icon: SiFlutter, label: "Flutter", color: "#4CD8F1" },
  { id: "nodejs", icon: SiNodedotjs, label: "Node.js", color: "#6FCF6F" },
];

function RingGuide({ radius }: { radius: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const pulse = 0.2 + Math.sin(state.clock.elapsedTime * 0.9) * 0.08;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
      <meshBasicMaterial color="#6C4CF1" transparent opacity={0.25} />
    </mesh>
  );
}

function OrbitRing() {
  const { groupRef, paused } = useOrbitRotation({ speed: 0.1 });
  const radius = 3.3;

  const handleHoverChange = useCallback(
    (hovered: boolean) => {
      paused.current = hovered;
    },
    [paused]
  );

  return (
    <>
      <OrbitCenter />
      <OrbitParticles />

      <group ref={groupRef}>
        {TECHS.map((tech, i) => (
          <OrbitNode
            key={tech.id}
            icon={tech.icon}
            label={tech.label}
            angle={(i / TECHS.length) * Math.PI * 2}
            radius={radius}
            color={tech.color}
            onHoverChange={handleHoverChange}
          />
        ))}
      </group>

      <RingGuide radius={radius} />
    </>
  );
}

export function TechOrbitScene() {
  const lowPower = isLowPowerDevice();

  return (
    <Canvas
      dpr={lowPower ? 1 : 1.5}
      camera={{ position: [0, 5, 7], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
<ambientLight intensity={0.6} />

<directionalLight
  position={[5, 5, 5]}
  intensity={1.6}
  color="#ffffff"
/>

<pointLight
  position={[0, 0, 0]}
  intensity={18}
  distance={8}
  color="#7C5CFF"
/>

<pointLight
  position={[2, 2, 2]}
  intensity={5}
  distance={10}
  color="#4F7DFF"
/>

<spotLight
  position={[0, 5, 3]}
  intensity={3}
  angle={0.4}
  penumbra={1}
  color="#8B5CF6"
/>
      <Suspense fallback={null}>
        <OrbitRing />
      </Suspense>

      {!lowPower && (
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}