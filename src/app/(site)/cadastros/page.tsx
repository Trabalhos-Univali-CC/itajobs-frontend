"use client";

import { CardSkeleton } from "@/components/ui/card-skeleton";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LuArrowUpRight, LuBriefcaseBusiness, LuBuilding2, LuMapPin, LuSearch, LuSlidersHorizontal, LuTags, LuUsersRound, LuX } from "react-icons/lu";
import { PageHero } from "@/components/layout/PageHero";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarRating } from "@/components/ui/star-rating";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { IconInputField } from "@/components/form/IconInputField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { get } from "@/lib/api";
import type { Candidato, Empresa } from "@/types/usuario";
import { useUsuario } from "@/features/auth/sessionContext";
import { bairros } from "@/features/auth/bairros";
import { cn, normalizarTexto } from "@/utils/utils";

export default function CadastrosPage() {
  const usuario = useUsuario();
  const pesquisaRef = useRef<HTMLInputElement>(null);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [busca, setBusca] = useState("");
  const [buscaCandidatos, setBuscaCandidatos] = useState("");
  const [bairroCandidatos, setBairroCandidatos] = useState("");
  const [bairroSelecionado, setBairroSelecionado] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    const consulta = usuario.tipo === "empresa"
      ? get<Candidato[]>("/api/candidato").then((pessoas) => { if (ativo) setCandidatos(pessoas); })
      : get<Empresa[]>("/api/empresa").then((organizacoes) => { if (ativo) setEmpresas(organizacoes); });
    consulta
      .catch((error) => { if (ativo) setErro(error.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [usuario.tipo]);

  const termo = normalizarTexto(busca);
  const candidatosFiltrados = candidatos.filter((candidato) => candidato.idCurriculo !== null && (!bairroSelecionado || normalizarTexto(candidato.endereco.bairro ?? "") === normalizarTexto(bairroSelecionado)) && normalizarTexto(`${candidato.nome} ${candidato.sobrenome} ${candidato.endereco.bairro ?? ""} ${candidato.endereco.cidade}`).includes(termo));
  const opcoesBairro = [{ value: "", label: "Todos os bairros" }, ...Array.from(new Set([...bairros, ...candidatos.flatMap((candidato) => candidato.endereco.bairro?.trim() ? [candidato.endereco.bairro.trim()] : [])])).sort((a, b) => a.localeCompare(b, "pt-BR")).map((bairro) => ({ value: bairro, label: bairro }))];
  const empresasFiltradas = empresas.filter((empresa) => normalizarTexto(`${empresa.nome} ${empresa.endereco.bairro ?? ""} ${empresa.endereco.cidade}`).includes(termo));
  const pesquisaId = usuario.tipo === "empresa" ? "pesquisa-candidatos" : "pesquisa-empresas";

  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title={usuario.tipo === "empresa" ? "Candidatos" : "Avaliações de empresas"} description={usuario.tipo === "empresa" ? "Encontre candidatos em Itajaí que já cadastraram seus currículos." : "Conheça as empresas, confira suas avaliações e veja as vagas disponíveis."} />
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <FormErrorAlert message={erro} />
        <section className="min-w-0 space-y-5" aria-labelledby="titulo-cadastros">
          <h2 id="titulo-cadastros" className="text-xl font-semibold">{usuario.tipo === "empresa" ? "Candidatos" : "Empresas"}</h2>
          {usuario.tipo === "empresa" ? <Card className="gap-0 rounded-2xl border border-primary/10 p-5 shadow-sm ring-0 sm:p-6">
            <form id="busca-candidatos" role="search" aria-label="Pesquisar candidatos" onSubmit={(event) => { event.preventDefault(); setBusca(buscaCandidatos); setBairroSelecionado(bairroCandidatos); }} className="flex flex-col gap-5">
              <div className="space-y-2">
                <div className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_14rem] lg:grid-cols-[minmax(0,1fr)_14rem_auto]">
                  <IconInputField ref={pesquisaRef} id={pesquisaId} type="search" label="Candidato" aria-label="Pesquisar candidatos" icon={LuSearch} value={buscaCandidatos} onChange={(event) => setBuscaCandidatos(event.target.value)} aria-describedby="pesquisa-candidatos-ajuda" placeholder="Pesquisar por nome, bairro ou cidade" className="min-w-0" addonEnd={buscaCandidatos ? <button type="button" aria-label="Limpar pesquisa" onClick={() => { setBuscaCandidatos(""); setBusca(""); pesquisaRef.current?.focus(); }} className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"><LuX aria-hidden className="size-3.5" /></button> : null} />
                  <Field className="min-w-0"><FieldLabel htmlFor="bairro-candidatos">Bairro</FieldLabel><Select items={opcoesBairro} value={bairroCandidatos} onValueChange={(bairro) => setBairroCandidatos(bairro ?? "")}><SelectTrigger id="bairro-candidatos" className="w-full"><LuMapPin /><SelectValue /></SelectTrigger><SelectContent>{opcoesBairro.map((bairro) => <SelectItem key={bairro.value} value={bairro.value}>{bairro.label}</SelectItem>)}</SelectContent></Select></Field>
                  <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1">
                    <Button type="button" variant="outline" aria-label="Filtro" title="Filtro" aria-expanded={filtrosAbertos} aria-controls="filtros-candidatos" onClick={() => setFiltrosAbertos((abertos) => !abertos)} className="relative gap-2 aria-expanded:border-primary/30 aria-expanded:bg-accent aria-expanded:text-primary"><LuSlidersHorizontal aria-hidden className="size-4" />Filtro{bairroSelecionado && <span aria-hidden className="absolute -top-1 -right-1 size-2.5 rounded-full bg-secondary ring-2 ring-card" />}</Button>
                    <SubmitButton pending={carregando} pendingLabel="Buscando..." icon={LuSearch}>Buscar</SubmitButton>
                  </div>
                </div>
                <p id="pesquisa-candidatos-ajuda" aria-disabled="true" className="text-xs text-muted-foreground">Busca por cargo ou profissão neste campo · Em breve</p>
              </div>
              {filtrosAbertos && <section id="filtros-candidatos" aria-labelledby="titulo-filtros-candidatos" className="animate-in space-y-5 border-t border-primary/10 pt-5 duration-150 fade-in-0 slide-in-from-top-1 motion-reduce:animate-none">
                <h3 id="titulo-filtros-candidatos" className="flex items-center gap-2 text-sm font-semibold text-primary"><LuSlidersHorizontal aria-hidden className="size-4" />Filtros de candidatos</h3>
                <div className="grid min-w-0 items-start gap-6 sm:grid-cols-2">
                  <fieldset disabled className="min-w-0 space-y-2.5"><legend className="mb-2.5 flex items-center gap-2 text-sm font-medium text-muted-foreground">Tags<span className="rounded-md bg-accent/70 px-2 py-0.5 text-[10px] font-medium text-primary/70">Em breve</span></legend><Field><FieldLabel htmlFor="tags-candidatos" className="sr-only">Tags</FieldLabel><InputGroup className="h-11"><InputGroupAddon><LuTags /></InputGroupAddon><InputGroupInput id="tags-candidatos" placeholder="Pesquisar por habilidades" disabled /></InputGroup></Field></fieldset>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-primary/10 pt-4 sm:flex sm:justify-end">
                  <Button type="button" variant="outline" className="w-full gap-2 sm:w-auto" onClick={() => { setBuscaCandidatos(""); setBairroCandidatos(""); setBusca(""); setBairroSelecionado(""); pesquisaRef.current?.focus(); }}><LuX aria-hidden className="size-4" />Limpar filtros</Button>
                  <SubmitButton form="busca-candidatos" pending={carregando} pendingLabel="Aplicando..." icon={LuSearch} className="w-full sm:w-auto">Aplicar</SubmitButton>
                </div>
              </section>}
            </form>
          </Card> : <div role="search" aria-label="Pesquisar empresas" className="relative min-w-0">
            <label htmlFor={pesquisaId} className="sr-only">Pesquisar empresas</label>
            <LuSearch aria-hidden className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-primary/50" />
            <Input ref={pesquisaRef} id={pesquisaId} type="search" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Pesquisar por empresa, bairro ou cidade" className="h-12 rounded-xl border-primary/15 bg-accent/20 pr-12 pl-12 [&::-webkit-search-cancel-button]:appearance-none" />
            {busca && <Button type="button" variant="ghost" size="icon" aria-label="Limpar pesquisa" onClick={() => { setBusca(""); pesquisaRef.current?.focus(); }} className="absolute top-0.5 right-0.5 text-muted-foreground"><LuX aria-hidden className="size-4" /></Button>}
          </div>}
          {usuario.tipo === "empresa" ? <>
            {carregando && <CardSkeleton count={6} label="Carregando candidatos..." className="sm:grid-cols-2 lg:grid-cols-3" />}
            {!carregando && !erro && candidatosFiltrados.length === 0 && <div role="status" className="rounded-2xl border border-dashed border-primary/15 bg-muted/20 px-6 py-10 text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary/50"><LuUsersRound aria-hidden className="size-6" /></span><p className="mt-3 font-semibold text-primary">{termo || bairroSelecionado ? "Nenhum candidato com esse perfil" : "Nenhum candidato com currículo"}</p><p className="mt-1 text-sm text-muted-foreground">{termo || bairroSelecionado ? "Tente outro termo ou bairro, ou limpe os filtros." : "Os candidatos aparecerão aqui depois de cadastrarem um currículo."}</p></div>}
            <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy={carregando}>
              {!erro && candidatosFiltrados.map((candidato) => <article key={candidato.id} aria-label={`${candidato.nome} ${candidato.sobrenome}`} className="group/candidato flex min-w-0 flex-col overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-[0_2px_8px_-4px_rgb(39_14_105_/_0.12)] transition-[border-color,box-shadow] duration-200 hover:border-primary/25 hover:shadow-[0_6px_20px_-8px_rgb(39_14_105_/_0.16)] focus-within:border-primary/30 motion-reduce:transition-none">
                <div aria-hidden className="h-16 shrink-0 border-b border-primary/5 bg-accent/60" />
                <div className="relative flex min-w-0 flex-1 flex-col gap-4 px-5 pb-5">
                  <div className="-mt-8 flex min-w-0 items-end justify-between gap-3">
                    <span aria-hidden className="flex size-18 shrink-0 items-center justify-center rounded-full border border-secondary/60 bg-accent text-xl font-semibold text-primary ring-4 ring-card">{`${candidato.nome.trim().charAt(0)}${candidato.sobrenome.trim().charAt(0)}`.toLocaleUpperCase("pt-BR")}</span>
                    <span aria-disabled="true" aria-label="Cargo atual ou desejado: em breve" title="Cargo atual ou desejado: em breve." className="mb-1 text-sm text-muted-foreground">Em breve</span>
                  </div>
                  <div className="min-w-0 space-y-2">
                    <h3 className="text-xl leading-snug font-semibold tracking-tight break-words text-primary"><Link href={`/painel/candidatos/${candidato.id}`} className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25">{candidato.nome} {candidato.sobrenome}</Link></h3>
                    <p className="flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground"><LuMapPin aria-hidden className="mt-0.5 size-3.5 shrink-0 text-primary/45" /><span className="min-w-0 break-words">{[candidato.endereco.bairro, candidato.endereco.cidade].filter(Boolean).join(", ") || "Localização não informada"}</span></p>
                  </div>
                </div>
                <div className="mx-5 flex items-center gap-2 border-t border-primary/[0.07] pt-4 pb-5">
                  <Link href={`/painel/candidatos/${candidato.id}`} className={cn(buttonVariants(), "min-w-0 flex-1 justify-between gap-2 rounded-xl px-4")}><span>Ver currículo</span><LuArrowUpRight aria-hidden className="size-4 shrink-0" /></Link>
                </div>
              </article>)}
            </div>
          </> : <>
          {!carregando && !erro && empresas.length === 0 && <p>Nenhuma empresa cadastrada.</p>}
          {!carregando && !erro && empresas.length > 0 && empresasFiltradas.length === 0 && <p role="status" className="rounded-xl border border-dashed border-primary/15 bg-muted/20 p-6 text-center text-sm text-muted-foreground">Nenhuma empresa encontrada. Tente outro nome, bairro ou cidade.</p>}
          <div className="space-y-4" aria-busy={carregando}>
            {carregando && <CardSkeleton variant="company" label="Carregando empresas..." />}
            {empresasFiltradas.map((empresa) => (
              <article key={empresa.id} aria-label={empresa.nome} className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] gap-3 rounded-2xl border border-primary/10 bg-card px-4 py-3 shadow-sm transition-[border-color,box-shadow] hover:border-primary/25 hover:shadow-md hover:shadow-primary/5 focus-within:border-primary/30 sm:grid-cols-[5rem_minmax(0,1fr)_13rem] sm:items-center sm:gap-4 sm:px-5 sm:py-4 lg:grid-cols-[5rem_minmax(0,1fr)_16.5rem] lg:py-3">
                <span role="img" aria-label={`Logo de ${empresa.nome}: em breve`} data-disabled="" className="flex size-16 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-accent/70 text-primary/60 sm:size-20"><LuBuilding2 aria-hidden className="size-8 sm:size-9" /></span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <h3 className="min-w-0 text-lg leading-snug font-semibold break-words text-primary sm:text-xl"><Link href={`/cadastros/empresa/${empresa.id}`} className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25">{empresa.nome}</Link></h3>
                    <p aria-disabled="true" className="inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-md border border-dashed border-primary/15 bg-muted/40 px-2 py-0.5 text-[11px] leading-relaxed text-muted-foreground"><LuBriefcaseBusiness aria-hidden className="size-3.5 shrink-0" /><span>Ramo · Em breve</span></p>
                  </div>
                  <p className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground"><LuMapPin aria-hidden className="mt-0.5 size-3.5 shrink-0" /><span className="min-w-0 break-words">{[empresa.endereco.bairro, empresa.endereco.cidade].filter(Boolean).join(", ") || "Localização não informada"}</span></p>
                  <p aria-disabled="true" className="mt-2 text-sm leading-relaxed text-muted-foreground">Descrição da empresa · Em breve</p>
                </div>
                <div className="col-span-2 flex min-w-0 flex-col gap-2.5 border-t border-primary/10 pt-3 sm:col-span-1 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:justify-center">
                    <StarRating value={empresa.nota ?? 0} label={`Nota de ${empresa.nome}`} />
                    {empresa.nota !== null ? <p className="text-sm font-semibold text-primary">{empresa.nota.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}<span className="ml-1 text-xs font-normal text-muted-foreground">/ 5</span></p> : <p className="text-xs text-muted-foreground">Sem avaliações</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 lg:grid-cols-2">
                    <Link href={`/cadastros/empresa/${empresa.id}`} className={cn(buttonVariants(), "w-full")}>Ver empresa</Link>
                    <Link href={`/?empresa=${empresa.id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2")}>Ver vagas<LuArrowUpRight aria-hidden className="size-4" /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          </>}
        </section>
      </div>
    </main>
  );
}
