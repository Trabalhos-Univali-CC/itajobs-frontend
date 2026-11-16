"use client";

import { useRef, useState } from "react";
import { LuFolderKanban, LuPlus, LuType } from "react-icons/lu";
import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { novoIdLocal, useEstadoCurriculo, useFormularioCurriculo } from "../rascunhoCurriculo";
import type { Projeto, ProjetoCreate } from "@/types/curriculo";
import { ItemCard } from "./ItemCard";
import { ResumeSection } from "./ResumeSection";

type ProjectsSectionProps = { value: Projeto[]; onChange: (projetos: Projeto[]) => void };

export function ProjectsSection({ value, onChange }: ProjectsSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [editando, setEditando] = useEstadoCurriculo<Projeto | null>("projetos.editando", null);
  const [removendo, setRemovendo] = useState<number | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const { erro, enviando, onSubmit } = useFormularioCurriculo("projetos", formRef, async (form) => {
    const dados: ProjetoCreate = { titulo: String(form.get("titulo") ?? "").trim(), descricao: String(form.get("descricao") ?? "").trim() || null };
    const salvo = editando ? { ...dados, id: editando.id } : { ...dados, id: novoIdLocal(value) };
    onChange(editando ? value.map((item) => item.id === salvo.id ? salvo : item) : [...value, salvo]);
    setEditando(null);
    formRef.current?.reset();
    setFalha(null);
  }, !!editando);

  return (
    <ResumeSection parte={5} titulo="Projetos e atividades" descricao="Trabalhos acadêmicos, voluntariado, eventos e projetos pessoais que mostram o que você sabe fazer." icon={LuFolderKanban} opcional>
      <div className="flex flex-col gap-4">
        {value.length === 0 && <p className="text-sm text-muted-foreground">Nenhum projeto ou atividade cadastrado.</p>}
        {value.map((projeto) => <ItemCard key={projeto.id} titulo={projeto.titulo} onRemove={async () => {
          if (enviando || removendo !== null) return;
          setRemovendo(projeto.id);
          try { onChange(value.filter((item) => item.id !== projeto.id)); if (editando?.id === projeto.id) { formRef.current?.reset(); setEditando(null); } setFalha(null); }
          catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível remover o projeto."); }
          finally { setRemovendo(null); }
        }}>
          {projeto.descricao && <p className="mb-3 text-sm break-words whitespace-pre-wrap text-muted-foreground">{projeto.descricao}</p>}
          <Button type="button" variant="outline" disabled={enviando || removendo !== null} onClick={() => { formRef.current?.reset(); setEditando(projeto); }}>Editar projeto</Button>
        </ItemCard>)}
        <form id="projetos" ref={formRef} key={editando?.id ?? "novo"} onSubmit={onSubmit} className="rounded-xl border p-4 sm:p-5">
          <fieldset disabled={enviando || removendo !== null} className="grid gap-4">
            <IconInputField id="projeto-titulo" name="titulo" label="Título" icon={LuType} required minLength={2} maxLength={100} defaultValue={editando?.titulo} placeholder="Ex.: Voluntário na Marejada" />
            <Field><FieldLabel htmlFor="projeto-descricao">Descrição do projeto</FieldLabel><Textarea id="projeto-descricao" name="descricao" rows={3} maxLength={1000} defaultValue={editando?.descricao ?? ""} placeholder="O que você fez, com quais ferramentas e qual foi o resultado." /></Field>
            <SubmitButton pending={enviando} pendingLabel="Adicionando..." icon={LuPlus} variant={editando ? "default" : "outline"} className="h-auto min-h-11 w-full border-dashed py-2 whitespace-normal">{editando ? "Aplicar alterações" : "Adicionar projeto ou atividade"}</SubmitButton>
            {editando && <Button type="button" variant="ghost" disabled={enviando} onClick={() => { formRef.current?.reset(); setEditando(null); }}>Cancelar edição do projeto</Button>}
          </fieldset>
        </form>
        <FormErrorAlert message={erro ?? falha} />
      </div>
    </ResumeSection>
  );
}
