"use client";

import { useRef, useState } from "react";
import { LuBriefcaseBusiness, LuBuilding2, LuIdCard, LuPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { MonthYearField } from "@/components/form/MonthYearField";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { novoIdLocal, useEstadoCurriculo, useFormularioCurriculo } from "../rascunhoCurriculo";
import type { Experiencia, ExperienciaCreate } from "@/types/curriculo";
import { ItemCard } from "./ItemCard";
import { ResumeSection } from "./ResumeSection";

type ExperienceSectionProps = { value: Experiencia[]; onChange: (experiencias: Experiencia[]) => void };

export function ExperienceSection({ value, onChange }: ExperienceSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [editando, setEditando] = useEstadoCurriculo<Experiencia | null>("experiencias.editando", null);
  const [falha, setFalha] = useState<string | null>(null);
  const [removendo, setRemovendo] = useState<number | null>(null);
  const [inicio, setInicio] = useEstadoCurriculo("experiencias.inicio", "");
  const [fim, setFim] = useEstadoCurriculo("experiencias.fim", "");
  const [atual, setAtual] = useEstadoCurriculo("experiencias.atual", false);
  const { erro, enviando, onSubmit } = useFormularioCurriculo("experiencias", formRef, async (form) => {
    if (!/^\d{4}-\d{2}$/.test(inicio)) throw new Error("Informe o mês e o ano de início.");
    if (!atual && !/^\d{4}-\d{2}$/.test(fim)) throw new Error("Informe o fim ou marque que trabalha aqui atualmente.");
    const dados: ExperienciaCreate = {
      cargo: String(form.get("cargo")).trim(),
      nomeEmpresa: String(form.get("nomeEmpresa")).trim() || null,
      dataInicio: editando?.dataInicio.slice(0, 7) === inicio ? editando.dataInicio : `${inicio}-01`,
      dataFim: atual ? null : editando?.dataFim?.slice(0, 7) === fim ? editando.dataFim : `${fim}-01`,
      descricao: String(form.get("descricao") ?? "").trim() || null,
    };
    const salva = editando ? { ...dados, id: editando.id } : { ...dados, id: novoIdLocal(value) };
    onChange(editando ? value.map((item) => item.id === salva.id ? salva : item) : [...value, salva]);
    setEditando(null);
    setInicio("");
    setFim("");
    setAtual(false);
    formRef.current?.reset();
    setFalha(null);
  }, !!editando || !!inicio || !!fim || atual);
  return (
    <ResumeSection parte={4} titulo="Experiências" descricao="No currículo final elas aparecem da mais recente para a mais antiga." icon={LuBriefcaseBusiness}>
      <div className="flex flex-col gap-4">
        {value.length === 0 && <p className="rounded-xl bg-accent/50 px-4 py-3 text-sm text-primary">Ainda sem experiência formal? Tudo bem. Inclua estágios, trabalhos temporários e voluntariado.</p>}
        {[...value].sort((a, b) => b.dataInicio.localeCompare(a.dataInicio)).map((experiencia) => <ItemCard key={experiencia.id} titulo={experiencia.cargo} subtitulo={[experiencia.nomeEmpresa, `${experiencia.dataInicio.slice(0, 7)} — ${experiencia.dataFim?.slice(0, 7) ?? "Atual"}`].filter(Boolean).join(" · ")} onRemove={async () => {
          if (removendo !== null || enviando) return;
          setRemovendo(experiencia.id);
          try { onChange(value.filter((item) => item.id !== experiencia.id)); if (editando?.id === experiencia.id) { formRef.current?.reset(); setEditando(null); setInicio(""); setFim(""); setAtual(false); } }
          catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível remover a experiência."); }
          finally { setRemovendo(null); }
        }}>{experiencia.descricao && <p className="mb-3 text-sm break-words whitespace-pre-wrap text-muted-foreground">{experiencia.descricao}</p>}<Button type="button" variant="outline" disabled={enviando || removendo !== null} onClick={() => { formRef.current?.reset(); setEditando(experiencia); setInicio(experiencia.dataInicio.slice(0, 7)); setFim(experiencia.dataFim?.slice(0, 7) ?? ""); setAtual(experiencia.dataFim === null); }}>Editar experiência</Button></ItemCard>)}
        <form id="experiencias" ref={formRef} key={editando?.id ?? "nova"} onSubmit={onSubmit} className="rounded-xl border p-4 sm:p-5">
          <fieldset disabled={enviando || removendo !== null} className="grid gap-4 sm:grid-cols-2">
          <IconInputField id="nomeEmpresa" label="Empresa (opcional)" icon={LuBuilding2} maxLength={45} placeholder="Ex.: Porto de Itajaí" defaultValue={editando?.nomeEmpresa ?? ""} />
          <IconInputField id="cargo" label="Título do cargo" icon={LuIdCard} required minLength={2} maxLength={45} placeholder="Ex.: Assistente de logística" defaultValue={editando?.cargo} />
          <MonthYearField id="experiencia-inicio" label="Início" value={inicio} onChange={setInicio} disabled={enviando} />
          <MonthYearField id="experiencia-fim" label="Fim" value={atual ? "" : fim} onChange={setFim} disabled={atual || enviando} />
          <Field orientation="horizontal" className="sm:col-span-2"><Checkbox id="experiencia-atual" checked={atual} onCheckedChange={setAtual} disabled={enviando} /><FieldLabel htmlFor="experiencia-atual" className="font-normal">Trabalho aqui atualmente</FieldLabel></Field>
          <Field className="sm:col-span-2"><FieldLabel htmlFor="experiencia-descricao">Descrição</FieldLabel><Textarea id="experiencia-descricao" name="descricao" rows={3} maxLength={1000} defaultValue={editando?.descricao ?? ""} placeholder="Suas responsabilidades e conquistas nesta experiência" /></Field>
          <SubmitButton pending={enviando} icon={LuPlus} disabled={removendo !== null} variant={editando ? "default" : "outline"} pendingLabel="Adicionando..." className={editando ? "sm:col-span-2" : "w-full border-dashed sm:col-span-2"}>{editando ? "Aplicar alterações" : "Adicionar experiência"}</SubmitButton>
          {editando && <Button type="button" variant="ghost" disabled={enviando} onClick={() => { formRef.current?.reset(); setEditando(null); setInicio(""); setFim(""); setAtual(false); }}>Cancelar edição</Button>}
          </fieldset>
        </form>
        <FormErrorAlert message={erro ?? falha} />
      </div>
    </ResumeSection>
  );
}
