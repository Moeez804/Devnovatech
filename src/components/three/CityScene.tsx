// "use client";

// import { Suspense, useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
// import * as THREE from "three";
// import { ProceduralBuildings } from "@/components/three/ProceduralBuildings";
// import { FlyingVehicles } from "@/components/three/FlyingVehicles";
// import { CityAtmosphere } from "@/components/three/CityAtmosphere";
// import { isLowPowerDevice } from "@/lib/utils";

// interface CityCameraRigProps {
//   progressRef: React.MutableRefObject<number>;
// }

// /** Moves the camera along a fly-through path each frame, reading scroll progress from a ref (no re-renders). */
// function CityCameraRig({ progressRef }: CityCameraRigProps) {
//   const cameraTarget = useRef(new THREE.Vector3(0, 4, 0));

//   useFrame(({ camera }) => {
//     const p = progressRef.current;

//     // Path: start high/far, sweep down and around through the skyline, end close and low
//     const angle = p * Math.PI * 1.4;
//     const radius = 22 - p * 12;
//     const height = 14 - p * 10;

//     camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.cos(angle) * radius, 0.08);
//     camera.position.z = THREE.MathUtils.lerp(camera.position.z, Math.sin(angle) * radius, 0.08);
//     camera.position.y = THREE.MathUtils.lerp(camera.position.y, height, 0.08);
//     camera.lookAt(cameraTarget.current);
//   });

//   return null;
// }

// interface CitySceneProps {
//   progressRef: React.MutableRefObject<number>;
// }

// export function CityScene({ progressRef }: CitySceneProps) {
//   const lowPower = isLowPowerDevice();

//   return (
//     <Canvas
//       dpr={lowPower ? 1 : 1.5}
//       camera={{ position: [0, 14, 22], fov: 50 }}
//       gl={{ antialias: true, powerPreference: "high-performance" }}
//       className="!absolute inset-0"
//     >
// <ambientLight intensity={0.9} />

// <hemisphereLight
//   args={["#8ab4ff", "#111827", 1.2]}
// />

// <directionalLight
//   position={[12, 20, 8]}
//   intensity={2.5}
//   color="#ffffff"
// />

// <pointLight
//   position={[0, 12, 0]}
//   intensity={3}
//   color="#4f8dff"
// />

// <pointLight
//   position={[8, 10, 8]}
//   intensity={2}
//   color="#8B6CFF"
// />

//       <Suspense fallback={null}>
//         <ProceduralBuildings count={lowPower ? 100 : 220} />
//         <FlyingVehicles count={lowPower ? 5 : 12} />
//         <FlyingVehicles count={lowPower ? 3 : 8} isDrone />
//         <CityAtmosphere />
//       </Suspense>

//       <CityCameraRig progressRef={progressRef} />

//       {!lowPower && (
//         <EffectComposer>
//           <Bloom
//     intensity={1.6}
//     luminanceThreshold={0.08}
//     luminanceSmoothing={0.8}
//     mipmapBlur
// />
//           <Vignette eskil={false} offset={0.2} darkness={0.6} />
//         </EffectComposer>
//       )}
//     </Canvas>
//   );
// }
"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { CityModel } from "@/components/three/CityModel";
import { SceneBadge } from "@/components/three/SceneBadge";
import { isLowPowerDevice } from "@/lib/utils";
import { Environment } from "@react-three/drei";

CityModel.preload();

interface CityCameraRigProps {
  progressRef: React.MutableRefObject<number>;
}

function CityCameraRig({ progressRef }: CityCameraRigProps) {
  const cameraTarget = useRef(new THREE.Vector3(-3, 2, 0));

  useFrame(({ camera }) => {
    const p = progressRef.current;
    const angle = p * Math.PI * 1.2 + Math.PI * 0.15;
    const radius = 24 - p * 14;
    const height = 16 - p * 10;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, -3 + Math.cos(angle) * radius, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, Math.sin(angle) * radius, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, height, 0.08);
    camera.lookAt(cameraTarget.current);
  });

  return null;
}

interface CitySceneProps {
  progressRef: React.MutableRefObject<number>;
}

export function CityScene({ progressRef }: CitySceneProps) {
  const lowPower = isLowPowerDevice();

  // Same scale/position as CityModel — badges are nested inside this group so they inherit the identical transform and move together with the buildings.
  const modelScale = 0.065;
  const modelPosition: [number, number, number] = [5, -1.5, 20];

  return (
    <Canvas
      dpr={lowPower ? 1 : 1.5}
      camera={{
position:[-6,11,18],
fov:48
}}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      
      <ambientLight intensity={0.18} />
      <hemisphereLight
   args={["#79b8ff", "#09070f", 1.2]}
/>
      <directionalLight
   position={[25,25,15]}
   intensity={3}
   color="#ffffff"
/>
      <pointLight
   position={[-20,12,-18]}
   color="#7B5CFF"
   intensity={80}
   distance={70}
/>
<pointLight
   position={[20,8,15]}
   color="#00D4FF"
   intensity={45}
   distance={60}
/>

      <Suspense fallback={null}>
        <CityModel scale={modelScale} position={modelPosition} tintColor="#8B6CFF" tintStrength={0.25} />
        

        {/* Badges nested in a group with the SAME transform as the model, so they move identically with the buildings as the camera orbits */}
        {/* <group scale={modelScale} position={modelPosition}>
          <SceneBadge label="CLOUD" position={[-450, 150, -120]} delay={0.2} />
          <SceneBadge label="SECURITY" position={[50, 280, -20]} delay={0.5} />
          <SceneBadge label="SOFTWARE" position={[-450, 150, -450]} delay={0.8} />
          <SceneBadge label="APPS" position={[50, 280, -120]} delay={1.1} />
        </group>
      </Suspense> */}
              <group scale={modelScale} position={modelPosition}>
          <SceneBadge label="CLOUD" anchor={[-250, 130, -350]} height={70} delay={0.2} />
          <SceneBadge label="SECURITY" anchor={[-150, 40, -400]} height={120} delay={0.5} />
          <SceneBadge label="SOFTWARE" anchor={[-300, 90, -40]} height={80} delay={0.8} />
          <SceneBadge label="APPS" anchor={[110, 210, -110]}height={20} delay={1.1} />
        </group>
      </Suspense>

      <CityCameraRig progressRef={progressRef} />

      {!lowPower && (
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}