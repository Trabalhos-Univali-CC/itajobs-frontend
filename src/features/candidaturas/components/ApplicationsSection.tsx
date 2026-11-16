"use client";

import { CardSkeleton } from "@/components/ui/card-skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuArrowUpRight, LuBriefcaseBusiness, LuBuilding2, LuCalendarDays, LuLoaderCircle, LuRefreshCw, LuSearch, LuSend, LuX } from "react-icons/lu";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useUsuario } from "@/features/auth/sessionContext";
import { del, get } from "@/lib/api";
import type { Candidatura } from "@/types/vaga";
import { cn } from "@/utils/utils";

const situacoes: Record<string, { label: string; className: string }> = {
  recebida: { label: "Recebida", className: "border-primary/10 bg-accent/70 text-primary" },
  emAnalise: { label: "Em análise", className: "border-amber-200/70 bg-amber-50 text-amber-800" },
  aprovada: { label: "Aprovada", className: "border-emerald-200/70 bg-emerald-50 text-emerald-800" },
  recusada: { label: "Recusada", className: "border-border bg-muted/70 text-muted-foreground" },
};

export function ApplicationsSection() {
  const usuario = useUsuario();
  const [candidaturas, setCandidaturas] = useState<Candidatura[] | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const [cancelando, setCancelando] = useState<number | null>(null);
  const [atualizando, setAtualizando] = useState(true);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;
    get<Candidatura[]>(`/api/candidato/${usuario.id}/candidaturas`)
      .then((dados) => { if (ativo) setCandidaturas(dados); })
      .catch((error) => { if (ativo) setFalha(error.message); })
      .finally(() => { if (ativo) setAtualizando(false); });
    return () => { ativo = false; };
  }, [usuario.id, versao]);

  return (
    <section id="minhas-candidaturas" aria-labelledby="perfil-candidaturas" className="scroll-mt-40 rounded-2xl border border-primary/10 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-secondary"><LuSend aria-hidden className="size-5" /></span>
          <div className="min-w-0"><h2 id="perfil-candidaturas" className="text-lg font-semibold text-primary">Minhas candidaturas</h2><p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Acompanhe o andamento das vagas às quais você se candidatou.</p></div>
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="Atualizar candidaturas" title="Atualizar candidaturas" disabled={atualizando || cancelando !== null} onClick={() => { setFalha(null); setAtualizando(true); setVersao((atual) => atual + 1); }}><LuRefreshCw aria-hidden className={cn("size-4", atualizando && "animate-spin")} /></Button>
      </div>

      <div className="mt-5 space-y-4">
        <FormErrorAlert message={falha} />
        {atualizando && <CardSkeleton variant="application" count={2} label="Carregando candidaturas..." />}
        {!atualizando && candidaturas?.length === 0 && !falha && <div className="rounded-xl border border-dashed border-primary/15 bg-accent/20 px-5 py-7 text-center">
          <LuBriefcaseBusiness aria-hidden className="mx-auto size-8 text-primary/35" />
          <h3 className="mt-3 text-sm font-semibold">Sua próxima oportunidade pode estar aqui</h3>
          <p className="mx-auto mt-0.5 max-w-sm text-sm leading-relaxed text-muted-foreground">Você ainda não se candidatou a nenhuma vaga. Explore as oportunidades e acompanhe suas candidaturas neste espaço.</p>
          <Link href="/" className={cn(buttonVariants(), "mt-4 gap-2")}><LuSearch aria-hidden className="size-4" />Buscar vagas</Link>
        </div>}
        {!atualizando && candidaturas?.map((item) => <article key={`${item.idVaga}-${item.idCandidato}`} aria-label={`Candidatura para ${item.cargo}`} className="rounded-xl border border-primary/10 p-4">
          <div className="flex flex-col items-start justify-between gap-2 min-[480px]:flex-row min-[480px]:gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary/65"><LuBuilding2 aria-hidden className="size-5" /></span>
              <div className="min-w-0"><h3 className="text-base leading-snug font-semibold break-words text-primary"><Link href={`/vagas/${item.idVaga}`} className="underline-offset-4 hover:underline">{item.cargo}</Link></h3><Link href={`/cadastros/empresa/${item.idEmpresa}`} className="mt-1 inline-block text-xs leading-relaxed break-words text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{item.nomeEmpresa}</Link></div>
            </div>
            <span className={cn("ml-13 rounded-full border px-2.5 py-1 text-[11px] font-medium min-[480px]:ml-0", situacoes[item.status]?.className ?? "border-border bg-muted text-muted-foreground")}>{situacoes[item.status]?.label ?? item.status}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5"><LuCalendarDays aria-hidden className="size-3.5" />Enviada em <time dateTime={item.dataCandidatura}>{new Date(item.dataCandidatura).toLocaleDateString("pt-BR")}</time></p>
            {item.dataStatus && <p>Atualizada em <time dateTime={item.dataStatus}>{new Date(item.dataStatus).toLocaleDateString("pt-BR")}</time></p>}
            {item.statusVaga === "encerrada" && <span className="rounded-md bg-muted px-2 py-1">Vaga encerrada</span>}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-primary/10 pt-3">
            <Link href={`/vagas/${item.idVaga}`} className={cn(buttonVariants({ variant: "outline" }), "gap-2")}>Ver vaga<LuArrowUpRight aria-hidden className="size-4" /></Link>
            <ConfirmationDialog variant="destructive" title="Cancelar candidatura?" description={`Você deixará de participar da seleção para ${item.cargo}, na empresa ${item.nomeEmpresa}.`} confirmLabel="Sim, cancelar candidatura" pendingLabel="Cancelando..." trigger={<Button type="button" variant="ghost" disabled={cancelando !== null || atualizando} className="gap-2 text-destructive/85 hover:bg-destructive/5 hover:text-destructive">{cancelando === item.idVaga ? <LuLoaderCircle aria-hidden className="size-4 animate-spin" /> : <LuX aria-hidden className="size-4" />}Cancelar candidatura</Button>} onConfirm={async () => {
              setCancelando(item.idVaga);
              try {
                await del(`/api/vaga/${item.idVaga}/candidaturas/${usuario.id}`);
                setCandidaturas((atuais) => atuais?.filter((candidatura) => candidatura.idVaga !== item.idVaga) ?? null);
              } finally { setCancelando(null); }
            }} />
          </div>
        </article>)}
      </div>
    </section>
  );
}
