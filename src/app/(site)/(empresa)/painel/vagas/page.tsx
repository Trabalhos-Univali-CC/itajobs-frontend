"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuBuilding2 } from "react-icons/lu";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/card";
import { IconInputField } from "@/components/form/IconInputField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { get } from "@/lib/api";
import type { Vaga } from "@/types/vaga";

export default function VagasEmpresaPage() {
  const [empresa, setEmpresa] = useState("");
  const [vagas, setVagas] = useState<Vaga[] | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    const id = String(form.get("idEmpresa"));
    setVagas(await get<Vaga[]>(`/api/vaga?idEmpresa=${encodeURIComponent(id)}`));
    setEmpresa(id);
    setFalha(null);
  });
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("empresa");
    if (!id) return;
    let ativo = true;
    get<Vaga[]>(`/api/vaga?idEmpresa=${encodeURIComponent(id)}`)
      .then((dados) => { if (ativo) { setVagas(dados); setEmpresa(id); } })
      .catch((error) => { if (ativo) setFalha(error.message); });
    return () => { ativo = false; };
  }, []);
  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title="Vagas da empresa" description="Consulte, edite e publique oportunidades." />
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6">
        <Card className="p-6"><form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4">
          <IconInputField id="idEmpresa" label="ID da empresa" icon={LuBuilding2} type="number" min={1} required value={empresa} onChange={(event) => setEmpresa(event.target.value)} />
          <SubmitButton pending={enviando} pendingLabel="Buscando...">Consultar</SubmitButton>
          <Link className="pb-2 text-primary underline" href={`/painel/vagas/nova${empresa ? `?empresa=${empresa}` : ""}`}>Publicar vaga</Link>
        </form></Card>
        <FormErrorAlert message={erro ?? falha} />
        {vagas?.length === 0 && <p>Nenhuma vaga encontrada para esta empresa.</p>}
        {vagas?.map((vaga) => <Card key={vaga.id} className="gap-2 p-5"><Link href={`/painel/vagas/${vaga.id}`} className="font-semibold text-primary hover:underline">{vaga.cargo}</Link><p className="text-sm text-muted-foreground">{vaga.nomeEmpresa}</p><p className="line-clamp-2 text-sm">{vaga.descricao}</p></Card>)}
      </div>
    </main>
  );
}
