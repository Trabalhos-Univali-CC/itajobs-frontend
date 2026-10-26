import { cn } from "@/lib/Utils";

const wave = "M0 40C360 80 1080 0 1440 40C1800 80 2520 0 2880 40V120H0Z";

const layers = [
  { className: "fill-white/10", offset: "translate-y-0", duration: "animate-[wave-drift_22s_linear_infinite]" },
  { className: "fill-secondary", offset: "translate-y-3", duration: "animate-[wave-drift_16s_linear_infinite]" },
  { className: "fill-background", offset: "translate-y-6", duration: "animate-[wave-drift_11s_linear_infinite]" },
];

export function AnimatedWaves({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none h-24 overflow-hidden", className)}>
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
  );
}
