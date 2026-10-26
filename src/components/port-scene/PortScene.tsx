"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/Utils";

import { createPortScene } from "./CreatePortScene";

export function PortScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      const scene = createPortScene(canvas, { animate });
      return () => scene.dispose();
    } catch {
      return;
    }
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={cn("block size-full", className)} />;
}
