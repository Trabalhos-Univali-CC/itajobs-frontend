"use client";

import { useRef, useState } from "react";
import { LuBriefcaseBusiness, LuBuilding2, LuIdCard, LuCalendar } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { post, put, del } from "@/lib/api";
import type { Experiencia, ExperienciaCreate } from "@/types/curriculo";
import { ItemCard } from "./ItemCard";
import { ResumeSection } from "./ResumeSection";

type ExperienceSectionProps = { idCurriculo: number; value: Experiencia[]; onChange: (experiencias: Experiencia[]) => void };

export function ExperienceSection({ idCurriculo, value, onChange }: ExperienceSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [editando, setEditando] = useState<Experiencia | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const [removendo, setRemovendo] = useState<number | null>(null);
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    const dados: ExperienciaCreate = { cargo: String(form.get("cargo")).trim(), nomeEmpresa: String(form.get("nomeEmpresa")).trim() || null, dataInicio: String(form.get("dataInicio")), dataFim: String(form.get("dataFim")) || null };
    const salva = editando ? await put<Experiencia>(`/api/curriculo/${idCurriculo}/experiencias/${editando.id}`, dados) : await post<Experiencia>(`/api/curriculo/${idCurriculo}/experiencias`, dados);
    onChange(editando ? value.map((item) => item.id === salva.id ? salva : item) : [...value, salva]);
    setEditando(null);
    formRef.current?.reset();
    setFalha(null);
  });
  return (
    <ResumeSection parte={3} titulo="Experiências" descricao="Salve cada experiência individualmente. Deixe o fim vazio para o emprego atual." icon={LuBriefcaseBusiness}>
      <div className="flex flex-col gap-4">
        {value.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma experiência cadastrada.</p>}
        {value.map((experiencia) => <ItemCard key={experiencia.id} titulo={experiencia.cargo} subtitulo={`${experiencia.nomeEmpresa ?? "Empresa não informada"} ? ${experiencia.dataInicio} ? ${experiencia.dataFim ?? "Atual"}`} onRemove={async () => {
          if (removendo !== null || enviando) return;
          setRemovendo(experiencia.id);
          try { await del(`/api/curriculo/${idCurriculo}/experiencias/${experiencia.id}`); onChange(value.filter((item) => item.id !== experiencia.id)); if (editando?.id === experiencia.id) setEditando(null); }
          catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível remover a experiência."); }
          finally { setRemovendo(null); }
        }}><Button type="button" variant="outline" disabled={enviando || removendo !== null} onClick={() => setEditando(experiencia)}>Editar experiência</Button></ItemCard>)}
        <form ref={formRef} key={editando?.id ?? "nova"} onSubmit={onSubmit} className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
          <IconInputField id="nomeEmpresa" label="Empresa (opcional)" icon={LuBuilding2} maxLength={45} defaultValue={editando?.nomeEmpresa ?? ""} />
          <IconInputField id="cargo" label="Cargo" icon={LuIdCard} required minLength={2} maxLength={45} defaultValue={editando?.cargo} />
          <IconInputField id="dataInicio" label="Início" icon={LuCalendar} type="date" required max={new Date().toISOString().slice(0, 10)} defaultValue={editando?.dataInicio} />
          <IconInputField id="dataFim" label="Fim (opcional)" icon={LuCalendar} type="date" max={new Date().toISOString().slice(0, 10)} defaultValue={editando?.dataFim ?? ""} />
          <SubmitButton pending={enviando} disabled={removendo !== null} pendingLabel="Salvando...">{editando ? "Salvar experiência" : "Adicionar experiência"}</SubmitButton>
          {editando && <Button type="button" variant="ghost" disabled={enviando} onClick={() => setEditando(null)}>Cancelar edição</Button>}
        </form>
        <FormErrorAlert message={erro ?? falha} />
      </div>
    </ResumeSection>
  );
}
