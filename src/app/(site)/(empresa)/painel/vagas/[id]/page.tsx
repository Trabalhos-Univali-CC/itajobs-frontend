"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { VagaForm } from "@/features/vagas/components/VagaForm";
import { get, del } from "@/lib/api";
import type { Vaga, Candidatura } from "@/types/vaga";

export default function VagaEmpresaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [registro, setVaga] = useState<Vaga | null>(null);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  useEffect(() => {
    let ativo = true;
    Promise.all([get<Vaga>(`/api/vaga/${id}`), get<Candidatura[]>(`/api/vaga/${id}/candidaturas`)])
      .then(([dados, inscritos]) => { if (ativo) { setVaga(dados); setCandidaturas(inscritos); } })
      .catch((error) => { if (ativo) setErro(error.message); });
    return () => { ativo = false; };
  }, [id]);
  const vaga = registro?.id === Number(id) ? registro : null;

  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title={vaga?.cargo ?? "Detalhes da vaga"} description={vaga?.nomeEmpresa ?? "Consulte a vaga e os candidatos inscritos."} />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6">
        <FormErrorAlert message={erro} />
        {!vaga && !erro && <p role="status">Carregando vaga...</p>}
        {vaga && <>
          <VagaForm vaga={vaga} onSave={setVaga} />
          <details className="rounded-xl border p-4"><summary className="cursor-pointer text-destructive">Excluir vaga</summary><p className="my-3 text-sm">A exclusão também remove suas candidaturas.</p><Button variant="destructive" disabled={excluindo} onClick={async () => {
            setExcluindo(true);
            try { await del(`/api/vaga/${id}`); router.replace(`/painel/vagas?empresa=${vaga.idEmpresa}`); }
            catch (error) { setErro(error instanceof Error ? error.message : "Não foi possível excluir a vaga."); setExcluindo(false); }
          }}>Confirmar exclusão</Button></details>
          <h2 className="text-xl font-semibold">Candidatos inscritos</h2>
          {candidaturas.length === 0 && <p>Nenhuma candidatura recebida.</p>}
          {candidaturas.map((candidatura) => <Card key={candidatura.idCandidato} className="gap-2 p-5"><Link href={`/painel/candidatos/${candidatura.idCandidato}`} className="font-semibold text-primary hover:underline">{candidatura.nomeCandidato}</Link><p className="text-sm text-muted-foreground">{new Date(candidatura.dataCandidatura).toLocaleDateString("pt-BR")}</p></Card>)}
        </>}
      </div>
    </main>
  );
}
