"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/card";
import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { get, post } from "@/lib/api";
import type { Vaga, Candidatura } from "@/types/vaga";

export default function VagaPage() {
  const { id } = useParams<{ id: string }>();
  const [registro, setVaga] = useState<Vaga | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const [candidatura, setCandidatura] = useState<Candidatura | null>(null);
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    setCandidatura(await post<Candidatura>(`/api/vaga/${id}/candidaturas`, { idCandidato: Number(form.get("idCandidato")) }));
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
        {!vaga && !falha && <p role="status">Carregando vaga...</p>}
        {vaga && <Card className="gap-5 p-6">
          <Link href={`/cadastros/empresa/${vaga.idEmpresa}`} className="font-semibold text-primary hover:underline">{vaga.nomeEmpresa}</Link>
          <p className="whitespace-pre-line">{vaga.descricao}</p>
          <p>{vaga.salario === null ? "Salário a combinar" : vaga.salario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          {candidatura ? <p role="status" className="text-primary">Candidatura registrada para {candidatura.nomeCandidato}. <Link className="underline" href={`/candidaturas?candidato=${candidatura.idCandidato}`}>Acompanhar candidaturas</Link></p> : <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4 border-t pt-5">
            <IconInputField id="idCandidato" label="ID do candidato" icon={LuUserRound} type="number" min={1} required description="O candidato precisa ter um currículo cadastrado." />
            <SubmitButton pending={enviando} pendingLabel="Enviando...">Candidatar-se</SubmitButton>
          </form>}
        </Card>}
      </div>
    </main>
  );
}
