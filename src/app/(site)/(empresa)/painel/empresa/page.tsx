"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuArrowUpRight, LuBriefcaseBusiness, LuBuilding2, LuEye, LuFileText, LuGlobe, LuImage, LuImages, LuInfo, LuLink, LuMapPin, LuSave, LuSettings, LuUpload } from "react-icons/lu";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { IconInputField } from "@/components/form/IconInputField";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageLoading } from "@/components/ui/page-loading";
import { Textarea } from "@/components/ui/textarea";
import { useUsuario } from "@/features/auth/sessionContext";
import { get } from "@/lib/api";
import type { Empresa } from "@/types/usuario";
import { cn } from "@/utils/utils";

export default function MinhaEmpresaPage() {
  const usuario = useUsuario();
  const [registro, setEmpresa] = useState<Empresa | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    get<Empresa>(`/api/empresa/${usuario.id}`)
      .then((empresa) => { if (ativo) { setEmpresa(empresa); setErro(null); } })
      .catch((error) => { if (ativo) setErro(error.message); });
    return () => { ativo = false; };
  }, [usuario.id]);

  const empresa = registro?.id === usuario.id ? registro : null;

  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title="Minha empresa" description="Prepare a apresentação da sua empresa para quem busca uma oportunidade." className="max-w-6xl" />
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <FormErrorAlert message={erro} />
        {!empresa && !erro && <PageLoading label="Carregando sua empresa..." />}
        {empresa && <>
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-primary/10 bg-accent/30 p-4 sm:flex-row sm:items-center">
            <p id="apresentacao-disponibilidade" className="flex min-w-0 items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"><LuInfo aria-hidden className="mt-0.5 size-4 shrink-0 text-primary/60" /><span>A edição da apresentação e o envio de imagens estarão disponíveis em breve.</span></p>
            <Link href={`/cadastros/empresa/${empresa.id}?visualizar=1`} className={cn(buttonVariants({ variant: "outline" }), "shrink-0 gap-2")}><LuEye aria-hidden className="size-4" />Ver página pública<LuArrowUpRight aria-hidden className="size-3.5" /></Link>
          </div>

          <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 space-y-5">
              <Card id="identidade-empresa" role="group" aria-labelledby="titulo-identidade-empresa" aria-disabled="true" className="scroll-mt-28 gap-5 p-5 shadow-sm ring-primary/10 sm:p-6">
                <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LuImage aria-hidden className="size-5" /></span><div className="min-w-0 flex-1 space-y-0.5"><h2 id="titulo-identidade-empresa" className="text-lg font-semibold">Identidade visual</h2><p className="text-sm text-muted-foreground">Logo e banner que representam sua empresa.</p></div><Badge variant="outline" className="shrink-0 bg-muted/40 text-muted-foreground">Em breve</Badge></div>
                <div className="space-y-4">
                  <div role="img" aria-label="Prévia do banner da empresa, ainda indisponível" className="flex h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/20 bg-accent/30 text-primary/40 sm:h-44"><LuImage aria-hidden className="size-8" /><span className="text-sm text-muted-foreground">Banner da empresa</span></div>
                  <Field><FieldLabel htmlFor="banner-empresa">Adicionar banner</FieldLabel><Input id="banner-empresa" type="file" accept="image/jpeg,image/png,image/webp" disabled className="h-11 min-w-0" /><FieldDescription className="text-xs">A imagem de capa aparece no topo da página da empresa.</FieldDescription></Field>
                </div>
                <div className="flex flex-col gap-4 border-t border-primary/10 pt-5 sm:flex-row sm:items-center">
                  <span role="img" aria-label="Prévia da logo da empresa, ainda indisponível" className="flex size-24 shrink-0 items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-accent/40 text-primary/35"><LuBuilding2 aria-hidden className="size-10" /></span>
                  <Field className="min-w-0 flex-1"><FieldLabel htmlFor="logo-empresa">Logo da empresa</FieldLabel><Input id="logo-empresa" type="file" accept="image/jpeg,image/png,image/webp" disabled className="h-11 min-w-0" /><FieldDescription className="text-xs">Use a marca que identifica a empresa nas vagas e no perfil.</FieldDescription></Field>
                </div>
              </Card>

              <Card id="sobre-empresa" role="group" aria-labelledby="titulo-sobre-empresa" aria-disabled="true" className="scroll-mt-28 gap-5 p-5 shadow-sm ring-primary/10 sm:p-6">
                <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LuFileText aria-hidden className="size-5" /></span><div className="min-w-0 flex-1 space-y-0.5"><h2 id="titulo-sobre-empresa" className="text-lg font-semibold">Sobre a empresa</h2><p className="text-sm text-muted-foreground">Conte sua história e apresente o que a empresa faz.</p></div><Badge variant="outline" className="shrink-0 bg-muted/40 text-muted-foreground">Em breve</Badge></div>
                <IconInputField id="ramo-empresa" label="Ramo de atuação" icon={LuBriefcaseBusiness} placeholder="Área em que a empresa atua" disabled />
                <Field><FieldLabel htmlFor="descricao-curta-empresa">Descrição curta</FieldLabel><Textarea id="descricao-curta-empresa" rows={3} placeholder="Uma apresentação breve para os cards da empresa." disabled /><FieldDescription className="text-xs">Resuma a atividade da empresa em poucas palavras.</FieldDescription></Field>
                <Field><FieldLabel htmlFor="historia-empresa">História e apresentação</FieldLabel><Textarea id="historia-empresa" rows={9} placeholder="Conte como a empresa começou, o que faz, suas realizações e o que valoriza. Organize o texto em parágrafos, como preferir." disabled className="min-h-48 leading-relaxed" /><FieldDescription className="text-xs">Este texto será exibido na seção Sobre a empresa.</FieldDescription></Field>
              </Card>

              <Card id="fotos-empresa" role="group" aria-labelledby="titulo-fotos-empresa" aria-disabled="true" className="scroll-mt-28 gap-5 p-5 shadow-sm ring-primary/10 sm:p-6">
                <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LuImages aria-hidden className="size-5" /></span><div className="min-w-0 flex-1 space-y-0.5"><h2 id="titulo-fotos-empresa" className="text-lg font-semibold">Fotos da empresa</h2><p className="text-sm text-muted-foreground">Mostre o ambiente de trabalho, a equipe e a estrutura.</p></div><Badge variant="outline" className="shrink-0 bg-muted/40 text-muted-foreground">Em breve</Badge></div>
                <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/20 bg-muted/20 px-5 py-7 text-center"><span className="flex size-12 items-center justify-center rounded-xl border border-primary/10 bg-card text-primary/35"><LuImages aria-hidden className="size-6" /></span><div><p className="text-sm font-medium">Sua galeria começa aqui</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">As fotos aparecerão no carrossel da página da empresa.</p></div></div>
                <Field><FieldLabel htmlFor="galeria-empresa">Adicionar fotos</FieldLabel><Input id="galeria-empresa" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled className="h-11 min-w-0" /><FieldDescription className="text-xs">Você poderá selecionar mais de uma imagem para a galeria.</FieldDescription></Field>
                <Button type="button" variant="outline" disabled className="w-full gap-2 sm:w-fit"><LuUpload aria-hidden className="size-4" />Enviar fotos</Button>
              </Card>

              <Card id="links-empresa" role="group" aria-labelledby="titulo-links-empresa" aria-disabled="true" className="scroll-mt-28 gap-5 p-5 shadow-sm ring-primary/10 sm:p-6">
                <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LuGlobe aria-hidden className="size-5" /></span><div className="min-w-0 flex-1 space-y-0.5"><h2 id="titulo-links-empresa" className="text-lg font-semibold">Links da empresa</h2><p className="text-sm text-muted-foreground">Direcione os candidatos aos seus canais oficiais.</p></div><Badge variant="outline" className="shrink-0 bg-muted/40 text-muted-foreground">Em breve</Badge></div>
                <IconInputField id="site-empresa" label="Site da empresa" icon={LuGlobe} type="url" placeholder="https://" disabled />
                <IconInputField id="linkedin-empresa" label="LinkedIn da empresa" icon={LuLink} type="url" placeholder="https://www.linkedin.com/company/" disabled />
              </Card>
            </div>

            <aside aria-label="Resumo da empresa" className="min-w-0 space-y-5 lg:sticky lg:top-24">
              <Card className="gap-0 overflow-hidden p-0 shadow-sm ring-primary/10">
                <div aria-hidden className="h-20 border-b border-primary/10 bg-accent/60" />
                <div className="relative space-y-4 px-5 pb-5">
                  <span aria-hidden className="-mt-8 flex size-16 items-center justify-center rounded-2xl border-4 border-card bg-accent text-primary/40 ring-1 ring-primary/10"><LuBuilding2 className="size-7" /></span>
                  <div className="min-w-0"><p className="text-[10px] font-semibold tracking-[0.14em] text-primary/50 uppercase">Sua empresa</p><h2 className="mt-1 text-xl leading-snug font-semibold break-words text-primary">{empresa.nome}</h2><p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground"><LuMapPin aria-hidden className="mt-0.5 size-3.5 shrink-0" /><span className="min-w-0 break-words">{[empresa.endereco.bairro, empresa.endereco.cidade].filter(Boolean).join(", ") || "Localização não informada"}</span></p></div>
                  <Link href={`/cadastros/empresa/${empresa.id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2")}><LuSettings aria-hidden className="size-4" />Dados da conta</Link>
                </div>
              </Card>
              <nav aria-label="Seções da página da empresa" className="rounded-2xl border border-primary/10 bg-card p-3 shadow-sm">
                <a href="#identidade-empresa" className="flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-primary"><LuImage aria-hidden className="size-4" />Identidade visual</a>
                <a href="#sobre-empresa" className="flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-primary"><LuFileText aria-hidden className="size-4" />Sobre a empresa</a>
                <a href="#fotos-empresa" className="flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-primary"><LuImages aria-hidden className="size-4" />Fotos da empresa</a>
                <a href="#links-empresa" className="flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-primary"><LuGlobe aria-hidden className="size-4" />Links da empresa</a>
              </nav>
              <Button type="button" disabled aria-describedby="apresentacao-disponibilidade" className="w-full gap-2"><LuSave aria-hidden className="size-4" />Salvar apresentação<span className="text-[10px] font-normal opacity-80">Em breve</span></Button>
            </aside>
          </div>
        </>}
      </div>
    </main>
  );
}
