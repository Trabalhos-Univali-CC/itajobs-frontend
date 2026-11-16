"use client";

import { PageLoading } from "@/components/ui/page-loading";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { VagaPreview } from "@/features/vagas/components/VagaPreview";
import { useUsuario } from "@/features/auth/sessionContext";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { get, post } from "@/lib/api";
import type { Vaga, Candidatura } from "@/types/vaga";

export default function VagaPage() {
  const usuario = useUsuario();
  const { id } = useParams<{ id: string }>();
  const [registro, setVaga] = useState<Vaga | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const [candidatura, setCandidatura] = useState<Candidatura | null>(null);
  const { erro, enviando, onSubmit } = useFormSubmit(async () => {
    setCandidatura(await post<Candidatura>(`/api/vaga/${id}/candidaturas`, { idCandidato: usuario.id }));
  });
  useEffect(() => {
    let ativo = true;
    get<Vaga>(`/api/vaga/${id}`).then((dados) => { if (ativo) setVaga(dados); }).catch((error) => { if (ativo) setFalha(error.message); });
    return () => { ativo = false; };
  }, [id]);
  const vaga = registro?.id === Number(id) ? registro : null;

  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title={vaga?.cargo ?? "Detalhes da vaga"} description={vaga?.nomeEmpresa ?? "Consulte a oportunidade."} />
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6">
        <FormErrorAlert message={falha ?? erro} />
        {!vaga && !falha && <PageLoading label="Carregando vaga..." />}
        {vaga && <VagaPreview vaga={vaga}>
          <Link href={`/cadastros/empresa/${vaga.idEmpresa}`} className="mb-4 inline-flex text-sm font-semibold text-primary hover:underline">Ver empresa</Link>
          {usuario.tipo === "candidato" && (candidatura ? <p role="status" className="text-primary">Candidatura registrada para {candidatura.nomeCandidato}. <Link className="underline" href={`/cadastros/candidato/${usuario.id}#minhas-candidaturas`}>Acompanhar candidaturas</Link></p> : <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4 border-t pt-5">
            <p className="text-sm text-muted-foreground">Você se candidatará como {usuario.nome}. É necessário ter um currículo cadastrado.</p>
            <SubmitButton pending={enviando} pendingLabel="Enviando...">Candidatar-se</SubmitButton>
          </form>)}
        </VagaPreview>}
      </div>
    </main>
  );
}
