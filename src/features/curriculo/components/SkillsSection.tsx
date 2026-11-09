"use client";

import { useState } from "react";
import { LuSparkles, LuX } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { post, del } from "@/lib/api";
import type { Habilidade } from "@/types/curriculo";
import { ResumeSection } from "./ResumeSection";

type SkillsSectionProps = { idCurriculo: number; value: Habilidade[]; onChange: (habilidades: Habilidade[]) => void };

export function SkillsSection({ idCurriculo, value, onChange }: SkillsSectionProps) {
  const [texto, setTexto] = useState("");
  const [falha, setFalha] = useState<string | null>(null);
  const [removendo, setRemovendo] = useState<number | null>(null);
  const { erro, enviando, onSubmit } = useFormSubmit(async () => {
    const habilidade = await post<Habilidade>(`/api/curriculo/${idCurriculo}/habilidades`, { descricao: texto.trim() });
    onChange([...value, habilidade]);
    setTexto("");
    setFalha(null);
  });
  return (
    <ResumeSection parte={2} titulo="Competências" descricao="Adicione ou remova uma habilidade por vez." icon={LuSparkles}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {value.map((habilidade) => <Badge key={habilidade.id} className="gap-2 px-3 py-1.5">{habilidade.descricao}<button type="button" disabled={removendo !== null || enviando} aria-label={`Remover ${habilidade.descricao}`} onClick={async () => {
            setRemovendo(habilidade.id);
            try { await del(`/api/curriculo/${idCurriculo}/habilidades/${habilidade.id}`); onChange(value.filter((item) => item.id !== habilidade.id)); }
            catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível remover a habilidade."); }
            finally { setRemovendo(null); }
          }}><LuX className="size-4" /></button></Badge>)}
          {value.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma competência cadastrada.</p>}
        </div>
        <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
          <Field className="min-w-48 flex-1"><FieldLabel htmlFor="competencia">Competência</FieldLabel><Input id="competencia" value={texto} onChange={(event) => setTexto(event.target.value)} required maxLength={45} disabled={removendo !== null || enviando} /></Field>
          <SubmitButton pending={enviando} disabled={removendo !== null} pendingLabel="Salvando...">Adicionar</SubmitButton>
        </form>
        <FormErrorAlert message={erro ?? falha} />
      </div>
    </ResumeSection>
  );
}
