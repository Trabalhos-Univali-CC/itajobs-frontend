"use client";

import { CardSkeleton } from "@/components/ui/card-skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuArrowUpRight, LuBriefcaseBusiness, LuBuilding2, LuCheck, LuChevronLeft, LuChevronRight, LuImage, LuImages, LuMail, LuMapPin, LuMessageSquare, LuPhone, LuSend, LuStar } from "react-icons/lu";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Textarea } from "@/components/ui/textarea";
import { useUsuario } from "@/features/auth/sessionContext";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { get, put } from "@/lib/api";
import type { AvaliacaoEmpresa, Empresa } from "@/types/usuario";
import { cn, formatarTelefone } from "@/utils/utils";

const descricoesNota = ["Escolha de 1 a 5 estrelas", "Muito ruim", "Ruim", "Regular", "Boa", "Excelente"];

export function CompanyProfile({ empresa }: { empresa: Empresa }) {
  const usuario = useUsuario();
  const [dados, setDados] = useState(empresa);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoEmpresa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [falha, setFalha] = useState<string | null>(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [salva, setSalva] = useState(false);
  const minhaAvaliacao = usuario.tipo === "candidato" ? avaliacoes.find((item) => item.idCandidato === usuario.id) : undefined;
  const { erro, enviando, onSubmit, limparErro } = useFormSubmit(async () => {
    if (usuario.tipo !== "candidato") throw new Error("Entre com uma conta de candidato para avaliar.");
    if (nota < 1 || nota > 5) throw new Error("Escolha uma nota de 1 a 5 estrelas.");
    setSalva(false);
    const avaliacao = await put<AvaliacaoEmpresa>(`/api/empresa/${empresa.id}/avaliacoes/${usuario.id}`, { nota, comentario: comentario.trim() || null });
    const atualizada = await get<Empresa>(`/api/empresa/${empresa.id}`);
    setDados(atualizada);
    setAvaliacoes((atuais) => [avaliacao, ...atuais.filter((item) => item.idCandidato !== usuario.id)]);
    setNota(avaliacao.nota);
    setComentario(avaliacao.comentario ?? "");
    setSalva(true);
    setFalha(null);
  });

  useEffect(() => {
    let ativo = true;
    get<AvaliacaoEmpresa[]>(`/api/empresa/${empresa.id}/avaliacoes`)
      .then((itens) => {
        if (!ativo) return;
        setAvaliacoes(itens);
        const propria = usuario.tipo === "candidato" ? itens.find((item) => item.idCandidato === usuario.id) : undefined;
        setNota(propria?.nota ?? 0);
        setComentario(propria?.comentario ?? "");
      })
      .catch((error) => { if (ativo) setFalha(error.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [empresa.id, usuario.id, usuario.tipo]);

  const endereco = [
    { label: "CEP", valor: dados.endereco.cep.replace(/^(\d{5})(\d{3})$/, "$1-$2") },
    { label: "Bairro", valor: dados.endereco.bairro },
    { label: "Rua", valor: dados.endereco.rua },
    { label: "Número", valor: dados.endereco.numero },
    { label: "Complemento", valor: dados.endereco.complemento },
    { label: "Cidade", valor: dados.endereco.cidade },
  ];
  const contatos = [
    { label: "Telefone", valor: formatarTelefone(dados.contato.telefone), href: `tel:${dados.contato.telefone.replace(/\D/g, "")}`, icon: LuPhone },
    { label: "E-mail", valor: dados.contato.email, href: `mailto:${dados.contato.email}`, icon: LuMail },
  ];

  return (
    <main className="flex-1 bg-muted/25 pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 sm:pt-7">
        <Link href={usuario.tipo === "empresa" && usuario.id === dados.id ? "/painel/empresa" : "/cadastros"} className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"><LuArrowLeft aria-hidden className="size-4" />{usuario.tipo === "empresa" ? usuario.id === dados.id ? "Minha empresa" : "Candidatos" : "Avaliações de empresas"}</Link>

        <section aria-labelledby="empresa-nome" className="overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-sm">
          <div role="group" aria-label="Banner da empresa" aria-disabled="true" className="relative flex h-44 items-center justify-center overflow-hidden border-b-4 border-secondary bg-primary pb-6 sm:h-52 lg:h-60">
            <div aria-hidden className="absolute -top-32 -right-16 size-96 rounded-full border border-white/10" />
            <div aria-hidden className="absolute -bottom-56 -left-20 size-96 rounded-full border border-white/10" />
            <div className="relative flex flex-col items-center gap-2 px-6 text-center text-white/70"><LuImage aria-hidden className="size-8" /><p className="text-sm">Banner da empresa</p><Badge variant="outline" className="border-white/20 bg-white/10 text-white/70">Em breve</Badge></div>
          </div>
          <div className="relative flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-start sm:px-7">
            <div role="img" aria-label="Logo da empresa: em breve" data-disabled="" className="relative -mt-12 flex size-28 shrink-0 items-center justify-center rounded-3xl border-4 border-card bg-accent shadow-md shadow-primary/10 ring-1 ring-primary/10"><LuBuilding2 aria-hidden className="size-12 text-primary/45" /><span className="absolute bottom-1.5 rounded-md bg-card/85 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Em breve</span></div>
            <div className="min-w-0 flex-1 sm:pt-5">
              <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-primary/60 uppercase">Conheça a empresa</p>
              <h1 id="empresa-nome" className="text-3xl leading-tight font-bold tracking-tight break-words text-primary sm:text-4xl lg:text-5xl">{dados.nome}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <p className="flex min-w-0 items-center gap-1.5"><LuMapPin aria-hidden className="size-4 shrink-0 text-primary/60" /><span className="break-words">{[dados.endereco.bairro, dados.endereco.cidade].filter(Boolean).join(", ")}</span></p>
                <span aria-hidden className="hidden size-1 rounded-full bg-border sm:inline" />
                {dados.nota !== null ? <p className="flex items-center gap-1.5"><LuStar aria-hidden className="size-4 fill-secondary text-yellow-500" /><span className="font-semibold text-foreground">{dados.nota.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</span><span>/ 5</span></p> : <p className="flex items-center gap-1.5"><LuStar aria-hidden className="size-4" />Ainda sem avaliações</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end sm:pt-6 lg:flex-col">
              {usuario.tipo === "empresa" && usuario.id === dados.id && <Link href="/painel/empresa" className={cn(buttonVariants({ size: "sm" }), "gap-2")}><LuBuilding2 aria-hidden className="size-4" />Editar página</Link>}
              {usuario.tipo === "candidato" && <Link href="#avaliar-empresa" className={cn(buttonVariants({ size: "sm" }), "gap-2")}><LuStar aria-hidden className="size-4" />Avaliar empresa</Link>}
              <Link href={`/?empresa=${dados.id}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}><LuBriefcaseBusiness aria-hidden className="size-4" />Ver vagas<LuArrowUpRight aria-hidden className="size-3.5" /></Link>
            </div>
          </div>
        </section>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-6">
            <section role="group" aria-labelledby="empresa-sobre" aria-disabled="true" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-primary/60 uppercase">Por dentro da empresa</p>
              <h2 id="empresa-sobre" className="mt-1 flex flex-wrap items-center gap-2 text-xl font-semibold text-foreground">Sobre a empresa<Badge variant="outline" className="bg-muted/40 font-normal text-muted-foreground">Em breve</Badge></h2>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">A apresentação da empresa ainda está indisponível.</p>
            </section>

            <section role="group" aria-labelledby="empresa-fotos" aria-disabled="true" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[11px] font-semibold tracking-[0.18em] text-primary/60 uppercase">Nosso espaço</p><h2 id="empresa-fotos" className="mt-1 flex flex-wrap items-center gap-2 text-xl font-semibold">Fotos do local<Badge variant="outline" className="bg-muted/40 font-normal text-muted-foreground">Em breve</Badge></h2><p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">Um olhar sobre o ambiente de trabalho e a estrutura da empresa.</p></div><div className="flex shrink-0 gap-1"><Button type="button" variant="outline" size="icon-sm" disabled aria-label="Foto anterior" title="Galeria de fotos em breve."><LuChevronLeft aria-hidden /></Button><Button type="button" variant="outline" size="icon-sm" disabled aria-label="Próxima foto" title="Galeria de fotos em breve."><LuChevronRight aria-hidden /></Button></div></div>
              <div role="region" aria-label="Fotos da empresa" aria-roledescription="carrossel" className="mt-5 flex aspect-[16/10] min-h-48 w-full min-w-0 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/15 bg-muted/30 px-5 text-center sm:aspect-[16/8]">
                <span className="flex size-14 items-center justify-center rounded-2xl border border-primary/10 bg-card text-primary/35"><LuImages aria-hidden className="size-7" /></span>
                <div><p className="text-sm font-medium text-foreground/80">Galeria de fotos em breve</p><p className="mt-0.5 max-w-xs text-xs leading-relaxed text-muted-foreground">Este recurso ainda está indisponível.</p></div>
              </div>
            </section>

            <section aria-labelledby="empresa-avaliacoes" className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-primary/60 uppercase">Experiências compartilhadas</p>
              <h2 id="empresa-avaliacoes" className="mt-1 text-xl font-semibold">Avaliações</h2>
              <div className="mt-5"><FormErrorAlert message={falha} /></div>
              {carregando ? <CardSkeleton variant="review" count={2} label="Carregando avaliações..." /> : !falha && avaliacoes.length === 0 ? <div className="rounded-xl bg-muted/35 px-5 py-7 text-center"><LuMessageSquare aria-hidden className="mx-auto size-7 text-primary/35" /><p className="mt-3 text-sm font-medium">Essa conversa pode começar com você</p><p className="mt-0.5 text-sm text-muted-foreground">A empresa ainda não recebeu avaliações.</p></div> : <div className="divide-y">{avaliacoes.map((avaliacao) => <article key={avaliacao.idCandidato} aria-label={`Avaliação de ${avaliacao.nomeCandidato}`} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3"><span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">{avaliacao.nomeCandidato.charAt(0).toUpperCase()}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><p className="text-sm font-semibold break-words">{avaliacao.nomeCandidato}{usuario.tipo === "candidato" && avaliacao.idCandidato === usuario.id && <span className="ml-1.5 font-normal text-muted-foreground">(você)</span>}</p><time dateTime={avaliacao.data} className="text-xs text-muted-foreground">{new Date(avaliacao.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</time></div><StarRating value={avaliacao.nota} label={`Nota de ${avaliacao.nomeCandidato}`} className="mt-1.5" />{avaliacao.comentario && <p className="mt-3 text-sm leading-relaxed break-words whitespace-pre-line text-muted-foreground">{avaliacao.comentario}</p>}</div></div>
              </article>)}</div>}
            </section>
          </div>

          <aside className="min-w-0 space-y-6">
            <section aria-labelledby="empresa-informacoes" className="overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-md shadow-primary/5">
              <div className="flex items-center gap-2.5 border-b-2 border-secondary bg-primary px-4 py-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-secondary"><LuBuilding2 aria-hidden className="size-4" /></span>
                <h2 id="empresa-informacoes" className="min-w-0 text-base leading-snug font-semibold text-white">Informações da empresa</h2>
              </div>
              <dl className="p-4">
                <div><dt className="text-[11px] font-medium text-muted-foreground">Razão social</dt><dd className="mt-1 text-sm leading-5 font-semibold break-words text-primary">{dados.nome}</dd></div>
                <div className="mt-3">
                  <dt className="text-[11px] font-medium text-muted-foreground">CNPJ</dt>
                  <dd className="mt-0.5 text-[13px] leading-5 font-medium break-all text-foreground">{dados.cnpj.replace(/^([0-9A-Z]{2})([0-9A-Z]{3})([0-9A-Z]{3})([0-9A-Z]{4})(\d{2})$/i, "$1.$2.$3/$4-$5")}</dd>
                </div>
              </dl>
              <div className="border-t border-primary/10 bg-muted/20 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-primary"><LuMapPin aria-hidden className="size-4" />Endereço</h3>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">{endereco.map((item) => <div key={item.label} className="min-w-0">
                  <dt className="text-[11px] font-medium text-muted-foreground">{item.label}</dt>
                  <dd className="mt-0.5 text-[13px] leading-5 font-medium break-words">{item.valor || "Não informado"}</dd>
                </div>)}</dl>
              </div>
              <div className="border-t border-primary/10 p-4">
                <h3 className="text-sm font-semibold text-primary">Fale com a empresa</h3>
                <div className="mt-2 space-y-2">{contatos.map(({ label, valor, href, icon: Icon }) => <a key={label} href={href} className="group flex min-h-12 items-center gap-2 rounded-lg border border-primary/10 px-2.5 py-2 transition-colors hover:border-primary/25 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-primary/70 transition-colors group-hover:text-primary"><Icon aria-hidden className="size-3.5" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-[11px] font-medium text-muted-foreground">{label}</span><span className="block text-[13px] leading-5 font-medium break-all text-foreground">{valor}</span></span>
                  <LuArrowUpRight aria-hidden className="size-4 shrink-0 text-primary/40 transition-colors group-hover:text-primary" />
                </a>)}</div>
              </div>
            </section>

            <section id="avaliar-empresa" aria-labelledby="empresa-nota" className="scroll-mt-40 overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm">
              <div className="border-b border-primary/10 bg-accent/40 p-5 sm:p-6"><h2 id="empresa-nota" className="text-lg font-semibold text-primary">Nota da empresa</h2><div className="mt-4 flex items-center gap-4"><p className="text-4xl leading-none font-bold tracking-tight text-primary">{dados.nota === null ? "—" : dados.nota.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}<span className="ml-1 text-base font-normal text-muted-foreground">/ 5</span></p><div className="space-y-1.5"><StarRating value={dados.nota ?? 0} label="Média da empresa" /><p className="text-xs text-muted-foreground">{dados.totalAvaliacoes ? `${dados.totalAvaliacoes} ${dados.totalAvaliacoes === 1 ? "avaliação" : "avaliações"}` : "Ainda sem avaliações"}</p></div></div></div>
              {usuario.tipo === "candidato" && <form onSubmit={onSubmit} className="p-5 sm:p-6">
                <fieldset disabled={enviando || carregando} className="space-y-5">
                  <div><p className="text-sm font-semibold">Como foi sua experiência?</p><p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Para avaliar, você precisa ter se candidatado a uma vaga desta empresa.</p><StarRating value={nota} onValueChange={(valor) => { setNota(valor); setSalva(false); limparErro(); }} label="Sua nota" disabled={enviando || carregando} required className="mt-3" /><p aria-live="polite" className="mt-1 text-xs font-medium text-primary/75">{nota ? `${nota} ${nota === 1 ? "estrela" : "estrelas"} · ${descricoesNota[nota]}` : descricoesNota[0]}</p></div>
                  <div><div className="mb-2 flex items-center justify-between gap-2"><label htmlFor="empresa-comentario" className="text-sm font-medium">Comentário <span className="font-normal text-muted-foreground">(opcional)</span></label><span className="text-[11px] text-muted-foreground tabular-nums">{comentario.length}/500</span></div><Textarea id="empresa-comentario" name="comentario" value={comentario} onChange={(event) => { setComentario(event.target.value); setSalva(false); limparErro(); }} rows={4} maxLength={500} placeholder="Conte o que você achou do ambiente, da equipe ou da sua experiência com a empresa." className="min-h-28 resize-y text-sm leading-relaxed" /></div>
                  <FormErrorAlert message={erro} />
                  {salva && <p role="status" className="flex items-center gap-2 text-sm text-primary"><LuCheck aria-hidden className="size-4 shrink-0" />Sua avaliação foi salva.</p>}
                  <SubmitButton pending={enviando} pendingLabel="Enviando..." icon={LuSend} className="w-full">{minhaAvaliacao ? "Atualizar avaliação" : "Enviar avaliação"}</SubmitButton>
                </fieldset>
              </form>}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
