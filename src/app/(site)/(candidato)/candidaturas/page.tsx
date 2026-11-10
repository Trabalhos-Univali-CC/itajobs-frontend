"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { get, del } from "@/lib/api";
import type { Candidatura } from "@/types/vaga";

export default function CandidaturasPage() {
  const [candidato, setCandidato] = useState("");
  const [candidaturas, setCandidaturas] = useState<Candidatura[] | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const [cancelando, setCancelando] = useState<number | null>(null);
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    const id = String(form.get("idCandidato"));
    setCandidaturas(await get<Candidatura[]>(`/api/candidato/${id}/candidaturas`));
    setCandidato(id);
    setFalha(null);
  });
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("candidato");
    if (!id) return;
    let ativo = true;
    get<Candidatura[]>(`/api/candidato/${encodeURIComponent(id)}/candidaturas`)
      .then((dados) => { if (ativo) { setCandidaturas(dados); setCandidato(id); } })
      .catch((error) => { if (ativo) setFalha(error.message); });
    return () => { ativo = false; };
  }, []);
  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title="Candidaturas" description="Consulte e cancele inscrições em vagas." />
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6">
        <Card className="p-6"><form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4"><IconInputField id="idCandidato" label="ID do candidato" icon={LuUserRound} type="number" min={1} required value={candidato} onChange={(event) => setCandidato(event.target.value)} /><SubmitButton pending={enviando} pendingLabel="Consultando...">Consultar</SubmitButton></form></Card>
        <FormErrorAlert message={erro ?? falha} />
        {candidaturas?.length === 0 && <p>Nenhuma candidatura encontrada.</p>}
        {candidaturas?.map((item) => <Card key={`${item.idVaga}-${item.idCandidato}`} className="gap-3 p-5">
          <Link href={`/vagas/${item.idVaga}`} className="font-semibold text-primary hover:underline">{item.cargo}</Link>
          <p className="text-sm">{item.nomeEmpresa} ? {item.nomeCandidato}</p>
          <p className="text-sm text-muted-foreground">{new Date(item.dataCandidatura).toLocaleDateString("pt-BR")}</p>
          <Button variant="outline" disabled={cancelando !== null} onClick={async () => {
            setCancelando(item.idVaga);
            try { await del(`/api/vaga/${item.idVaga}/candidaturas/${item.idCandidato}`); setCandidaturas((atuais) => atuais?.filter((candidatura) => candidatura.idVaga !== item.idVaga) ?? null); }
            catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível cancelar."); }
            finally { setCancelando(null); }
          }}>{cancelando === item.idVaga ? "Cancelando..." : "Cancelar candidatura"}</Button>
        </Card>)}
      </div>
    </main>
  );
}
