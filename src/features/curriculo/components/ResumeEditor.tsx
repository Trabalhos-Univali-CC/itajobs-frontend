"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/form/SubmitButton";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { post, del } from "@/lib/api";
import type { Curriculo } from "@/types/curriculo";
import type { Candidato } from "@/types/usuario";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { SkillsSection } from "./SkillsSection";
import { ExperienceSection } from "./ExperienceSection";
import { ResumePreview } from "./ResumePreview";

export function ResumeEditor({ candidato, curriculo }: { candidato: Candidato; curriculo: Curriculo | null }) {
  const [dados, setDados] = useState(curriculo);
  const [falha, setFalha] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const { erro, enviando, onSubmit } = useFormSubmit(async () => {
    setDados(await post<Curriculo>("/api/curriculo", { idCandidato: candidato.id }));
  });
  return (
    <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
      <div className="flex min-w-0 flex-col gap-5">
        <PersonalInfoSection candidato={candidato} />
        <FormErrorAlert message={erro ?? falha} />
        {dados ? <>
          <SkillsSection idCurriculo={dados.id} value={dados.habilidades} onChange={(habilidades) => setDados((atual) => atual && { ...atual, habilidades })} />
          <ExperienceSection idCurriculo={dados.id} value={dados.experiencias} onChange={(experiencias) => setDados((atual) => atual && { ...atual, experiencias })} />
          <details className="rounded-xl border p-4"><summary className="cursor-pointer text-destructive">Excluir currículo</summary><p className="my-3 text-sm">As experiências e habilidades serão excluídas.</p><Button variant="destructive" disabled={excluindo} onClick={async () => {
            setExcluindo(true);
            try { await del(`/api/curriculo/${dados.id}`); setDados(null); }
            catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível excluir o currículo."); }
            finally { setExcluindo(false); }
          }}>Confirmar exclusão</Button></details>
        </> : <Card className="p-6"><p>Este candidato ainda não tem currículo.</p><form onSubmit={onSubmit}><SubmitButton pending={enviando} pendingLabel="Criando...">Criar currículo</SubmitButton></form></Card>}
      </div>
      <aside className="space-y-4 lg:sticky lg:top-24">
        <p className="text-sm text-muted-foreground">As alterações são salvas individualmente. Foto, resumo, portfólio, projetos, formações e idiomas ainda não estáo disponíveis.</p>
        {dados && <><p className="text-xs text-muted-foreground">Currículo ID {dados.id}</p><ResumePreview candidato={candidato} curriculo={dados} /></>}
      </aside>
    </div>
  );
}
