// "use client";

// import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
// import { useGLTF, useAnimations } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import * as THREE from "three";
// import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
// import { prefersReducedMotion } from "@/lib/utils";

// export interface LaptopModelHandle {
//   open: (onComplete?: () => void) => void;
//   close: (onComplete?: () => void) => void;
// }

// interface LaptopModelProps {
//   url?: string;
//   videoSrc?: string;
//   accentColor?: string;
//   scale?: number;
// }

// type LaptopModelComponent = React.ForwardRefExoticComponent<
//   LaptopModelProps & React.RefAttributes<LaptopModelHandle>
// > & {
//   preload: (url?: string) => void;
// };

// export const LaptopModel = forwardRef<LaptopModelHandle, LaptopModelProps>(
//   ({ url = "/models/laptop-draco.glb", videoSrc, accentColor = "#6C4CF1", scale = 1 }, ref) => {
//     const groupRef = useRef<THREE.Group>(null);
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
//     const originalMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());

//     // useGLTF caches and returns ONE shared scene object per URL across every
//     // component instance. Without cloning, multiple <LaptopModel> instances
//     // using the same GLB fight over a single shared Object3D — only one can
//     // exist in the scene graph at a time, causing texture/animation state to
//     // bleed between cards. cloneSkeleton (SkeletonUtils.clone) gives each
//     // instance its own independent copy while preserving bone/animation bindings.
//     const { scene: sharedScene, animations } = useGLTF(url, "/draco/");
//     const scene = useMemo(() => cloneSkeleton(sharedScene), [sharedScene]);

//     const { actions, mixer } = useAnimations(animations, groupRef);

//     const clipName = useMemo(() => {
//       const names = Object.keys(actions);
//       return names.find((n) => /open/i.test(n)) ?? names.find((n) => /hinge|lid/i.test(n)) ?? names[0];
//     }, [actions]);

//     const screenMesh = useMemo<THREE.Mesh | null>(() => {
//       let found: THREE.Mesh | null = null;
//       scene.traverse((child) => {
//         if (!found && child instanceof THREE.Mesh && child.name === "Object_7") {
//           found = child;
//         }
//       });
//       return found;
//     }, [scene]);

//     useEffect(() => {
//       if (screenMesh && !originalMaterialsRef.current.has(screenMesh)) {
//         originalMaterialsRef.current.set(screenMesh, screenMesh.material);
//       }
//     }, [screenMesh]);

//     useEffect(() => {
//       if (!videoSrc) return;

//       const video = document.createElement("video");
//       video.src = videoSrc;
//       video.crossOrigin = "anonymous";
//       video.loop = true;
//       video.muted = true;
//       video.playsInline = true;
//       video.preload = "auto";
//       videoRef.current = video;

//       const texture = new THREE.VideoTexture(video);
//       texture.colorSpace = THREE.SRGBColorSpace;
//       texture.minFilter = THREE.LinearFilter;
//       texture.magFilter = THREE.LinearFilter;
//       videoTextureRef.current = texture;

//       return () => {
//         video.pause();
//         video.src = "";
//         texture.dispose();
//         videoRef.current = null;
//         videoTextureRef.current = null;
//       };
//     }, [videoSrc]);

//     function applyVideoTexture() {
//       if (!screenMesh || !videoTextureRef.current) return;
//       const material = new THREE.MeshBasicMaterial({ map: videoTextureRef.current, toneMapped: false });
//       screenMesh.material = material;
//     }

//     function restoreOriginalMaterial() {
//       if (!screenMesh) return;
//       const original = originalMaterialsRef.current.get(screenMesh);
//       if (original) screenMesh.material = original;
//     }

//     function playVideo() {
//       if (!videoRef.current) return;
//       videoRef.current.currentTime = 0;
//       videoRef.current.play().catch(() => {
//         /* Autoplay can be blocked until user interaction — safe to ignore */
//       });
//       applyVideoTexture();
//     }

//     function stopVideo() {
//       videoRef.current?.pause();
//       restoreOriginalMaterial();
//     }

//     useImperativeHandle(
//       ref,
//       () => ({
//         open: (onComplete) => {
//           const action = clipName ? actions[clipName] : undefined;
//           if (!action) {
//             playVideo();
//             onComplete?.();
//             return;
//           }

//           if (prefersReducedMotion()) {
//             action.reset().play();
//             action.paused = true;
//             action.time = action.getClip().duration;
//             mixer.update(0);
//             playVideo();
//             onComplete?.();
//             return;
//           }

//           action.reset();
//           action.timeScale = 1;
//           action.clampWhenFinished = true;
//           action.setLoop(THREE.LoopOnce, 1);
//           action.play();

//           const onFinished = (e: { action: THREE.AnimationAction }) => {
//             if (e.action !== action) return;
//             mixer.removeEventListener("finished", onFinished);
//             playVideo();
//             onComplete?.();
//           };
//           mixer.addEventListener("finished", onFinished);
//         },
//         close: (onComplete) => {
//           stopVideo();

//           const action = clipName ? actions[clipName] : undefined;
//           if (!action) {
//             onComplete?.();
//             return;
//           }

//           if (prefersReducedMotion()) {
//             action.reset().play();
//             action.paused = true;
//             action.time = 0;
//             mixer.update(0);
//             onComplete?.();
//             return;
//           }

//           action.timeScale = -1;
//           action.clampWhenFinished = true;
//           action.paused = false;
//           if (!action.isRunning()) {
//             action.reset();
//             action.time = action.getClip().duration;
//             action.play();
//           }

//           const onFinished = (e: { action: THREE.AnimationAction }) => {
//             if (e.action !== action) return;
//             mixer.removeEventListener("finished", onFinished);
//             onComplete?.();
//           };
//           mixer.addEventListener("finished", onFinished);
//         },
//       }),
//       [actions, clipName, mixer, screenMesh]
//     );

//     useEffect(() => {
//       const action = clipName ? actions[clipName] : undefined;
//       if (!action) return;
//       action.reset();
//       action.time = 0;
//       action.paused = true;
//       action.play();
//       mixer.update(0);
//     }, [actions, clipName, mixer]);

//     useFrame((_, delta) => {
//       mixer.update(delta);
//     });

//     useEffect(() => {
//       return () => restoreOriginalMaterial();
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     return <primitive ref={groupRef} object={scene} scale={scale} dispose={null} />;
//   }
// ) as LaptopModelComponent;

// LaptopModel.displayName = "LaptopModel";

// LaptopModel.preload = (url = "/models/laptop-draco.glb") => {
//   useGLTF.preload(url, "/draco/");
// };
"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { prefersReducedMotion } from "@/lib/utils";

export interface LaptopModelHandle {
  open: () => void;
  close: () => void;
  isVideoPlaying: () => boolean;
  isVideoEnded: () => boolean;
}

interface LaptopModelProps {
  url?: string;
  videoSrc?: string;
  accentColor?: string;
  scale?: number;
}

type LaptopModelComponent = React.ForwardRefExoticComponent<
  LaptopModelProps & React.RefAttributes<LaptopModelHandle>
> & {
  preload: (url?: string) => void;
};

type LaptopState = "closed" | "opening" | "open" | "closing";

export const LaptopModel = forwardRef<LaptopModelHandle, LaptopModelProps>(
  ({ url = "/models/laptop-draco.glb", videoSrc, accentColor = "#6C4CF1", scale = 1 }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
    const originalMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());
    const isVideoTextureAppliedRef = useRef(false);

    const stateRef = useRef<LaptopState>("closed");
    const pendingOpenRef = useRef(false);
    const videoEndedRef = useRef(false);

    const { scene: sharedScene, animations } = useGLTF(url, "/draco/");
    const scene = useMemo(() => cloneSkeleton(sharedScene), [sharedScene]);
    const { actions, mixer } = useAnimations(animations, groupRef);

    const clipName = useMemo(() => {
      const names = Object.keys(actions);
      return names.find((n) => /open/i.test(n)) ?? names.find((n) => /hinge|lid/i.test(n)) ?? names[0];
    }, [actions]);

    const screenMesh = useMemo<THREE.Mesh | null>(() => {
      let found: THREE.Mesh | null = null;
      scene.traverse((child) => {
        if (!found && child instanceof THREE.Mesh && child.name === "Object_7") {
          found = child;
        }
      });
      return found;
    }, [scene]);

useEffect(() => {
  if (screenMesh && !originalMaterialsRef.current.has(screenMesh)) {
    originalMaterialsRef.current.set(screenMesh, screenMesh.material);
  }
  if (!screenMesh) {
    console.warn("[Laptop] ❌ No mesh named 'Object_7' found.");
    // 👇 Ye sab mesh names print karega taake pata chale actual naam kya hai
    const names: string[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) names.push(child.name);
    });
    console.log("[Laptop] Available mesh names:", names);
  } else {
    console.log("[Laptop] ✅ screenMesh found:", screenMesh.name);
  }
}, [screenMesh]);

    // Video element + texture
useEffect(() => {
  if (!videoSrc) return;

  const video = document.createElement("video");
  video.src = videoSrc;
  video.crossOrigin = "anonymous";
  video.loop = false;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  videoRef.current = video;

  function handleError() {
    const err = video.error;
    console.error(
      "[Laptop] ❌ VIDEO ERROR — code:", err?.code,
      "message:", err?.message,
      "src:", videoSrc
    );
  }

  video.addEventListener("error", handleError);

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  videoTextureRef.current = texture;

  function handlePlay() {
    videoEndedRef.current = false;
  }

  function handleEnded() {
    videoEndedRef.current = true;
    if (stateRef.current === "open") {
      videoRef.current!.currentTime = 0;
      videoRef.current!.play().catch(() => {});
    }
  }

  video.addEventListener("play", handlePlay);
  video.addEventListener("ended", handleEnded);

  return () => {
    video.removeEventListener("play", handlePlay);
    video.removeEventListener("ended", handleEnded);
    video.removeEventListener("error", handleError);
    video.pause();
    video.src = "";
    texture.dispose();
    videoRef.current = null;
    videoTextureRef.current = null;
    isVideoTextureAppliedRef.current = false;
    videoEndedRef.current = false;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [videoSrc]);
    function applyVideoTexture() {
      if (!screenMesh || !videoTextureRef.current) return;
      if (isVideoTextureAppliedRef.current) return;

      const material = new THREE.MeshBasicMaterial({
        map: videoTextureRef.current,
        toneMapped: false,
        side: THREE.FrontSide,
      });

      screenMesh.material = material;
      isVideoTextureAppliedRef.current = true;
    }

    function restoreOriginalMaterial() {
      if (!screenMesh || !isVideoTextureAppliedRef.current) return;

      const original = originalMaterialsRef.current.get(screenMesh);
      if (original) {
        screenMesh.material = original;
        isVideoTextureAppliedRef.current = false;
      }
    }

function startVideo() {
  if (!videoRef.current || !videoTextureRef.current) {
    console.log("[Laptop] ❌ startVideo bailed — no video/texture ref");
    return;
  }

  console.log("[Laptop] startVideo called, readyState:", videoRef.current.readyState, "src:", videoRef.current.src);

  applyVideoTexture();
  videoEndedRef.current = false;

  if (videoRef.current.readyState < 2) {
    console.log("[Laptop] video not ready, waiting for canplay...");
    videoRef.current.addEventListener("canplay", function onCanPlay() {
      videoRef.current?.removeEventListener("canplay", onCanPlay);
      console.log("[Laptop] canplay fired");
      if (stateRef.current === "open") {
        videoRef.current?.play()
          .then(() => console.log("[Laptop] ✅ play() succeeded (after canplay)"))
          .catch((err) => console.error("[Laptop] ❌ play() failed:", err));
      }
    });
    return;
  }

  videoRef.current.currentTime = 0;
  videoRef.current.play()
    .then(() => console.log("[Laptop] ✅ play() succeeded"))
    .catch((err) => console.error("[Laptop] ❌ play() failed:", err));
}

    function stopVideo() {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      restoreOriginalMaterial();
    }

    function performOpen() {
      if (stateRef.current === "open" || stateRef.current === "opening") {
        return;
      }

      // Already mid-close animation → remember to reopen once it finishes
      if (stateRef.current === "closing") {
        pendingOpenRef.current = true;
        return;
      }

      stateRef.current = "opening";
      pendingOpenRef.current = false;
      videoEndedRef.current = false;

      const action = clipName ? actions[clipName] : undefined;
      if (!action) {
        stateRef.current = "open";
        startVideo();
        return;
      }

      action.reset();
      action.timeScale = 1;
      action.paused = false;
      action.clampWhenFinished = true;
      action.setLoop(THREE.LoopOnce, 1);
      action.play();

      const onFinished = (e: { action: THREE.AnimationAction }) => {
        if (e.action !== action) return;
        mixer.removeEventListener("finished", onFinished);

        // If a close was requested while the open animation was still running,
        // performClose() will already have flipped state — just bail.
        if (stateRef.current !== "opening") return;

        stateRef.current = "open";
        startVideo();
      };
      mixer.addEventListener("finished", onFinished);
    }

    // 👇 KEY FIX: close is now IMMEDIATE and always honored — it no longer waits
    // for the video to finish. Waiting caused close requests to pile up while the
    // user kept scrolling, leaving multiple laptops stuck "open" at once.
    function performClose() {
      const currentState = stateRef.current;

      if (currentState === "closed" || currentState === "closing") {
        return;
      }

      if (currentState === "opening") {
        pendingOpenRef.current = false;
        // let the open animation land, then immediately reverse it
        stateRef.current = "closing";
        // fallthrough handled below once we set state; action reversal logic
        // still needs the action reference, so just proceed as normal below.
      }

      stateRef.current = "closing";
      pendingOpenRef.current = false;

      stopVideo();

      const action = clipName ? actions[clipName] : undefined;
      if (!action) {
        stateRef.current = "closed";
        return;
      }

      if (prefersReducedMotion()) {
        action.reset().play();
        action.paused = true;
        action.time = 0;
        mixer.update(0);
        stateRef.current = "closed";
        return;
      }

      action.timeScale = -1;
      action.paused = false;
      action.clampWhenFinished = true;
      if (!action.isRunning()) {
        action.reset();
        action.time = action.getClip().duration;
        action.play();
      }

      const onFinished = (e: { action: THREE.AnimationAction }) => {
        if (e.action !== action) return;
        mixer.removeEventListener("finished", onFinished);
        stateRef.current = "closed";

        if (pendingOpenRef.current) {
          pendingOpenRef.current = false;
          performOpen();
        }
      };
      mixer.addEventListener("finished", onFinished);
    }

    const isVideoPlaying = () => {
      return videoRef.current ? !videoRef.current.paused : false;
    };

    const isVideoEnded = () => {
      return videoEndedRef.current;
    };

    useImperativeHandle(
      ref,
      () => ({
        open: performOpen,
        close: performClose,
        isVideoPlaying,
        isVideoEnded,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [actions, clipName, mixer, screenMesh]
    );

    useEffect(() => {
      const action = clipName ? actions[clipName] : undefined;
      if (!action) return;
      action.reset();
      action.time = 0;
      action.paused = true;
      action.play();
      mixer.update(0);
      stateRef.current = "closed";
    }, [actions, clipName, mixer]);

    useFrame((_, delta) => {
      mixer.update(delta);
      if (videoTextureRef.current && isVideoTextureAppliedRef.current) {
        videoTextureRef.current.needsUpdate = true;
      }
    });

    useEffect(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
        restoreOriginalMaterial();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <primitive ref={groupRef} object={scene} scale={scale} dispose={null} />;
  }
) as LaptopModelComponent;

LaptopModel.displayName = "LaptopModel";

LaptopModel.preload = (url = "/models/laptop-draco.glb") => {
  useGLTF.preload(url, "/draco/");
};