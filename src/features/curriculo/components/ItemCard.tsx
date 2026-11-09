import type { ReactNode } from "react";
import { LuTrash2 } from "react-icons/lu";

import { Button } from "@/components/ui/button";

type ItemCardProps = {
  titulo: string;
  subtitulo?: string;
  onRemove: () => void;
  children: ReactNode;
};

export function ItemCard({ titulo, subtitulo, onRemove, children }: ItemCardProps) {
  return (
    <div className="animate-in rounded-xl border border-l-4 border-l-primary/70 bg-muted/30 p-4 duration-200 fade-in-0 slide-in-from-top-1 sm:p-5 motion-reduce:animate-none">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-card-foreground">{titulo}</p>
          {subtitulo && <p className="text-xs text-muted-foreground tabular-nums">{subtitulo}</p>}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LuTrash2 />
          Remover
        </Button>
      </div>
      {children}
    </div>
  );
}
