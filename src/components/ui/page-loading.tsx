import { LuAnchor } from "react-icons/lu";
import { cn } from "@/utils/utils";

type PageLoadingProps = { label?: string; className?: string };

export function PageLoading({ label = "Carregando página...", className }: PageLoadingProps) {
  return (
    <div data-slot="page-loading" role="status" aria-live="polite" aria-busy="true" className={cn("flex min-h-[55dvh] w-full flex-1 flex-col items-center justify-center gap-5 px-6 py-12", className)}>
      <div aria-hidden="true" className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-[3px] border-primary/10" />
        <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-primary border-r-secondary [animation-duration:1.4s] motion-reduce:animate-none" />
        <span className="flex size-14 items-center justify-center rounded-full bg-accent/70 text-primary"><LuAnchor className="size-7" /></span>
      </div>
      <p className="text-sm font-medium text-primary/75">{label}</p>
    </div>
  );
}
