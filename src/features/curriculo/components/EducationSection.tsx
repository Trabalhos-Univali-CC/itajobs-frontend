"use client";

import { useRef, useState } from "react";
import { LuBookOpen, LuBuilding2, LuClock, LuGraduationCap, LuPlus } from "react-icons/lu";
import { IconInputField } from "@/components/form/IconInputField";
import { MonthYearField } from "@/components/form/MonthYearField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { niveisFormacao } from "@/features/curriculo/opcoes";
import { novoIdLocal, useEstadoCurriculo, useFormularioCurriculo } from "../rascunhoCurriculo";
import type { Curso, CursoCreate, Formacao, FormacaoCreate, NivelFormacao } from "@/types/curriculo";
import { ItemCard } from "./ItemCard";
import { ResumeSection } from "./ResumeSection";

type EducationSectionProps = { formacoes: Formacao[]; cursos: Curso[]; onFormacoesChange: (formacoes: Formacao[]) => void; onCursosChange: (cursos: Curso[]) => void };

export function EducationSection({ formacoes, cursos, onFormacoesChange, onCursosChange }: EducationSectionProps) {
  const formacaoRef = useRef<HTMLFormElement>(null);
  const cursoRef = useRef<HTMLFormElement>(null);
  const [editandoFormacao, setEditandoFormacao] = useEstadoCurriculo<Formacao | null>("formacoes.editandoFormacao", null);
  const [editandoCurso, setEditandoCurso] = useEstadoCurriculo<Curso | null>("formacoes.editandoCurso", null);
  const [nivel, setNivel] = useEstadoCurriculo<NivelFormacao | "">("formacoes.nivel", "");
  const [inicio, setInicio] = useEstadoCurriculo("formacoes.inicio", "");
  const [fim, setFim] = useEstadoCurriculo("formacoes.fim", "");
  const [conclusao, setConclusao] = useEstadoCurriculo("formacoes.conclusao", "");
  const [removendo, setRemovendo] = useState(false);
  const [falha, setFalha] = useState<string | null>(null);
  const niveis = Object.entries(niveisFormacao).map(([value, label]) => ({ value, label }));
  const { erro, enviando, onSubmit } = useFormularioCurriculo("formacoes", formacaoRef, async (form) => {
    if (!nivel) throw new Error("Selecione o título da formação.");
    if (!/^\d{4}-\d{2}$/.test(inicio) || (fim && !/^\d{4}-\d{2}$/.test(fim))) throw new Error("Complete o mês e o ano das datas da formação.");
    const dados: FormacaoCreate = {
      instituicao: String(form.get("instituicao")).trim(),
      curso: String(form.get("curso") ?? "").trim() || null,
      nivel,
      dataInicio: editandoFormacao?.dataInicio.slice(0, 7) === inicio ? editandoFormacao.dataInicio : `${inicio}-01`,
      dataFim: !fim ? null : editandoFormacao?.dataFim?.slice(0, 7) === fim ? editandoFormacao.dataFim : `${fim}-01`,
    };
    const salva = editandoFormacao ? { ...dados, id: editandoFormacao.id } : { ...dados, id: novoIdLocal(formacoes) };
    onFormacoesChange(editandoFormacao ? formacoes.map((item) => item.id === salva.id ? salva : item) : [...formacoes, salva]);
    setEditandoFormacao(null);
    setNivel(""); setInicio(""); setFim("");
    formacaoRef.current?.reset();
    setFalha(null);
  }, !!editandoFormacao || !!nivel || !!inicio || !!fim);
  const { erro: erroCurso, enviando: enviandoCurso, onSubmit: salvarCurso } = useFormularioCurriculo("cursos", cursoRef, async (form) => {
    if (conclusao && !/^\d{4}-\d{2}$/.test(conclusao)) throw new Error("Complete o mês e o ano de conclusão do curso.");
    const dados: CursoCreate = {
      nome: String(form.get("nome")).trim(),
      instituicao: String(form.get("instituicao") ?? "").trim() || null,
      cargaHoraria: form.get("cargaHoraria") ? Number(form.get("cargaHoraria")) : null,
      dataConclusao: !conclusao ? null : editandoCurso?.dataConclusao?.slice(0, 7) === conclusao ? editandoCurso.dataConclusao : `${conclusao}-01`,
    };
    const salvo = editandoCurso ? { ...dados, id: editandoCurso.id } : { ...dados, id: novoIdLocal(cursos) };
    onCursosChange(editandoCurso ? cursos.map((item) => item.id === salvo.id ? salvo : item) : [...cursos, salvo]);
    setEditandoCurso(null); setConclusao("");
    cursoRef.current?.reset();
    setFalha(null);
  }, !!editandoCurso || !!conclusao);

  return (
    <ResumeSection parte={6} titulo="Formações" descricao="Escolaridade, cursos técnicos, graduação e certificações. Em andamento? Informe a previsão de conclusão." icon={LuGraduationCap}>
      <div className="flex flex-col gap-4">
        {[...formacoes].sort((a, b) => b.dataInicio.localeCompare(a.dataInicio)).map((formacao) => <ItemCard key={formacao.id} titulo={formacao.curso || formacao.instituicao} subtitulo={[niveisFormacao[formacao.nivel], formacao.instituicao].join(" · ")} onRemove={async () => {
          if (removendo || enviando || enviandoCurso) return;
          setRemovendo(true);
          try { onFormacoesChange(formacoes.filter((item) => item.id !== formacao.id)); if (editandoFormacao?.id === formacao.id) { formacaoRef.current?.reset(); setEditandoFormacao(null); setNivel(""); setInicio(""); setFim(""); } }
          catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível remover a formação."); }
          finally { setRemovendo(false); }
        }}><Button type="button" variant="outline" disabled={removendo || enviando} onClick={() => { formacaoRef.current?.reset(); setEditandoFormacao(formacao); setNivel(formacao.nivel); setInicio(formacao.dataInicio.slice(0, 7)); setFim(formacao.dataFim?.slice(0, 7) ?? ""); }}>Editar formação</Button></ItemCard>)}
        <form id="formacoes" ref={formacaoRef} key={editandoFormacao?.id ?? "nova-formacao"} onSubmit={onSubmit} className="rounded-xl border p-4 sm:p-5">
          <fieldset disabled={enviando || removendo} className="grid gap-4 sm:grid-cols-2">
            <Field><FieldLabel htmlFor="formacao-titulo">Título</FieldLabel><Select items={niveis} value={nivel || null} onValueChange={(value) => setNivel(value as NivelFormacao || "")} disabled={enviando}><SelectTrigger id="formacao-titulo" className="w-full"><LuGraduationCap /><SelectValue placeholder="Selecione o nível" /></SelectTrigger><SelectContent>{niveis.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></Field>
            <IconInputField id="formacao-curso" name="curso" label="Curso (opcional)" icon={LuBookOpen} maxLength={100} defaultValue={editandoFormacao?.curso ?? ""} placeholder="Ex.: Engenharia de Software" />
            <IconInputField id="formacao-instituicao" name="instituicao" label="Instituição" icon={LuBuilding2} required minLength={2} maxLength={100} defaultValue={editandoFormacao?.instituicao} placeholder="Ex.: UNIVALI" className="sm:col-span-2" />
            <MonthYearField id="formacao-inicio" label="Início da formação" value={inicio} onChange={setInicio} disabled={enviando} />
            <MonthYearField id="formacao-fim" label="Conclusão (ou previsão)" value={fim} onChange={setFim} futureYears={8} disabled={enviando} />
            <SubmitButton pending={enviando} pendingLabel="Adicionando..." icon={LuPlus} variant={editandoFormacao ? "default" : "outline"} className="w-full border-dashed sm:col-span-2">{editandoFormacao ? "Aplicar alterações" : "Adicionar formação"}</SubmitButton>
            {editandoFormacao && <Button type="button" variant="ghost" onClick={() => { formacaoRef.current?.reset(); setEditandoFormacao(null); setNivel(""); setInicio(""); setFim(""); }}>Cancelar edição da formação</Button>}
          </fieldset>
        </form>
        <FormErrorAlert message={erro ?? falha} />
        <h3 className="mt-2 text-sm font-semibold text-card-foreground">Cursos e certificações</h3>
        {cursos.map((curso) => <ItemCard key={curso.id} titulo={curso.nome} subtitulo={[curso.instituicao, curso.cargaHoraria ? `${curso.cargaHoraria} horas` : null].filter(Boolean).join(" · ")} onRemove={async () => {
          if (removendo || enviando || enviandoCurso) return;
          setRemovendo(true);
          try { onCursosChange(cursos.filter((item) => item.id !== curso.id)); if (editandoCurso?.id === curso.id) { cursoRef.current?.reset(); setEditandoCurso(null); setConclusao(""); } }
          catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível remover o curso."); }
          finally { setRemovendo(false); }
        }}><Button type="button" variant="outline" disabled={removendo || enviandoCurso} onClick={() => { cursoRef.current?.reset(); setEditandoCurso(curso); setConclusao(curso.dataConclusao?.slice(0, 7) ?? ""); }}>Editar curso</Button></ItemCard>)}
        <form id="cursos" ref={cursoRef} key={editandoCurso?.id ?? "novo-curso"} onSubmit={salvarCurso} className="rounded-xl border p-4 sm:p-5">
          <fieldset disabled={enviandoCurso || removendo} className="grid gap-4 sm:grid-cols-2">
            <IconInputField id="curso-nome" name="nome" label="Nome do curso" icon={LuBookOpen} required minLength={2} maxLength={100} defaultValue={editandoCurso?.nome} placeholder="Ex.: Excel avançado" />
            <IconInputField id="curso-instituicao" name="instituicao" label="Instituição do curso (opcional)" icon={LuBuilding2} maxLength={100} defaultValue={editandoCurso?.instituicao ?? ""} />
            <IconInputField id="curso-carga" name="cargaHoraria" label="Carga horária (opcional)" icon={LuClock} type="number" min={1} max={10000} defaultValue={editandoCurso?.cargaHoraria ?? ""} />
            <MonthYearField id="curso-conclusao" label="Conclusão do curso" value={conclusao} onChange={setConclusao} disabled={enviandoCurso} />
            <SubmitButton pending={enviandoCurso} pendingLabel="Adicionando..." icon={LuPlus} variant={editandoCurso ? "default" : "outline"} className="h-auto min-h-11 w-full border-dashed py-2 whitespace-normal sm:col-span-2">{editandoCurso ? "Aplicar alterações" : "Adicionar curso ou certificação"}</SubmitButton>
            {editandoCurso && <Button type="button" variant="ghost" onClick={() => { cursoRef.current?.reset(); setEditandoCurso(null); setConclusao(""); }}>Cancelar edição do curso</Button>}
          </fieldset>
        </form>
        <FormErrorAlert message={erroCurso} />
      </div>
    </ResumeSection>
  );
}
