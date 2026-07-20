// src/components/three/SceneBadge.tsx
"use client";

import { Html, Line } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

interface SceneBadgeProps {
  label: string;
  anchor: [number, number, number]; // rooftop point the line connects FROM
  height?: number; // vertical distance the line rises before the label
  delay?: number;
}

/** A badge connected to a real rooftop point via a thin 3D leader-line, matching the reference's connector-line style. */
export function SceneBadge({ label, anchor, height = 60, delay = 0 }: SceneBadgeProps) {
  const labelPosition: [number, number, number] = [anchor[0], anchor[1] + height, anchor[2]];

  return (
    <group>
      {/* Thin connector line from rooftop up to the label */}
      <Line
        points={[anchor, labelPosition]}
        color="#8B6CFF"
        lineWidth={1}
        transparent
        opacity={0.5}
      />

      {/* Small glowing dot at the rooftop anchor point */}
      <mesh position={anchor}>
        <sphereGeometry args={[3, 8, 8]} />
        <meshBasicMaterial color="#8B6CFF" toneMapped={false} />
      </mesh>

      {/* Label itself, floating at the top of the line */}
      <Html position={labelPosition} center occlude={false} style={{ pointerEvents: "none" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, -4, 0] }}
          transition={{
            opacity: { duration: 0.5, delay },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
          }}
          className="glass-panel whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-medium tracking-wide text-text-primary shadow-glow-sm"
        >
          {label}
        </motion.div>
      </Html>
    </group>
  );
}