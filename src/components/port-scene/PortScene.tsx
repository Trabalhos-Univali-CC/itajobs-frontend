"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/utils/utils";

export function PortScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ativo = true;
    let versao = 0;
    let dispose: ((releaseContext?: boolean) => void) | undefined;
    const carregar = async () => {
      const atual = ++versao;
      dispose?.(false);
      dispose = undefined;
      canvas.style.opacity = "0";
      canvas.dataset.scene = motion.matches ? "static" : "loading";
      if (motion.matches) return;

      try {
        const imagem = new Image();
        imagem.src = "/images/port-scene.webp";
        await imagem.decode().catch(() => undefined);
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        if (!ativo || atual !== versao) return;
        const { createPortScene } = await import("./createPortScene");
        if (!ativo || atual !== versao) return;
        const scene = createPortScene(canvas, {
          animate: true,
          onReady: () => {
            if (!ativo || atual !== versao) return;
            canvas.style.opacity = "1";
            canvas.dataset.scene = "animated";
          },
          onError: (error) => {
            if (!ativo || atual !== versao) return;
            canvas.style.opacity = "0";
            canvas.dataset.scene = "fallback";
            console.warn("O porto 3D ficou indisponível. Mantendo a imagem de fundo.", error);
          },
        });
        dispose = (releaseContext) => scene.dispose(releaseContext);
      } catch (error) {
        if (!ativo || atual !== versao) return;
        canvas.style.opacity = "0";
        canvas.dataset.scene = "fallback";
        console.warn("Não foi possível iniciar o porto 3D. Mantendo a imagem de fundo.", error);
      }
    };

    void carregar();
    motion.addEventListener("change", carregar);
    canvas.addEventListener("webglcontextrestored", carregar);
    return () => {
      ativo = false;
      versao++;
      motion.removeEventListener("change", carregar);
      canvas.removeEventListener("webglcontextrestored", carregar);
      dispose?.();
    };
  }, []);

  return (
    <div aria-hidden className={cn("relative size-full overflow-hidden bg-[#10152c] bg-[url('/images/port-scene.webp')] bg-cover bg-center", className)}>
      <link rel="preload" as="image" href="/images/port-scene.webp" fetchPriority="high" />
      <canvas ref={canvasRef} data-scene="loading" className="absolute inset-0 block size-full opacity-0" />
    </div>
  );
}
