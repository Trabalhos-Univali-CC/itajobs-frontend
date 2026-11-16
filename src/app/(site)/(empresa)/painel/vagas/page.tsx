"use client";

import { CardSkeleton } from "@/components/ui/card-skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { useUsuario } from "@/features/auth/sessionContext";
import { get } from "@/lib/api";
import type { Vaga, Pagina } from "@/types/vaga";

export default function VagasEmpresaPage() {
  const usuario = useUsuario();
  const [resultado, setResultado] = useState<Pagina<Vaga> | null>(null);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const vagas = resultado?.itens;
  const [falha, setFalha] = useState<string | null>(null);
  useEffect(() => {
    let ativo = true;
    get<Pagina<Vaga>>(`/api/vaga?idEmpresa=${usuario.id}&pagina=${pagina}`)
      .then((dados) => { if (ativo) { setResultado(dados); setFalha(null); } })
      .catch((error) => { if (ativo) setFalha(error.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [usuario.id, pagina]);
  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title="Vagas da empresa" description="Consulte, edite e publique oportunidades." />
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6">
        <p className="text-sm text-muted-foreground">Empresa: {usuario.nome}</p>
        <Link className="text-primary underline" href="/painel/vagas/nova">Publicar vaga</Link>
        <FormErrorAlert message={falha} />
        {carregando && <CardSkeleton label="Carregando vagas..." />}
        {!carregando && !falha && vagas?.length === 0 && <p>Nenhuma vaga encontrada para esta empresa.</p>}
        {!carregando && vagas?.map((vaga) => <Card key={vaga.id} className="gap-2 p-5"><Link href={`/painel/vagas/${vaga.id}`} className="font-semibold text-primary hover:underline">{vaga.cargo}</Link><p className="text-sm text-muted-foreground">{vaga.nomeEmpresa}</p><p className="line-clamp-2 text-sm">{vaga.descricao}</p></Card>)}
        {resultado && resultado.totalPaginas > 1 && <div className="flex items-center gap-4"><Button variant="outline" disabled={carregando || pagina <= 1} onClick={() => { setCarregando(true); setPagina(pagina - 1); }}>Anterior</Button><span>Página {resultado.pagina} de {resultado.totalPaginas}</span><Button variant="outline" disabled={carregando || pagina >= resultado.totalPaginas} onClick={() => { setCarregando(true); setPagina(pagina + 1); }}>Próxima</Button></div>}
      </div>
    </main>
  );
}
