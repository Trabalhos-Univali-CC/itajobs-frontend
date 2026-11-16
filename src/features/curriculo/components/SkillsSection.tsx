"use client";

import { useRef, useState } from "react";
import { LuSparkles, LuX } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { novoIdLocal, useEstadoCurriculo, useFormularioCurriculo } from "../rascunhoCurriculo";
import type { Habilidade } from "@/types/curriculo";
import { ResumeSection } from "./ResumeSection";

type SkillsSectionProps = { value: Habilidade[]; onChange: (habilidades: Habilidade[]) => void };

export function SkillsSection({ value, onChange }: SkillsSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [texto, setTexto] = useEstadoCurriculo("habilidades.texto", "");
  const [falha, setFalha] = useState<string | null>(null);
  const [removendo, setRemovendo] = useState<number | null>(null);
  const { erro, enviando, onSubmit } = useFormularioCurriculo("habilidades", formRef, async () => {
    const descricao = texto.trim();
    if (!descricao) throw new Error("Informe uma competência.");
    try {
      const habilidade = { id: novoIdLocal(value), descricao };
      if (value.some((item) => item.descricao.toLocaleLowerCase() === descricao.toLocaleLowerCase())) throw new Error("Esta competência já foi adicionada.");
      onChange([...value, habilidade]);
      setTexto("");
      setFalha(null);
    } catch (error) {
      setTexto((atual) => atual || descricao);
      throw error;
    }
  }, !!texto.trim());
  return (
    <ResumeSection parte={3} titulo="Competências" descricao="Destaque as habilidades que você usa no trabalho." icon={LuSparkles}>
      <div className="space-y-4">
        <div className="flex min-h-8 flex-wrap items-center gap-2">
          {value.map((habilidade) => <Badge key={habilidade.id} className="h-auto min-h-8 max-w-full gap-0.5 py-1 pr-1.5 pl-3 text-sm font-semibold"><span className="min-w-0 truncate" title={habilidade.descricao}>{habilidade.descricao}</span><button type="button" className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-white/15 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70 disabled:opacity-50" disabled={removendo !== null || enviando} aria-label={`Remover ${habilidade.descricao}`} onClick={async () => {
            setRemovendo(habilidade.id);
            try { onChange(value.filter((item) => item.id !== habilidade.id)); }
            catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível remover a habilidade."); }
            finally { setRemovendo(null); }
          }}><LuX aria-hidden className="size-3.5" /></button></Badge>)}
          {value.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma competência cadastrada.</p>}
        </div>
        <form id="habilidades" ref={formRef} onSubmit={(event) => {
          if (enviando || removendo !== null) { event.preventDefault(); return; }
          inputRef.current?.focus({ preventScroll: true });
          onSubmit(event);
        }} className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Field className="min-w-0"><FieldLabel htmlFor="competencia">Competência</FieldLabel><Input ref={inputRef} id="competencia" value={texto} onChange={(event) => setTexto(event.target.value)} required maxLength={45} disabled={enviando} /></Field>
          <SubmitButton pending={enviando} disabled={removendo !== null} pendingLabel="Adicionando..." className="sm:w-36">Adicionar</SubmitButton>
        </form>
        <FormErrorAlert message={erro ?? falha} />
      </div>
    </ResumeSection>
  );
}
