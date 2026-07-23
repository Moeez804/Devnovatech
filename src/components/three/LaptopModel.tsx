"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { prefersReducedMotion } from "@/lib/utils";

export interface LaptopModelHandle {
  open: (onComplete?: () => void) => void;
  close: (onComplete?: () => void) => void;
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

export const LaptopModel = forwardRef<LaptopModelHandle, LaptopModelProps>(
  ({ url = "/models/laptop-draco.glb", videoSrc, accentColor = "#6C4CF1", scale = 1 }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
    const originalMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());

    // useGLTF caches and returns ONE shared scene object per URL across every
    // component instance. Without cloning, multiple <LaptopModel> instances
    // using the same GLB fight over a single shared Object3D — only one can
    // exist in the scene graph at a time, causing texture/animation state to
    // bleed between cards. cloneSkeleton (SkeletonUtils.clone) gives each
    // instance its own independent copy while preserving bone/animation bindings.
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
    }, [screenMesh]);

    useEffect(() => {
      if (!videoSrc) return;

      const video = document.createElement("video");
      video.src = videoSrc;
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      videoRef.current = video;

      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      videoTextureRef.current = texture;

      return () => {
        video.pause();
        video.src = "";
        texture.dispose();
        videoRef.current = null;
        videoTextureRef.current = null;
      };
    }, [videoSrc]);

    function applyVideoTexture() {
      if (!screenMesh || !videoTextureRef.current) return;
      const material = new THREE.MeshBasicMaterial({ map: videoTextureRef.current, toneMapped: false });
      screenMesh.material = material;
    }

    function restoreOriginalMaterial() {
      if (!screenMesh) return;
      const original = originalMaterialsRef.current.get(screenMesh);
      if (original) screenMesh.material = original;
    }

    function playVideo() {
      if (!videoRef.current) return;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        /* Autoplay can be blocked until user interaction — safe to ignore */
      });
      applyVideoTexture();
    }

    function stopVideo() {
      videoRef.current?.pause();
      restoreOriginalMaterial();
    }

    useImperativeHandle(
      ref,
      () => ({
        open: (onComplete) => {
          const action = clipName ? actions[clipName] : undefined;
          if (!action) {
            playVideo();
            onComplete?.();
            return;
          }

          if (prefersReducedMotion()) {
            action.reset().play();
            action.paused = true;
            action.time = action.getClip().duration;
            mixer.update(0);
            playVideo();
            onComplete?.();
            return;
          }

          action.reset();
          action.timeScale = 1;
          action.clampWhenFinished = true;
          action.setLoop(THREE.LoopOnce, 1);
          action.play();

          const onFinished = (e: { action: THREE.AnimationAction }) => {
            if (e.action !== action) return;
            mixer.removeEventListener("finished", onFinished);
            playVideo();
            onComplete?.();
          };
          mixer.addEventListener("finished", onFinished);
        },
        close: (onComplete) => {
          stopVideo();

          const action = clipName ? actions[clipName] : undefined;
          if (!action) {
            onComplete?.();
            return;
          }

          if (prefersReducedMotion()) {
            action.reset().play();
            action.paused = true;
            action.time = 0;
            mixer.update(0);
            onComplete?.();
            return;
          }

          action.timeScale = -1;
          action.clampWhenFinished = true;
          action.paused = false;
          if (!action.isRunning()) {
            action.reset();
            action.time = action.getClip().duration;
            action.play();
          }

          const onFinished = (e: { action: THREE.AnimationAction }) => {
            if (e.action !== action) return;
            mixer.removeEventListener("finished", onFinished);
            onComplete?.();
          };
          mixer.addEventListener("finished", onFinished);
        },
      }),
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
    }, [actions, clipName, mixer]);

    useFrame((_, delta) => {
      mixer.update(delta);
    });

    useEffect(() => {
      return () => restoreOriginalMaterial();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <primitive ref={groupRef} object={scene} scale={scale} dispose={null} />;
  }
) as LaptopModelComponent;

LaptopModel.displayName = "LaptopModel";

LaptopModel.preload = (url = "/models/laptop-draco.glb") => {
  useGLTF.preload(url, "/draco/");
};