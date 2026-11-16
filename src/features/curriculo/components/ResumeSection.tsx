import type { ReactNode } from "react";
import type { IconType } from "react-icons";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ResumeSectionProps = {
  parte: number;
  titulo: string;
  descricao: string;
  icon: IconType;
  opcional?: boolean;
  children: ReactNode;
};

export function ResumeSection({ parte, titulo, descricao, icon: Icon, opcional, children }: ResumeSectionProps) {
  const tituloId = `parte-${parte}`;

  return (
    <Card role="region" aria-labelledby={tituloId} className="gap-0 rounded-2xl border px-5 py-6 shadow-sm ring-0 sm:px-7">
      <header className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-secondary shadow-md shadow-primary/20">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={tituloId} className="flex flex-wrap items-center gap-2 text-lg leading-snug font-semibold text-card-foreground">
            {titulo}
            {opcional && (
              <Badge variant="outline" className="font-normal text-muted-foreground">
                Opcional
              </Badge>
            )}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{descricao}</p>
        </div>
      </header>
      <div className="mt-6">{children}</div>
    </Card>
  );
}
