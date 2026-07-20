// "use client";

// import { useGLTF } from "@react-three/drei";
// import { useRef } from "react";
// import * as THREE from "three";

// interface CityModelProps {
//   url?: string;
// }

// /**
//  * Loads a real city GLB compressed with DRACO.
//  * NOT wired into CityScene by default — ProceduralBuildings is the active visual until a real asset exists.
//  *
//  * To activate:
//  * 1. Place your compressed model at /public/models/city-draco.glb
//  * 2. Copy DRACO decoder files (draco_decoder.js, draco_decoder.wasm, draco_wasm_wrapper.js)
//  *    from node_modules/three/examples/jsm/libs/draco/ into /public/draco/
//  * 3. In CityScene.tsx, swap <ProceduralBuildings /> for <CityModel />
//  * 4. Call CityModel.preload() at module scope in CityScene.tsx to start loading before the section mounts.
//  */
// export function CityModel({ url = "/models/city-draco.glb" }: CityModelProps) {
//   const groupRef = useRef<THREE.Group>(null);
//   const { scene } = useGLTF(url, "/draco/");

//   return <primitive ref={groupRef} object={scene} dispose={null} />;
// }

// // Preload + DRACO decoder path configured here so consumers just call CityModel.preload()
// CityModel.preload = (url = "/models/city-draco.glb") => {
//   useGLTF.preload(url, "/draco/");
// };
"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface CityModelProps {
  url?: string;
  scale?: number;
  position?: [number, number, number];
  tintColor?: string;
  tintStrength?: number;
}

/**
 * Loads the compressed city GLB. Optionally blends a color tint into each
 * material at partial strength so brand color comes through while original
 * texture detail and shading survive underneath.
 *
 * TEMPORARY DEBUG BLOCK included below — logs rooftop coordinates of the
 * tallest/largest meshes in the model to the console, so real building-top
 * positions can be picked for badge placement instead of guessed. Remove
 * this block once badge positions are finalized.
 */
export function CityModel({
  url = "/models/city-draco.glb",
  scale = 1,
  position = [0, 0, 0],
  tintColor,
  tintStrength = 0.25,
}: CityModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url, "/draco/");

  useEffect(() => {
    if (!tintColor) return;
    const tint = new THREE.Color(tintColor);

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          if ("color" in mat) {
            const original = (mat as THREE.MeshStandardMaterial).color.clone();
            (mat as THREE.MeshStandardMaterial).color = original.lerp(tint, tintStrength);
          }
        });
      }
    });
  }, [scene, tintColor, tintStrength]);

  // TEMPORARY DEBUG — logs rooftop points of tall buildings. Remove after picking badge coordinates.
  useEffect(() => {
    let count = 0;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && count < 15) {
        const box = new THREE.Box3().setFromObject(child);
        const size = new THREE.Vector3();
        box.getSize(size);
        if (size.y > 15 && size.x > 5) {
          const topCenter = new THREE.Vector3(
            (box.min.x + box.max.x) / 2,
            box.max.y,
            (box.min.z + box.max.z) / 2
          );
          console.log(child.name, "rooftop point:", topCenter, "height:", size.y);
          count++;
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      ref={groupRef}
      object={scene}
      dispose={null}
      scale={scale}
      position={position}
    />
  );
}

CityModel.preload = (url = "/models/city-draco.glb") => {
  useGLTF.preload(url, "/draco/");
};