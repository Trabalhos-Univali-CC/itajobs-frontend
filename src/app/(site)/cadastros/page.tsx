"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/card";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { get } from "@/lib/api";
import type { Candidato, Empresa } from "@/types/usuario";

export default function CadastrosPage() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    Promise.all([get<Candidato[]>("/api/candidato"), get<Empresa[]>("/api/empresa")])
      .then(([pessoas, organizacoes]) => { if (ativo) { setCandidatos(pessoas); setEmpresas(organizacoes); } })
      .catch((error) => { if (ativo) setErro(error.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title="Cadastros" description="Consulte os candidatos e as empresas cadastrados na API." />
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
        <div className="md:col-span-2"><FormErrorAlert message={erro} />{carregando && <p role="status">Carregando cadastros...</p>}</div>
        <section className="space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Candidatos</h2><Link className="text-primary underline" href="/cadastro/candidato">Cadastrar</Link></div>
          {!carregando && !erro && candidatos.length === 0 && <p>Nenhum candidato cadastrado.</p>}
          {candidatos.map((candidato) => (
            <Card key={candidato.id} className="gap-2 p-5">
              <Link href={`/cadastros/candidato/${candidato.id}`} className="font-semibold text-primary hover:underline">{candidato.nome} {candidato.sobrenome}</Link>
              <p className="text-sm text-muted-foreground">ID {candidato.id}</p>
              <Link href={`/painel/candidatos/${candidato.id}`} className="text-sm underline">Ver currículo</Link>
            </Card>
          ))}
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Empresas</h2><Link className="text-primary underline" href="/cadastro/empresa">Cadastrar</Link></div>
          {!carregando && !erro && empresas.length === 0 && <p>Nenhuma empresa cadastrada.</p>}
          {empresas.map((empresa) => (
            <Card key={empresa.id} className="gap-2 p-5">
              <Link href={`/cadastros/empresa/${empresa.id}`} className="font-semibold text-primary hover:underline">{empresa.nome}</Link>
              <p className="text-sm text-muted-foreground">ID {empresa.id} ? Nota: {empresa.nota ?? "Sem avaliação"}</p>
              <Link href={`/painel/vagas?empresa=${empresa.id}`} className="text-sm underline">Ver vagas</Link>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
