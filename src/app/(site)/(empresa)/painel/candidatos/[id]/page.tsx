"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { ResumePreview } from "@/features/curriculo/components/ResumePreview";
import { buscarCurriculo } from "@/features/curriculo/curriculoApi";
import { get } from "@/lib/api";
import type { Candidato } from "@/types/usuario";
import type { Curriculo } from "@/types/curriculo";

export default function CandidatoPage() {
  const { id } = useParams<{ id: string }>();
  const [dados, setDados] = useState<{ candidato: Candidato; curriculo: Curriculo | null } | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  useEffect(() => {
    let ativo = true;
    Promise.all([get<Candidato>(`/api/candidato/${id}`), buscarCurriculo(Number(id))])
      .then(([candidato, curriculo]) => { if (ativo) setDados({ candidato, curriculo }); })
      .catch((error) => { if (ativo) setErro(error.message); });
    return () => { ativo = false; };
  }, [id]);
  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title={dados ? `${dados.candidato.nome} ${dados.candidato.sobrenome}` : "Currículo do candidato"} description="Informações cadastradas pelo candidato." />
      <div className="mx-auto max-w-3xl space-y-5 px-6">
        <FormErrorAlert message={erro} />
        {!dados && !erro && <p role="status">Carregando candidato...</p>}
        {dados && (dados.curriculo ? <ResumePreview candidato={dados.candidato} curriculo={dados.curriculo} /> : <p>O candidato ainda não cadastrou um currículo.</p>)}
        <Link className="inline-block text-primary underline" href={`/cadastros/candidato/${id}`}>Ver cadastro</Link>
      </div>
    </main>
  );
}
