import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/utils";

type CardSkeletonProps = {
  variant?: "default" | "company" | "application" | "review";
  count?: number;
  label?: string;
  className?: string;
};

export function CardSkeleton({ variant = "default", count = 3, label = "Carregando informações...", className }: CardSkeletonProps) {
  return (
    <div data-slot="card-skeleton" role="status" aria-live="polite" aria-busy="true" className={cn("grid min-w-0 gap-4", className)}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} aria-hidden="true" className={cn("min-w-0 rounded-2xl border border-primary/10 bg-card p-5 shadow-sm", variant === "company" && "grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-3 px-4 py-3 sm:grid-cols-[5rem_minmax(0,1fr)_13rem] sm:gap-4 sm:px-5 sm:py-4 lg:grid-cols-[5rem_minmax(0,1fr)_16.5rem] lg:py-3", variant === "review" && "rounded-xl border-border p-4 shadow-none")}>
          {variant === "company" ? <>
            <Skeleton className="size-16 rounded-full sm:size-20" />
            <div className="min-w-0 space-y-2.5"><Skeleton className="h-5 w-2/3 max-w-64" /><Skeleton className="h-3 w-1/2 max-w-40" /><Skeleton className="h-4 w-full max-w-96" /></div>
            <div className="col-span-2 space-y-3 border-t border-primary/10 pt-3 sm:col-span-1 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4"><Skeleton className="mx-auto h-4 w-32" /><div className="grid grid-cols-2 gap-2 sm:grid-cols-1 lg:grid-cols-2"><Skeleton className="h-11 w-full rounded-lg" /><Skeleton className="h-11 w-full rounded-lg" /></div></div>
          </> : <>
            <div className="flex items-center gap-3">
              {(variant === "application" || variant === "review") && <Skeleton className="size-10 shrink-0 rounded-full" />}
              <div className="min-w-0 flex-1 space-y-2"><Skeleton className="h-5 w-2/3 max-w-64" /><Skeleton className="h-3 w-1/2 max-w-40" /></div>
            </div>
            <div className="mt-4 space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-5/6" />{variant !== "review" && <Skeleton className="h-3 w-3/5" />}</div>
            {variant !== "review" && <div className="mt-5 flex items-center justify-between gap-4"><Skeleton className="h-4 w-28" /><Skeleton className={cn("h-4 w-20", variant === "application" && "h-10 w-36 rounded-lg")} /></div>}
          </>}
        </div>
      ))}
    </div>
  );
}
