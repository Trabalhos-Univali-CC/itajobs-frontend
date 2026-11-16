"use client";

import { PageLoading } from "@/components/ui/page-loading";
import { useEffect, useState } from "react";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { buscarCurriculo } from "@/features/curriculo/curriculoApi";
import { get } from "@/lib/api";
import type { Curriculo } from "@/types/curriculo";
import type { Candidato } from "@/types/usuario";
import { ResumeEditor } from "./ResumeEditor";
import { lerRascunho } from "../rascunhoCurriculo";

type Dados = { candidato: Candidato; curriculo: Curriculo | null };

export function ResumeLoader({ idCandidato }: { idCandidato: number }) {
  const [dados, setDados] = useState<Dados | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const carregando = !!idCandidato && !dados && !falha;
  useEffect(() => {
    const id = idCandidato;
    if (!id || id < 1) return;
    let ativo = true;
    Promise.all([get<Candidato>(`/api/candidato/${id}`), buscarCurriculo(id)])
      .then(async ([candidato, curriculo]) => {
        if (!ativo) return;
        if (ativo) setDados({ candidato, curriculo });
      })
      .catch((error) => {
        if (!ativo) return;
        try {
          const rascunho = lerRascunho(id);
          if (rascunho) { setDados({ candidato: rascunho.candidato, curriculo: rascunho.base }); return; }
        } catch {}
        setFalha(error.message);
      });
    return () => { ativo = false; };
  }, [idCandidato]);
  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-6xl px-6"><FormErrorAlert message={falha} />{carregando && <PageLoading label="Carregando currículo..." />}</div>
      {dados && <ResumeEditor key={`${dados.candidato.id}-${dados.curriculo?.id ?? "novo"}`} candidato={dados.candidato} curriculo={dados.curriculo} />}
    </div>
  );
}
