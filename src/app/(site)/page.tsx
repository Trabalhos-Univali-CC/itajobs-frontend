"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuSearch, LuBuilding2 } from "react-icons/lu";
import { PageHero } from "@/components/layout/PageHero";
import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { Card } from "@/components/ui/card";
import { get } from "@/lib/api";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { Vaga } from "@/types/vaga";

export default function Home() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [falha, setFalha] = useState<string | null>(null);
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    const consulta = new URLSearchParams();
    if (form.get("cargo")) consulta.set("cargo", String(form.get("cargo")).trim());
    if (form.get("idEmpresa")) consulta.set("idEmpresa", String(form.get("idEmpresa")));
    setVagas(await get<Vaga[]>(`/api/vaga?${consulta}`));
    setFalha(null);
  });

  useEffect(() => {
    let ativo = true;
    get<Vaga[]>("/api/vaga")
      .then((dados) => { if (ativo) setVagas(dados); })
      .catch((error) => { if (ativo) setFalha(error.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title="Vagas em Itajaí" description="Consulte as oportunidades publicadas pelas empresas." />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
        <Card className="p-6">
          <form onSubmit={onSubmit} className="grid items-end gap-4 sm:grid-cols-[1fr_12rem_auto]">
            <IconInputField id="cargo" label="Cargo" icon={LuSearch} placeholder="Buscar por cargo" />
            <IconInputField id="idEmpresa" label="ID da empresa" icon={LuBuilding2} type="number" min={1} />
            <SubmitButton pending={enviando} pendingLabel="Buscando...">Buscar</SubmitButton>
          </form>
        </Card>
        <FormErrorAlert message={erro ?? falha} />
        {carregando ? <p role="status">Carregando vagas...</p> : vagas.length === 0 ? <p>Nenhuma vaga encontrada.</p> : (
          <div className="grid gap-4 md:grid-cols-2">
            {vagas.map((vaga) => (
              <Card key={vaga.id} className="gap-3 p-6">
                <Link href={`/vagas/${vaga.id}`} className="text-lg font-semibold text-primary hover:underline">{vaga.cargo}</Link>
                <Link href={`/cadastros/empresa/${vaga.idEmpresa}`} className="text-sm text-muted-foreground hover:underline">{vaga.nomeEmpresa}</Link>
                <p className="line-clamp-3 whitespace-pre-line text-sm">{vaga.descricao}</p>
                <p className="text-sm font-medium">{vaga.salario === null ? "Salário a combinar" : vaga.salario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
