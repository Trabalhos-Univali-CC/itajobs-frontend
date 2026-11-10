import type { ReactNode } from "react";

import { cn } from "@/utils/utils";

const wave = "M0 40C360 80 1080 0 1440 40C1800 80 2520 0 2880 40V120H0Z";

const layers = [
  { className: "fill-white/10", offset: "translate-y-0", duration: "animate-[wave-drift_22s_linear_infinite]" },
  { className: "fill-secondary", offset: "translate-y-3", duration: "animate-[wave-drift_16s_linear_infinite]" },
  { className: "fill-background", offset: "translate-y-6", duration: "animate-[wave-drift_11s_linear_infinite]" },
];

type PageHeroProps = {
  title: string;
  description: string;
  topo?: ReactNode;
  className?: string;
};

export function PageHero({ title, description, topo, className }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary pb-28 text-primary-foreground">
      <div className={cn("relative z-10 mx-auto max-w-5xl px-6 pt-8", topo && "pt-6", className)}>
        {topo && <div className="mb-10">{topo}</div>}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-white/75">{description}</p>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 overflow-hidden">
        {layers.map((layer) => (
          <svg
            key={layer.className}
            viewBox="0 0 2880 120"
            preserveAspectRatio="none"
            className={cn(
              "absolute bottom-0 left-0 h-full w-[200%] motion-reduce:animate-none",
              layer.offset,
              layer.duration,
            )}
          >
            <path d={wave} className={layer.className} />
          </svg>
        ))}
      </div>
    </section>
  );
}
