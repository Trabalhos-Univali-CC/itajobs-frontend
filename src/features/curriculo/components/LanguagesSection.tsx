"use client";

import { useRef, useState } from "react";
import { LuChartNoAxesColumn, LuLanguages, LuPlus } from "react-icons/lu";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { idiomasComuns, niveisIdioma } from "@/features/curriculo/opcoes";
import { novoIdLocal, useEstadoCurriculo, useFormularioCurriculo } from "../rascunhoCurriculo";
import type { Idioma, IdiomaCreate, NivelIdioma } from "@/types/curriculo";
import { ItemCard } from "./ItemCard";
import { ResumeSection } from "./ResumeSection";

type LanguagesSectionProps = { value: Idioma[]; onChange: (idiomas: Idioma[]) => void };

export function LanguagesSection({ value, onChange }: LanguagesSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [editando, setEditando] = useEstadoCurriculo<Idioma | null>("idiomas.editando", null);
  const [idioma, setIdioma] = useEstadoCurriculo("idiomas.idioma", "");
  const [nivel, setNivel] = useEstadoCurriculo<NivelIdioma | "">("idiomas.nivel", "");
  const [removendo, setRemovendo] = useState<number | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const linguas = editando && !idiomasComuns.includes(editando.idioma) ? [...idiomasComuns, editando.idioma] : idiomasComuns;
  const niveis = Object.entries(niveisIdioma).map(([value, label]) => ({ value, label }));
  const { erro, enviando, onSubmit } = useFormularioCurriculo("idiomas", formRef, async () => {
    if (!idioma || !nivel) throw new Error("Selecione a língua e o nível de conhecimento.");
    const dados: IdiomaCreate = { idioma, nivel };
    const salvo = editando ? { ...dados, id: editando.id } : { ...dados, id: novoIdLocal(value) };
    onChange(editando ? value.map((item) => item.id === salvo.id ? salvo : item) : [...value, salvo]);
    setEditando(null);
    setIdioma("");
    setNivel("");
    setFalha(null);
  }, !!editando || !!idioma || !!nivel);

  return (
    <ResumeSection parte={7} titulo="Idiomas" descricao="Seja honesto no nível. Ele pode ser testado na entrevista." icon={LuLanguages}>
      <div className="flex flex-col gap-4">
        {value.length === 0 && <p className="text-sm text-muted-foreground">Nenhum idioma cadastrado.</p>}
        {value.map((item) => <ItemCard key={item.id} titulo={item.idioma} subtitulo={niveisIdioma[item.nivel]} onRemove={async () => {
          if (enviando || removendo !== null) return;
          setRemovendo(item.id);
          try { onChange(value.filter((idioma) => idioma.id !== item.id)); if (editando?.id === item.id) { setEditando(null); setIdioma(""); setNivel(""); } setFalha(null); }
          catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível remover o idioma."); }
          finally { setRemovendo(null); }
        }}><Button type="button" variant="outline" disabled={enviando || removendo !== null} onClick={() => { setEditando(item); setIdioma(item.idioma); setNivel(item.nivel); }}>Editar idioma</Button></ItemCard>)}
        <form id="idiomas" ref={formRef} onSubmit={onSubmit} className="rounded-xl border bg-muted/30 p-4">
          <fieldset disabled={enviando || removendo !== null} className="grid gap-3 sm:grid-cols-2">
            <Field><FieldLabel htmlFor="idioma">Língua</FieldLabel><Select items={linguas.map((lingua) => ({ value: lingua, label: lingua }))} value={idioma || null} onValueChange={(value) => setIdioma(value ?? "")} disabled={enviando || removendo !== null}><SelectTrigger id="idioma" className="w-full"><LuLanguages /><SelectValue placeholder="Selecione a língua" /></SelectTrigger><SelectContent>{linguas.map((lingua) => <SelectItem key={lingua} value={lingua}>{lingua}</SelectItem>)}</SelectContent></Select></Field>
            <Field><FieldLabel htmlFor="idioma-nivel">Nível</FieldLabel><Select items={niveis} value={nivel || null} onValueChange={(value) => setNivel(value as NivelIdioma || "")} disabled={enviando || removendo !== null}><SelectTrigger id="idioma-nivel" className="w-full"><LuChartNoAxesColumn /><SelectValue placeholder="Selecione o nível" /></SelectTrigger><SelectContent>{niveis.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></Field>
            <SubmitButton pending={enviando} pendingLabel="Adicionando..." icon={LuPlus} variant={editando ? "default" : "outline"} className="w-full border-dashed sm:col-span-2">{editando ? "Aplicar alterações" : "Adicionar idioma"}</SubmitButton>
            {editando && <Button type="button" variant="ghost" disabled={enviando} className="sm:col-span-2" onClick={() => { setEditando(null); setIdioma(""); setNivel(""); }}>Cancelar edição do idioma</Button>}
          </fieldset>
        </form>
        <FormErrorAlert message={erro ?? falha} />
      </div>
    </ResumeSection>
  );
}
