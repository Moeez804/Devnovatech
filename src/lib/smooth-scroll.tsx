"use client";

import { useLenis } from "@/hooks/use-lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useLenis();
  return <>{children}</>;
}