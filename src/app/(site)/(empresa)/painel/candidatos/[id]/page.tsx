"use client";

import { PageLoading } from "@/components/ui/page-loading";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuArrowUpRight, LuFileText, LuGlobe, LuMail, LuMapPin, LuPhone, LuUserRound } from "react-icons/lu";
import { Button, buttonVariants } from "@/components/ui/button";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { ResumePreview } from "@/features/curriculo/components/ResumePreview";
import { buscarCurriculo } from "@/features/curriculo/curriculoApi";
import { get } from "@/lib/api";
import type { Candidato } from "@/types/usuario";
import type { Curriculo } from "@/types/curriculo";
import { cn, formatarTelefone } from "@/utils/utils";

export default function CandidatoPage() {
  const { id } = useParams<{ id: string }>();
  const [registro, setDados] = useState<{ candidato: Candidato; curriculo: Curriculo | null } | null>(null);
  const [falha, setErro] = useState<{ id: string; mensagem: string } | null>(null);
  const [fotoComErro, setFotoComErro] = useState<string | null>(null);
  useEffect(() => {
    let ativo = true;
    Promise.all([get<Candidato>(`/api/candidato/${id}`), buscarCurriculo(Number(id))])
      .then(([candidato, curriculo]) => { if (ativo) { setDados({ candidato, curriculo }); setErro(null); } })
      .catch((error) => { if (ativo) setErro({ id, mensagem: error.message }); });
    return () => { ativo = false; };
  }, [id]);
  const dados = registro?.candidato.id === Number(id) ? registro : null;
  const erro = falha?.id === id ? falha.mensagem : null;
  const nome = dados ? `${dados.candidato.nome} ${dados.candidato.sobrenome}` : "Currículo do candidato";
  const foto = dados?.curriculo?.arquivos.find((arquivo) => arquivo.tipo === "foto");
  const fotoUrl = foto && dados?.curriculo ? `/api/curriculo/${dados.curriculo.id}/arquivos/foto?v=${encodeURIComponent(foto.enviadoEm)}` : null;
  const pdf = dados?.curriculo?.arquivos.find((arquivo) => arquivo.tipo === "pdf");
  const portfolio = dados?.curriculo?.portfolio?.trim() ?? "";
  const endereco = dados ? [
    { label: "CEP", valor: dados.candidato.endereco.cep.replace(/^(\d{5})(\d{3})$/, "$1-$2") },
    { label: "Bairro", valor: dados.candidato.endereco.bairro },
    { label: "Rua", valor: dados.candidato.endereco.rua },
    { label: "Número", valor: dados.candidato.endereco.numero },
    { label: "Complemento", valor: dados.candidato.endereco.complemento },
    { label: "Cidade", valor: dados.candidato.endereco.cidade },
  ] : [];
  const contatos = dados ? [
    { label: "Telefone", valor: formatarTelefone(dados.candidato.contato.telefone), href: `tel:${dados.candidato.contato.telefone.replace(/\D/g, "")}`, icon: LuPhone },
    { label: "E-mail", valor: dados.candidato.contato.email, href: `mailto:${dados.candidato.contato.email}`, icon: LuMail },
  ] : [];
  return (
    <main className="flex-1 bg-muted/25 pb-16">
      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-5 sm:px-6 sm:pt-7">
        <Link href="/cadastros" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"><LuArrowLeft aria-hidden className="size-4" />Candidatos</Link>
        <FormErrorAlert message={erro} />
        {!dados && <h1 className="sr-only">Currículo do candidato</h1>}
        {!dados && !erro && <PageLoading label="Carregando candidato..." />}
        {dados && <>
          <section aria-labelledby="candidato-nome" className="flex flex-col gap-5 rounded-3xl border border-primary/10 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:p-7">
            <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-2xl font-semibold text-primary ring-2 ring-secondary/75 ring-offset-4 ring-offset-card">
              {fotoUrl && fotoComErro !== fotoUrl ? <Image src={fotoUrl} alt={`Foto de ${nome}`} width={96} height={96} unoptimized className="size-full object-cover" onError={() => setFotoComErro(fotoUrl)} /> : <span aria-hidden>{`${dados.candidato.nome.trim().charAt(0)}${dados.candidato.sobrenome.trim().charAt(0)}`.toLocaleUpperCase("pt-BR")}</span>}
            </div>
            <div className="min-w-0 flex-1 space-y-2"><p className="text-[11px] font-semibold tracking-[0.15em] text-primary/55 uppercase">Perfil profissional</p><h1 id="candidato-nome" className="text-2xl leading-tight font-bold tracking-tight break-words text-primary sm:text-3xl lg:text-4xl">{nome}</h1><p className="flex items-start gap-1.5 text-sm text-muted-foreground"><LuMapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary/55" /><span className="min-w-0 break-words">{[dados.candidato.endereco.bairro, dados.candidato.endereco.cidade].filter(Boolean).join(", ") || "Localização não informada"}</span></p></div>
          </section>

          <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section aria-labelledby="candidato-curriculo" className="min-w-0 space-y-4">
              <div className="flex items-center gap-2 px-1"><LuFileText aria-hidden className="size-4 text-primary/70" /><h2 id="candidato-curriculo" className="text-lg font-semibold text-primary">Currículo profissional</h2></div>
              {dados.curriculo ? <ResumePreview candidato={dados.candidato} curriculo={dados.curriculo} variante="perfil" /> : <div role="status" className="rounded-2xl border border-dashed border-primary/15 bg-card px-5 py-10 text-center"><LuFileText aria-hidden className="mx-auto size-8 text-primary/35" /><p className="mt-3 text-sm font-medium">O candidato ainda não cadastrou um currículo.</p><p className="mt-1 text-xs text-muted-foreground">Os dados de cadastro e contato estão disponíveis nesta página.</p></div>}
            </section>

            <aside aria-label="Informações do candidato" className="min-w-0 space-y-6">
              <section aria-labelledby="candidato-informacoes" className="overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-md shadow-primary/5">
                <div className="flex items-center gap-2.5 border-b-2 border-secondary bg-primary px-4 py-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-secondary"><LuUserRound aria-hidden className="size-4" /></span><h2 id="candidato-informacoes" className="min-w-0 text-base leading-snug font-semibold text-white">Informações do candidato</h2></div>
                <dl className="space-y-3 p-4"><div><dt className="text-[11px] font-medium text-muted-foreground">Nome completo</dt><dd className="mt-1 text-sm leading-5 font-semibold break-words text-primary">{nome}</dd></div><div><dt className="text-[11px] font-medium text-muted-foreground">CPF</dt><dd className="mt-0.5 text-[13px] leading-5 font-medium break-all">{dados.candidato.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</dd></div></dl>
                <div className="border-t border-primary/10 bg-muted/20 p-4"><h3 className="flex items-center gap-2 text-sm font-semibold text-primary"><LuMapPin aria-hidden className="size-4" />Endereço</h3><dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">{endereco.map((item) => <div key={item.label} className="min-w-0"><dt className="text-[11px] font-medium text-muted-foreground">{item.label}</dt><dd className="mt-0.5 text-[13px] leading-5 font-medium break-words">{item.valor || "Não informado"}</dd></div>)}</dl></div>
                <div className="border-t border-primary/10 p-4"><h3 className="text-sm font-semibold text-primary">Contato</h3><div className="mt-2 space-y-2">{contatos.map(({ label, valor, href, icon: Icon }) => <a key={label} href={href} className="group flex min-h-12 items-center gap-2 rounded-lg border border-primary/10 px-2.5 py-2 transition-colors hover:border-primary/25 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"><span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-primary/70"><Icon aria-hidden className="size-3.5" /></span><span className="min-w-0 flex-1"><span className="block text-[11px] font-medium text-muted-foreground">{label}</span><span className="block text-[13px] leading-5 font-medium break-all">{valor}</span></span><LuArrowUpRight aria-hidden className="size-4 shrink-0 text-primary/40" /></a>)}</div></div>
              </section>

              <section aria-labelledby="candidato-arquivos" className="space-y-4 rounded-2xl border border-primary/10 bg-card p-4 shadow-sm"><h2 id="candidato-arquivos" className="flex items-center gap-2 text-base font-semibold text-primary"><LuFileText aria-hidden className="size-4" />Arquivos e links</h2>
                {pdf && dados.curriculo ? <div className="space-y-2"><p className="truncate text-xs text-muted-foreground" title={pdf.nome}>{pdf.nome}</p><a href={`/api/curriculo/${dados.curriculo.id}/arquivos/pdf`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2")}><LuFileText aria-hidden className="size-4" />Ver PDF<LuArrowUpRight aria-hidden className="size-3.5" /></a></div> : <Button type="button" variant="outline" disabled title="O candidato ainda não enviou um arquivo PDF." className="w-full gap-2"><LuFileText aria-hidden className="size-4" />PDF não enviado</Button>}
                <div className="border-t border-primary/10 pt-4"><h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><LuGlobe aria-hidden className="size-4" />Portfólio</h3>{/^https?:\/\//i.test(portfolio) ? <a href={portfolio} target="_blank" rel="noopener noreferrer" className="text-sm leading-relaxed break-all text-primary underline underline-offset-4">{portfolio}</a> : <p className="text-sm break-words text-muted-foreground">{portfolio || "Portfólio não informado."}</p>}</div>
              </section>
            </aside>
          </div>
        </>}
      </div>
    </main>
  );
}
