"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";

interface OrbitNodeProps {
  icon: IconType;
  label: string;
  angle: number;
  radius: number;
  color: string;
  onHoverChange: (hovered: boolean) => void;
}

export function OrbitNode({ icon: Icon, label, angle, radius, color, onHoverChange }: OrbitNodeProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const bobOffset = useRef(Math.random() * Math.PI * 2);

  const basePosition: [number, number, number] = [
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * radius,
  ];

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(t * 0.8 + bobOffset.current) * 0.12;
      groupRef.current.rotation.y = Math.sin(t * 0.5 + bobOffset.current) * 0.15;
    }
  });

  function handleEnter() {
    setHovered(true);
    onHoverChange(true);
  }
  function handleLeave() {
    setHovered(false);
    onHoverChange(false);
  }

  return (
    <group position={basePosition}>
      <group ref={groupRef}>
        <mesh scale={hovered ? 1.2 : 1}>
          <boxGeometry args={[0.5, 0.5, 0.06]} />
          <meshStandardMaterial
            color="#10132A"
            emissive={color}
            emissiveIntensity={hovered ? 0.7 : 0.25}
            metalness={0.5}
            roughness={0.25}
          />
        </mesh>
        <mesh scale={hovered ? 1.2 : 1}>
          <boxGeometry args={[0.56, 0.56, 0.03]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={hovered ? 0.9 : 0.4} />
        </mesh>

        <Html center transform={false} occlude={false} style={{ pointerEvents: "auto" }}>
          <div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className="relative flex h-9 w-9 cursor-pointer flex-col items-center"
          >
            <motion.div
              animate={{ scale: hovered ? 1.25 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex h-9 w-9 items-center justify-center"
            >
              <Icon className="text-xl" style={{ color }} aria-hidden="true" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 4 : -4 }}
              transition={{ duration: 0.2 }}
              className="glass-panel absolute top-full mt-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-medium text-text-primary"
            >
              {label}
            </motion.span>
          </div>
        </Html>
      </group>

      {/* Energy beam to core on hover */}
      {hovered && (
        <Line
          points={[
            [0, 0, 0],
            [-basePosition[0], 0, -basePosition[2]],
          ]}
          color={color}
          lineWidth={1.5}
          transparent
          opacity={0.7}
        />
      )}
    </group>
  );
}