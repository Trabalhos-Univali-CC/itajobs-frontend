"use client";

import { useEffect } from "react";
import { LuEye, LuNotebookPen, LuSave, LuShieldCheck, LuTrash2, LuTriangleAlert } from "react-icons/lu";
import { TextareaField } from "@/components/form/TextareaField";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { SubmitButton } from "@/components/form/SubmitButton";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { useUsuario } from "@/features/auth/sessionContext";
import type { Curriculo } from "@/types/curriculo";
import type { Candidato } from "@/types/usuario";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { SkillsSection } from "./SkillsSection";
import { ExperienceSection } from "./ExperienceSection";
import { EducationSection } from "./EducationSection";
import { ProjectsSection } from "./ProjectsSection";
import { LanguagesSection } from "./LanguagesSection";
import { ResumePreview } from "./ResumePreview";
import { ResumeSection } from "./ResumeSection";
import { curriculoVazio, RascunhoCurriculoContext, useEditorCurriculo } from "../rascunhoCurriculo";

export function ResumeEditor({ candidato, curriculo }: { candidato: Candidato; curriculo: Curriculo | null }) {
  const { setFoto } = useUsuario();
  const { contexto, dados, imagem, erro, enviando, onSubmit, capture, reset, salvo } = useEditorCurriculo(candidato, curriculo);
  const { alterar } = contexto;
  const resumo = dados.resumo ?? "";
  const portfolio = dados.portfolio ?? "";
  useEffect(() => {
    const foto = contexto.rascunho.base?.arquivos.find((arquivo) => arquivo.tipo === "foto");
    const id = contexto.rascunho.base?.id;
    setFoto(foto && id ? `/api/curriculo/${id}/arquivos/foto?v=${encodeURIComponent(foto.enviadoEm)}` : null);
  }, [contexto.rascunho.base, setFoto]);
  return (
    <RascunhoCurriculoContext.Provider value={contexto}>
    <div onChangeCapture={capture} onResetCapture={reset} className="relative z-10 mx-auto mt-4 grid max-w-6xl items-start gap-6 px-4 pb-40 sm:px-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:pb-0">
      <div key={contexto.rascunho.revisao ?? 0} className="flex min-w-0 flex-col gap-5">
        <PersonalInfoSection candidato={candidato} imagem={imagem} portfolio={portfolio} onPortfolioChange={(portfolio) => alterar((estado) => ({ ...estado, dados: { ...estado.dados, portfolio } }))} />
        <ResumeSection parte={2} titulo="Resumo profissional" descricao="É a primeira coisa que o recrutador lê. Três a cinco frases diretas, sem pronomes em excesso." icon={LuNotebookPen}>
          <form id="curriculo-resumo" onSubmit={onSubmit}>
            <TextareaField id="resumo" label="Sobre você" value={resumo} onChange={(resumo) => alterar((estado) => ({ ...estado, dados: { ...estado.dados, resumo } }))} maxLength={2000} idealLength={200} rows={5} placeholder="Ex.: Profissional de logística com experiência em operações portuárias. Atuo com planejamento de cargas e documentação de exportação." description="Diga sua área, sua experiência, seus pontos fortes e o que busca. Ideal: a partir de 200 caracteres." />
          </form>
        </ResumeSection>
        <SkillsSection value={dados?.habilidades ?? []} onChange={(habilidades) => alterar((estado) => ({ ...estado, dados: { ...estado.dados, habilidades } }))} />
        <ExperienceSection value={dados?.experiencias ?? []} onChange={(experiencias) => alterar((estado) => ({ ...estado, dados: { ...estado.dados, experiencias } }))} />
        <ProjectsSection value={dados?.projetos ?? []} onChange={(projetos) => alterar((estado) => ({ ...estado, dados: { ...estado.dados, projetos } }))} />
        <EducationSection formacoes={dados?.formacoes ?? []} cursos={dados?.cursos ?? []} onFormacoesChange={(formacoes) => alterar((estado) => ({ ...estado, dados: { ...estado.dados, formacoes } }))} onCursosChange={(cursos) => alterar((estado) => ({ ...estado, dados: { ...estado.dados, cursos } }))} />
        <LanguagesSection value={dados?.idiomas ?? []} onChange={(idiomas) => alterar((estado) => ({ ...estado, dados: { ...estado.dados, idiomas } }))} />
        <section aria-labelledby="curriculo-zona-vermelha" className="scroll-mt-40 overflow-hidden rounded-2xl border border-destructive/25 bg-card">
          <div className="flex items-center gap-2.5 border-b border-destructive/15 bg-destructive/5 px-5 py-3 sm:px-6"><LuTriangleAlert aria-hidden className="size-4 text-destructive" /><h2 id="curriculo-zona-vermelha" className="text-sm font-semibold text-destructive">Zona vermelha</h2></div>
          <div className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="min-w-0"><h3 className="text-sm font-semibold">Limpar currículo</h3><p className="mt-0.5 max-w-md text-xs leading-relaxed text-muted-foreground">Limpe o resumo, a foto e as informações adicionadas para preencher seu currículo novamente. Seu cadastro continuará ativo.</p></div>
            <ConfirmationDialog
              trigger={<Button type="button" variant="destructive" disabled={enviando} className="shrink-0 gap-2"><LuTrash2 aria-hidden className="size-4" />Limpar currículo</Button>}
              title="Limpar currículo?"
              description="Você está prestes a limpar as informações do seu currículo. A limpeza será aplicada ao clicar em Salvar dados."
              confirmLabel="Sim, limpar currículo"
              pendingLabel="Limpando currículo..."
              warning="Resumo, portfólio, foto, competências, experiências, projetos, formações, cursos, idiomas e arquivos serão limpos. Você poderá preencher seu currículo novamente."
              variant="destructive"
              onConfirm={async () => alterar((estado) => ({ ...estado, dados: { ...curriculoVazio(candidato), id: estado.dados.id }, campos: {}, foto: null, revisao: (estado.revisao ?? 0) + 1 }))}
            >
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><LuShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />Seu cadastro e seu acesso ao ItaJobs continuarão ativos.</p>
            </ConfirmationDialog>
          </div>
        </section>
      </div>
      <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7.5rem)] lg:self-start">
        <div className="hidden shrink-0 flex-col gap-3 lg:flex">
          <FormErrorAlert message={erro} />
          <SubmitButton form="curriculo-resumo" pending={enviando} pendingLabel="Salvando..." icon={LuSave} size="lg" className="w-full">Salvar dados</SubmitButton>
          {salvo && <p role="status" className="text-center text-xs text-muted-foreground">Dados salvos.</p>}
        </div>
        <div className="min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-1"><p className="mb-2 flex items-center gap-2 px-1 text-sm font-medium text-muted-foreground"><LuEye className="size-4" />Pré-visualização</p><ResumePreview candidato={candidato} curriculo={dados} resumo={resumo} portfolio={portfolio} imagem={imagem} /></div>
      </aside>
      <div className="fixed inset-x-4 bottom-4 z-40 flex flex-col gap-3 sm:inset-x-6 lg:hidden">
        <FormErrorAlert message={erro} />
        <SubmitButton form="curriculo-resumo" pending={enviando} pendingLabel="Salvando..." icon={LuSave} size="lg" className="w-full">Salvar dados</SubmitButton>
        {salvo && <p role="status" className="mt-1 text-center text-xs text-muted-foreground">Dados salvos.</p>}
      </div>
    </div>
    </RascunhoCurriculoContext.Provider>
  );
}
