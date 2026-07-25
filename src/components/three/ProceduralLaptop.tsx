// "use client";

// import { forwardRef, useMemo } from "react";
// import { useVideoTexture } from "@react-three/drei";
// import * as THREE from "three";

// interface ProceduralLaptopProps {
//   videoSrc?: string;
//   accentColor?: string;

//   /** Overall laptop scale */
//   scale?: number;
// }

// /**
//  * Fully procedural laptop (Base + Hinged Screen)
//  *
//  * Features
//  * ✓ Fully procedural (No GLB required)
//  * ✓ Video texture support
//  * ✓ Custom accent color
//  * ✓ Adjustable size using scale prop
//  *
//  * Example:
//  *
//  * <ProceduralLaptop
//  *    ref={screenRef}
//  *    videoSrc={project.videoSrc}
//  *    accentColor={project.accentColor}
//  *    scale={0.65}
//  * />
//  */
// export const ProceduralLaptop = forwardRef<
//   THREE.Group,
//   ProceduralLaptopProps
// >(
//   (
//     {
//       videoSrc,
//       accentColor = "#6C4CF1",
//       scale = 0.65, // ↓ Change this to resize laptop
//     },
//     screenRef
//   ) => {
//     const videoTexture = videoSrc
//       ? useVideoTexture(videoSrc, {
//           muted: true,
//           loop: true,
//           start: true,
//         })
//       : null;

//     const bodyMaterial = useMemo(
//       () =>
//         new THREE.MeshStandardMaterial({
//           color: "#ECECEC",
//           metalness: 0.7,
//           roughness: 0.3,
//         }),
//       []
//     );

//     return (
//       <group scale={scale}>
//         {/* ================= Base ================= */}

//         <mesh
//           position={[0, -0.05, 0.4]}
//           castShadow
//           receiveShadow
//         >
//           <boxGeometry args={[2.4, 0.1, 1.6]} />
//           <primitive
//             object={bodyMaterial}
//             attach="material"
//           />
//         </mesh>

//         {/* Keyboard Deck */}

//         <mesh
//           position={[0, 0.001, 0.35]}
//           rotation={[-Math.PI / 2, 0, 0]}
//         >
//           <planeGeometry args={[2.1, 1.3]} />
//           <meshStandardMaterial
//             color="#171B3A"
//             metalness={0.5}
//             roughness={0.4}
//           />
//         </mesh>

//         {/* ================= Screen Group ================= */}

//         <group
//           ref={screenRef}
//           position={[0, 0, -0.4]}
//           rotation={[-1.55, 0, 0]}
//         >
//           {/* Screen Body */}

//           <mesh
//             position={[0, 0.75, 0]}
//             castShadow
//           >
//             <boxGeometry args={[2.4, 1.5, 0.08]} />
//             <primitive
//               object={bodyMaterial}
//               attach="material"
//             />
//           </mesh>

//           {/* Screen */}

//           <mesh position={[0, 0.75, 0.045]}>
//             <planeGeometry args={[2.2, 1.3]} />

//             {videoTexture ? (
//               <meshBasicMaterial
//                 map={videoTexture}
//                 toneMapped={false}
//               />
//             ) : (
//               <meshStandardMaterial
//                 color={accentColor}
//                 emissive={accentColor}
//                 emissiveIntensity={0.4}
//               />
//             )}
//           </mesh>

//           {/* Screen Glow */}

//           <mesh position={[0, 0.75, 0.046]}>
//             <ringGeometry
//               args={[1.35, 1.36, 4]}
//             />
//             <meshBasicMaterial
//               color={accentColor}
//               transparent
//               opacity={0.3}
//             />
//           </mesh>
//         </group>
//       </group>
//     );
//   }
// );

// ProceduralLaptop.displayName = "ProceduralLaptop";
"use client";

import { forwardRef, useMemo, useRef, useState, useEffect } from "react";
import { useVideoTexture, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ProceduralLaptopProps {
  videoSrc?: string;
  accentColor?: string;
  scale?: number;
  keyboardBacklight?: boolean;
}

export const ProceduralLaptop = forwardRef<THREE.Group, ProceduralLaptopProps>(
  ({ 
    videoSrc, 
    accentColor = "#6C4CF1", 
    scale = 0.65,
    keyboardBacklight = true 
  }, screenRef) => {
    
    // ========== PREMIUM MATERIALS ==========
    const chassisMaterial = useMemo(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: "#E8E9ED",
          metalness: 0.95,
          roughness: 0.15,
          clearcoat: 0.9,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.8,
          reflectivity: 0.95,
        }),
      []
    );

    const darkChassisMaterial = useMemo(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: "#1A1A2E",
          metalness: 0.9,
          roughness: 0.2,
          clearcoat: 0.7,
          clearcoatRoughness: 0.15,
          envMapIntensity: 1.5,
        }),
      []
    );

    const deckMaterial = useMemo(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: "#141624",
          metalness: 0.8,
          roughness: 0.3,
          clearcoat: 0.5,
          clearcoatRoughness: 0.2,
        }),
      []
    );

    const bezelMaterial = useMemo(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: "#0A0B14",
          metalness: 0.6,
          roughness: 0.3,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
        }),
      []
    );

    const trackpadMaterial = useMemo(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: "#2A2D42",
          metalness: 0.6,
          roughness: 0.15,
          clearcoat: 0.9,
          clearcoatRoughness: 0.05,
          envMapIntensity: 1.5,
        }),
      []
    );

    const hingeMaterial = useMemo(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: "#C8C9CE",
          metalness: 1.0,
          roughness: 0.1,
          envMapIntensity: 2.0,
        }),
      []
    );

    // ========== BIGGER KEYBOARD LAYOUT ==========
    const keyboardKeys = useMemo(() => {
      interface KeyboardKey {
        x: number;
        y: number;
        width: number;
        depth: number;
        label?: string;
        isSpacebar?: boolean;
      }

      const keys: KeyboardKey[] = [];
      
      // Row 1: Numbers (BIGGER KEYS)
      const row1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
      const row1Width = 0.09; // 🔥 Bigger keys
      const startX1 = -(row1.length * row1Width) / 2 + row1Width / 2;
      row1.forEach((label, i) => {
        keys.push({
          x: startX1 + i * row1Width,
          y: 0.22,
          width: row1Width,
          depth: 0.09,
          label,
        });
      });

      // Row 2: QWERTY (BIGGER KEYS)
      const row2 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
      const row2Width = 0.09;
      const startX2 = -(row2.length * row2Width) / 2 + row2Width / 2;
      row2.forEach((label, i) => {
        keys.push({
          x: startX2 + i * row2Width,
          y: 0.13,
          width: row2Width,
          depth: 0.09,
          label,
        });
      });

      // Row 3: ASDF (BIGGER KEYS)
      const row3 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
      const row3Width = 0.09;
      const startX3 = -(row3.length * row3Width) / 2 + row3Width / 2;
      row3.forEach((label, i) => {
        keys.push({
          x: startX3 + i * row3Width,
          y: 0.04,
          width: row3Width,
          depth: 0.09,
          label,
        });
      });

      // Row 4: ZXCV (BIGGER KEYS)
      const row4 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
      const row4Width = 0.09;
      const startX4 = -(row4.length * row4Width) / 2 + row4Width / 2;
      row4.forEach((label, i) => {
        keys.push({
          x: startX4 + i * row4Width,
          y: -0.05,
          width: row4Width,
          depth: 0.09,
          label,
        });
      });

      // Row 5: Spacebar row
      const row5 = ['⌘', '⌥', 'Space', '⌥', '⌘'];
      const spaceWidth = 0.35;
      const smallWidth = 0.08;
      const totalWidth = smallWidth * 2 + spaceWidth + smallWidth * 2;
      const startX5 = -totalWidth / 2 + smallWidth / 2;
      
      row5.forEach((label, i) => {
        let width = smallWidth;
        if (label === 'Space') width = spaceWidth;
        keys.push({
          x: startX5 + (i === 0 ? 0 : i === 1 ? smallWidth : i === 2 ? smallWidth + smallWidth / 2 : i === 3 ? smallWidth + smallWidth / 2 + spaceWidth : smallWidth * 2 + spaceWidth + smallWidth / 2),
          y: -0.14,
          width,
          depth: 0.09,
          label,
          isSpacebar: label === 'Space',
        });
      });

      return keys;
    }, []);

    // ========== SPEAKER GRILLE ==========
    const speakerDots = useMemo(() => {
      const dots: Array<{ x: number; z: number; size: number }> = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 14; col++) {
          dots.push({
            x: -0.8 + col * 0.025,
            z: 0.72 + row * 0.025,
            size: 0.005 + Math.random() * 0.003,
          });
        }
      }
      return dots;
    }, []);

    // Screen glow animation
    const glowRef = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
      if (glowRef.current) {
        const mat = glowRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.2 + Math.sin(clock.elapsedTime * 0.5 + 1) * 0.05;
      }
    });

    return (
      <group scale={scale}>
        {/* ========== SLIM BASE CHASSIS ========== */}
        <RoundedBox
          args={[2.4, 0.08, 1.6]}
          radius={0.06}
          smoothness={8}
          position={[0, -0.04, 0.4]}
          castShadow
          receiveShadow
        >
          <primitive object={chassisMaterial} attach="material" />
        </RoundedBox>

        <RoundedBox
          args={[2.36, 0.01, 1.56]}
          radius={0.05}
          smoothness={6}
          position={[0, -0.075, 0.4]}
        >
          <meshPhysicalMaterial color="#1A1A2A" metalness={0.6} roughness={0.8} />
        </RoundedBox>

        {/* ========== KEYBOARD DECK ========== */}
        <RoundedBox
          args={[2.28, 0.01, 1.42]}
          radius={0.04}
          smoothness={8}
          position={[0, 0.005, 0.36]}
        >
          <primitive object={deckMaterial} attach="material" />
        </RoundedBox>

        {/* Keyboard base - Dark area */}
        <RoundedBox
          args={[2.0, 0.006, 0.7]}
          radius={0.02}
          smoothness={6}
          position={[0, 0.012, 0.06]}
        >
          <meshPhysicalMaterial color="#0A0B12" metalness={0.5} roughness={0.7} />
        </RoundedBox>

        {/* ========== INDIVIDUAL KEYS - BIGGER & VISIBLE ========== */}
        {keyboardKeys.map((key, i) => {
          const isSpacebar = key.isSpacebar || false;
          const keyColor = isSpacebar ? "#1A1B2A" : "#222438";
          
          return (
            <group key={i}>
              {/* Key cap */}
              <RoundedBox
                args={[key.width, 0.01, key.depth]}
                radius={0.005}
                smoothness={4}
                position={[key.x, 0.02, key.y]}
              >
                <meshPhysicalMaterial
                  color={keyColor}
                  metalness={0.3}
                  roughness={0.5}
                  clearcoat={0.3}
                  emissive={keyboardBacklight && !isSpacebar ? accentColor : "#000000"}
                  emissiveIntensity={keyboardBacklight && !isSpacebar ? 0.08 : 0}
                />
              </RoundedBox>
              
              {/* Key top highlight */}
              <mesh position={[key.x, 0.025, key.y]}>
                <planeGeometry args={[key.width * 0.7, key.depth * 0.7]} />
                <meshBasicMaterial 
                  color="#ffffff" 
                  transparent 
                  opacity={0.03}
                />
              </mesh>
            </group>
          );
        })}

        {/* ========== TRACKPAD ========== */}
        <RoundedBox
          args={[0.6, 0.004, 0.4]}
          radius={0.04}
          smoothness={8}
          position={[0, 0.014, 0.78]}
        >
          <primitive object={trackpadMaterial} attach="material" />
        </RoundedBox>
        
        <mesh position={[0, 0.016, 0.78]}>
          <planeGeometry args={[0.58, 0.38]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.03} />
        </mesh>

        {/* ========== SPEAKER GRILLES ========== */}
        <group>
          {speakerDots.map((dot, i) => (
            <mesh 
              key={`l-${i}`} 
              position={[dot.x, 0.014, dot.z]} 
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[dot.size, 6]} />
              <meshPhysicalMaterial color="#050508" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>

        <group>
          {speakerDots.map((dot, i) => (
            <mesh 
              key={`r-${i}`} 
              position={[-dot.x, 0.014, dot.z]} 
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[dot.size, 6]} />
              <meshPhysicalMaterial color="#050508" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* ========== HINGE ========== */}
        <group position={[0, 0.0, -0.4]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.03, 2.28, 24]} />
            <primitive object={hingeMaterial} attach="material" />
          </mesh>
          
          {[-0.9, -0.45, 0.45, 0.9].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.025, 0.04, 24]} />
              <meshPhysicalMaterial 
                color={accentColor} 
                metalness={0.95}
                roughness={0.1}
                emissive={accentColor}
                emissiveIntensity={0.1}
              />
            </mesh>
          ))}
        </group>

        {/* ========== SCREEN GROUP ========== */}
        <group 
          ref={screenRef} 
          position={[0, 0, -0.4]} 
          rotation={[-1.55, 0, 0]}
        >
          {/* Lid back shell */}
          <RoundedBox
            args={[2.4, 1.5, 0.04]}
            radius={0.06}
            smoothness={8}
            position={[0, 0.75, -0.005]}
            castShadow
          >
            <primitive object={darkChassisMaterial} attach="material" />
          </RoundedBox>

          {/* Logo */}
          <group position={[0, 0.75, -0.025]}>
            <mesh rotation={[0, Math.PI, 0]}>
              <circleGeometry args={[0.16, 48]} />
              <meshBasicMaterial color={accentColor} transparent opacity={0.1} />
            </mesh>
            <mesh rotation={[0, Math.PI, 0]}>
              <circleGeometry args={[0.08, 48]} />
              <meshPhysicalMaterial
                color={accentColor}
                metalness={0.9}
                roughness={0.1}
                emissive={accentColor}
                emissiveIntensity={1.5}
                clearcoat={1.0}
                toneMapped={false}
              />
            </mesh>
            <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.001]}>
              <ringGeometry args={[0.04, 0.055, 48]} />
              <meshPhysicalMaterial
                color="#FFFFFF"
                metalness={0.5}
                roughness={0.2}
                emissive="#FFFFFF"
                emissiveIntensity={0.5}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>

          {/* Bezel */}
          <RoundedBox
            args={[2.22, 1.34, 0.012]}
            radius={0.04}
            smoothness={8}
            position={[0, 0.75, 0.038]}
          >
            <primitive object={bezelMaterial} attach="material" />
          </RoundedBox>

          {/* Screen */}
          {videoSrc ? (
            <VideoScreenFixed videoSrc={videoSrc} accentColor={accentColor} />
          ) : (
            <mesh position={[0, 0.75, 0.052]}>
              <planeGeometry args={[2.14, 1.26]} />
              <meshPhysicalMaterial
                color={accentColor}
                emissive={accentColor}
                emissiveIntensity={0.5}
                transparent
                opacity={0.95}
              />
            </mesh>
          )}

          {/* Screen Effects */}
          <group position={[0, 0.75, 0]}>
            <mesh position={[0, -0.64, 0.05]}>
              <planeGeometry args={[1.8, 0.012]} />
              <meshPhysicalMaterial
                color={accentColor}
                metalness={0.9}
                roughness={0.1}
                emissive={accentColor}
                emissiveIntensity={2}
                transparent
                opacity={0.7}
              />
            </mesh>

            <mesh ref={glowRef} position={[0, 0, 0.035]}>
              <ringGeometry args={[1.28, 1.32, 64]} />
              <meshBasicMaterial 
                color={accentColor} 
                transparent 
                opacity={0.12}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          <mesh position={[0, 0.75, 0.054]}>
            <planeGeometry args={[2.14, 1.26]} />
            <meshPhysicalMaterial 
              color="#FFFFFF" 
              transparent 
              opacity={0.01}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    );
  }
);

ProceduralLaptop.displayName = "ProceduralLaptop";

/**
 * VideoScreen with mobile support
 */
function VideoScreenFixed({ videoSrc, accentColor }: { videoSrc: string; accentColor: string }) {
  const [videoError, setVideoError] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const videoTexture = useVideoTexture(videoSrc, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: 'anonymous',
    playsInline: true, // 🔥 Mobile support
  });

  useEffect(() => {
    if (videoTexture && videoTexture.image) {
      const video = videoTexture.image as HTMLVideoElement;
      video.playsInline = true; // 🔥 Mobile support
      video.play().catch(() => setVideoError(true));
    }
  }, [videoTexture]);

  useFrame(({ clock }) => {
    if (meshRef.current && !videoError) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.97 + Math.sin(clock.elapsedTime * 0.8 + 1) * 0.015;
    }
    
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + Math.sin(clock.elapsedTime * 0.6) * 0.02;
    }
  });

  if (videoError || !videoTexture) {
    return (
      <mesh position={[0, 0.75, 0.052]}>
        <planeGeometry args={[2.14, 1.26]} />
        <meshPhysicalMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.95}
        />
      </mesh>
    );
  }

  return (
    <>
      <mesh ref={meshRef} position={[0, 0.75, 0.052]}>
        <planeGeometry args={[2.14, 1.26]} />
        <meshBasicMaterial map={videoTexture} toneMapped={false} transparent opacity={1} />
      </mesh>

      <mesh ref={glowRef} position={[0, 0.75, 0.05]}>
        <planeGeometry args={[2.14, 1.26]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.04} />
      </mesh>
    </>
  );
}