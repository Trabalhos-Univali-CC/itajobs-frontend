import Image from "next/image";

import itajobsLogo from "@/assets/brand/ItajobsLogo.png";
import { cn } from "@/lib/Utils";

type ItajobsEmblemProps = {
  className?: string;
  priority?: boolean;
};

export function ItajobsEmblem({ className, priority }: ItajobsEmblemProps) {
  return (
    <Image
      src={itajobsLogo}
      alt="ItaJobs"
      sizes="128px"
      priority={priority}
      className={cn("h-auto", className)}
    />
  );
}

export function ItajobsWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline font-bold tracking-[0.16em] text-primary", className)}>
      ITA
      <span className="relative">
        JOBS
        <svg
          aria-hidden
          viewBox="0 0 64 8"
          preserveAspectRatio="none"
          className="absolute -bottom-2.5 left-0 h-2 w-[calc(100%-0.16em)] text-secondary"
        >
          <path
            d="M1 4Q9 0 17 4T33 4T49 4T63 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </span>
  );
}
