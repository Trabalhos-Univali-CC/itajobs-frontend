"use client";

import { PageLoading } from "@/components/ui/page-loading";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LuArrowUpRight, LuBriefcaseBusiness, LuBuilding2, LuCheck, LuFileText, LuIdCard, LuKeyRound, LuMail, LuMapPin, LuPhone, LuShieldCheck, LuTrash2, LuTriangleAlert, LuUserRound } from "react-icons/lu";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { IconInputField } from "@/components/form/IconInputField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { PageHero } from "@/components/layout/PageHero";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { registrar } from "@/features/auth/authApi";
import { AddressFields } from "@/features/auth/components/AddressFields";
import { useUsuario } from "@/features/auth/sessionContext";
import { ApplicationsSection } from "@/features/candidaturas/components/ApplicationsSection";
import { CompanyProfile } from "@/features/empresas/components/CompanyProfile";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { del, get, post, put } from "@/lib/api";
import type { Candidato, Empresa } from "@/types/usuario";
import { cn } from "@/utils/utils";

export default function CadastroPage() {
  const { tipo, id } = useParams<{ tipo: string; id: string }>();
  const router = useRouter();
  const visualizarEmpresa = useSearchParams().get("visualizar") === "1";
  const usuario = useUsuario();
  const proprio = usuario.tipo === tipo && usuario.id === Number(id);
  const [registro, setCadastro] = useState<Candidato | Empresa | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [senhaSalva, setSenhaSalva] = useState(false);
  const senhaFormRef = useRef<HTMLFormElement>(null);
  const contaExcluidaRef = useRef(false);
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    if (tipo !== "candidato" && tipo !== "empresa") throw new Error("Tipo de cadastro inválido.");
    if (!proprio) throw new Error("Você só pode alterar sua própria conta.");
    setSalvo(false);
    setCadastro(await registrar(tipo, form, Number(id)));
    setSalvo(true);
  });
  const { erro: erroSenha, enviando: trocandoSenha, onSubmit: trocarSenha } = useFormSubmit(async (form) => {
    if (!proprio) throw new Error("Você só pode alterar sua própria senha.");
    setSenhaSalva(false);
    if (form.get("novaSenha") !== form.get("confirmarSenha")) throw new Error("As senhas não coincidem.");
    await put("/api/auth/senha", { senhaAtual: String(form.get("senhaAtual")), novaSenha: String(form.get("novaSenha")) });
    senhaFormRef.current?.reset();
    setSenhaSalva(true);
  });

  useEffect(() => {
    if (tipo !== "candidato" && tipo !== "empresa") return;
    if (tipo === "candidato" && usuario.tipo === "empresa") { router.replace(`/painel/candidatos/${id}`); return; }
    let ativo = true;
    get<Candidato | Empresa>(`/api/${tipo}/${id}`)
      .then((dados) => { if (ativo) { setCadastro(dados); setFalha(null); } })
      .catch((error) => { if (ativo) setFalha(error.message); });
    return () => { ativo = false; };
  }, [tipo, id, usuario.tipo, router]);

  const cadastro = registro?.id === Number(id) && (tipo === "candidato" ? "cpf" in registro : tipo === "empresa" && "cnpj" in registro) ? registro : null;
  const nome = cadastro ? "sobrenome" in cadastro ? `${cadastro.nome} ${cadastro.sobrenome}` : cadastro.nome : proprio ? usuario.nome : "Perfil";

  if (tipo === "candidato" && usuario.tipo === "empresa") {
    return <main className="flex-1 bg-muted/25 px-4 py-10"><PageLoading label="Carregando currículo do candidato..." /></main>;
  }

  if (tipo === "empresa" && (!proprio || visualizarEmpresa)) {
    return cadastro && "cnpj" in cadastro ? <CompanyProfile key={cadastro.id} empresa={cadastro} /> : (
      <main className="flex-1 bg-muted/25 px-4 py-10"><div className="mx-auto max-w-6xl"><FormErrorAlert message={falha} />{!falha && <PageLoading label="Carregando perfil da empresa..." />}</div></main>
    );
  }

  return (
    <main className="flex-1 bg-muted/20 pb-16">
      <PageHero title={proprio ? "Meu perfil" : nome} description={proprio ? tipo === "candidato" ? "Suas oportunidades, seu currículo e os dados da sua conta em um só lugar." : "Cuide dos dados e da segurança da sua conta." : "Conheça os dados cadastrados deste candidato."} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FormErrorAlert message={falha ?? (tipo !== "candidato" && tipo !== "empresa" ? "Tipo de cadastro inválido." : null)} />
        {!cadastro && !falha && (tipo === "candidato" || tipo === "empresa") && <PageLoading label="Carregando perfil..." />}
        {cadastro && <div className="grid items-start gap-6 md:grid-cols-[15rem_minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside aria-label="Resumo do perfil" className="min-w-0 rounded-2xl border border-primary/10 bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex size-32 items-center justify-center overflow-hidden rounded-full bg-accent text-primary/45 ring-2 ring-secondary/80 ring-offset-4 ring-offset-card">{proprio && tipo === "candidato" && usuario.foto ? <Image src={usuario.foto} alt="Sua foto de perfil" fill unoptimized className="object-cover" onError={() => usuario.setFoto(null)} /> : tipo === "empresa" ? <LuBuilding2 aria-hidden className="size-12" /> : <LuUserRound aria-hidden className="size-12" />}</div>
              <div className="mt-5 w-full min-w-0"><p className="text-[10px] font-semibold tracking-[0.15em] text-primary/60 uppercase">{tipo === "empresa" ? "Conta de empresa" : "Perfil profissional"}</p><h2 className="mt-1 text-xl leading-snug font-semibold break-words text-primary">{nome}</h2><p className="mt-2 text-xs leading-relaxed break-all text-muted-foreground">{cadastro.contato.email}</p><p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><LuMapPin aria-hidden className="size-3.5 shrink-0" /><span>{cadastro.endereco.cidade}</span></p></div>
            </div>

            <div className="mt-5 space-y-2">
              {tipo === "candidato" ? <Link href={proprio ? "/curriculo" : `/painel/candidatos/${id}`} className={cn(buttonVariants(), "w-full gap-2")}><LuFileText aria-hidden className="size-4" />{proprio ? "Editar currículo" : "Ver currículo"}<LuArrowUpRight aria-hidden className="size-3.5" /></Link> : <>
                <Link href="/painel/empresa" className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2")}><LuBuilding2 aria-hidden className="size-4" />Página da empresa</Link>
                <Link href="/painel/vagas" className={cn(buttonVariants(), "w-full gap-2")}><LuBriefcaseBusiness aria-hidden className="size-4" />Gerenciar vagas</Link>
                <p className="text-center text-xs text-muted-foreground">Nota da empresa: {"nota" in cadastro && cadastro.nota !== null ? `${cadastro.nota.toLocaleString("pt-BR")} / 5` : "Sem avaliações"}</p>
              </>}
            </div>

            <nav aria-label="Seções do perfil" className="mt-5 hidden space-y-1 border-t border-primary/10 pt-4 text-sm md:block">
              <a href="#dados-da-conta" className="flex min-h-10 items-center gap-2 rounded-lg px-2 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-primary"><LuUserRound aria-hidden className="size-4" />Dados da conta</a>
              {proprio && <><a href="#seguranca" className="flex min-h-10 items-center gap-2 rounded-lg px-2 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-primary"><LuShieldCheck aria-hidden className="size-4" />Senha e segurança</a><a href="#zona-vermelha" className="flex min-h-10 items-center gap-2 rounded-lg px-2 text-destructive/80 transition-colors hover:bg-destructive/5 hover:text-destructive"><LuTriangleAlert aria-hidden className="size-4" />Zona vermelha</a></>}
            </nav>
          </aside>

          <div className="min-w-0 space-y-6">
            {proprio && tipo === "candidato" && <ApplicationsSection key={usuario.id} />}

            <section id="dados-da-conta" aria-labelledby="perfil-dados" className="scroll-mt-40 rounded-2xl border border-primary/10 bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LuUserRound aria-hidden className="size-5" /></span><div><h2 id="perfil-dados" className="text-lg font-semibold text-primary">Dados da conta</h2><p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{proprio ? "Mantenha seus dados e formas de contato atualizados." : "Informações cadastradas pelo candidato."}</p></div></div>
              <form key={`${tipo}-${cadastro.id}`} onSubmit={onSubmit}>
                <fieldset disabled={!proprio || enviando || excluindo} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <IconInputField id="nome" label={tipo === "empresa" ? "Razão social" : "Nome"} icon={tipo === "empresa" ? LuBuilding2 : LuUserRound} required minLength={2} maxLength={100} autoComplete={tipo === "empresa" ? "organization" : "given-name"} defaultValue={cadastro.nome} className={tipo === "empresa" ? "sm:col-span-2" : undefined} />
                    {"sobrenome" in cadastro && <IconInputField id="sobrenome" label="Sobrenome" icon={LuUserRound} required minLength={2} maxLength={100} autoComplete="family-name" defaultValue={cadastro.sobrenome} />}
                    {"cpf" in cadastro ? <IconInputField id="cpf" label="CPF" icon={LuIdCard} inputMode="numeric" required maxLength={14} defaultValue={cadastro.cpf} /> : <IconInputField id="cnpj" label="CNPJ" icon={LuIdCard} required maxLength={18} defaultValue={cadastro.cnpj} />}
                    <IconInputField id="telefone" label="Telefone" icon={LuPhone} type="tel" autoComplete="tel" required maxLength={15} defaultValue={cadastro.contato.telefone} />
                    <IconInputField id="email" label="E-mail" icon={LuMail} type="email" autoComplete="email" required maxLength={100} defaultValue={cadastro.contato.email} className="sm:col-span-2" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 sm:[&>[data-slot=field]:last-child]:col-span-2"><AddressFields bairroLabel="Bairro" bairroDescription="Bairro do seu endereço de cadastro." endereco={cadastro.endereco} /></div>
                  <FormErrorAlert message={erro} />
                  {proprio && <div className="flex flex-wrap items-center gap-3 border-t border-primary/10 pt-4"><SubmitButton pending={enviando} pendingLabel="Salvando..." icon={LuCheck}>Salvar alterações</SubmitButton>{salvo && <p role="status" className="text-sm text-primary">Dados atualizados com sucesso.</p>}</div>}
                </fieldset>
              </form>
            </section>

            {proprio && <>
              <section id="seguranca" aria-labelledby="perfil-seguranca" className="scroll-mt-40 rounded-2xl border border-primary/10 bg-card p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LuShieldCheck aria-hidden className="size-5" /></span><div><h2 id="perfil-seguranca" className="text-lg font-semibold text-primary">Senha e segurança</h2><p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Atualize a senha usada para entrar na sua conta.</p></div></div>
                <form ref={senhaFormRef} onSubmit={trocarSenha}>
                  <fieldset disabled={trocandoSenha || excluindo} className="grid gap-4 sm:grid-cols-2">
                    <Field className="sm:col-span-2"><FieldLabel htmlFor="senhaAtual">Senha atual</FieldLabel><PasswordInput id="senhaAtual" name="senhaAtual" required maxLength={100} autoComplete="current-password" /></Field>
                    <Field><FieldLabel htmlFor="novaSenha">Nova senha</FieldLabel><PasswordInput id="novaSenha" name="novaSenha" required minLength={8} maxLength={100} autoComplete="new-password" /></Field>
                    <Field><FieldLabel htmlFor="confirmarSenha">Confirmar nova senha</FieldLabel><PasswordInput id="confirmarSenha" name="confirmarSenha" required minLength={8} maxLength={100} autoComplete="new-password" /></Field>
                    <div className="sm:col-span-2"><FormErrorAlert message={erroSenha} /></div>
                    <div className="flex flex-wrap items-center gap-3 border-t border-primary/10 pt-4 sm:col-span-2"><SubmitButton pending={trocandoSenha} pendingLabel="Alterando..." icon={LuKeyRound}>Alterar senha</SubmitButton>{senhaSalva && <p role="status" className="text-sm text-primary">Senha alterada com sucesso.</p>}</div>
                  </fieldset>
                </form>
              </section>

              <section id="zona-vermelha" aria-labelledby="perfil-zona-vermelha" className="scroll-mt-40 overflow-hidden rounded-2xl border border-destructive/25 bg-card">
                <div className="flex items-center gap-2.5 border-b border-destructive/15 bg-destructive/5 px-5 py-3 sm:px-6"><LuTriangleAlert aria-hidden className="size-4 text-destructive" /><h2 id="perfil-zona-vermelha" className="text-sm font-semibold text-destructive">Zona vermelha</h2></div>
                <div className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                  <div className="min-w-0"><h3 className="text-sm font-semibold">Excluir minha conta</h3><p className="mt-0.5 max-w-md text-xs leading-relaxed text-muted-foreground">Remova seu cadastro e os dados vinculados a esta conta. Seu acesso ao ItaJobs será encerrado.</p></div>
                  <ConfirmationDialog variant="destructive" title="Excluir sua conta?" description="Seu cadastro será removido e sua sessão será encerrada. Para voltar ao ItaJobs, você precisará criar uma nova conta." warning={tipo === "candidato" ? "Seu currículo e suas candidaturas também serão removidos." : "As vagas e os registros vinculados à empresa também serão removidos."} confirmLabel="Sim, excluir minha conta" pendingLabel="Excluindo conta..." trigger={<Button type="button" variant="destructive" disabled={excluindo || enviando || trocandoSenha} className="shrink-0 gap-2"><LuTrash2 aria-hidden className="size-4" />Excluir conta</Button>} onConfirm={async () => {
                    setExcluindo(true);
                    try {
                      if (!contaExcluidaRef.current) {
                        await del(`/api/${tipo}/${id}`);
                        contaExcluidaRef.current = true;
                      }
                      await post("/api/auth/logout", {});
                      router.replace("/login");
                      router.refresh();
                    } finally { setExcluindo(false); }
                  }} />
                </div>
              </section>
            </>}
          </div>
        </div>}
      </div>
    </main>
  );
}
