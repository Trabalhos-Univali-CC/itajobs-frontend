"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LuCircleAlert, LuMail, LuUserPlus } from "react-icons/lu";

import { ItajobsLogo } from "@/components/brand/ItajobsLogo";
import { IconInputField } from "@/components/form/IconInputField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { texto } from "@/features/auth/authApi";
import { CampoInvalido, useFormSubmit } from "@/hooks/useFormSubmit";
import { ApiError, post } from "@/lib/api";
import type { UsuarioLogado } from "@/types/usuario";

export function LoginCard() {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{ id: number; aberto: boolean } | null>(null);

  const { falha, enviando, onSubmit, limparErro } = useFormSubmit(async (form) => {
    const email = texto(form, "email");
    if (!email) {
      throw new CampoInvalido("email", "Informe seu e-mail.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new CampoInvalido("email", "Digite um e-mail válido, como nome@email.com.");
    }
    const password = String(form.get("senha") ?? "");
    if (!password) {
      throw new CampoInvalido("senha", "Informe sua senha.");
    }

    try {
      const { usuario } = await post<{ usuario: UsuarioLogado }>("/api/auth/login", { email: email.toLowerCase(), senha: password });
      router.replace(usuario.tipo === "empresa" ? "/painel/vagas" : "/");
      router.refresh();
    } catch (error) {
      throw error instanceof ApiError && error.status === 401 ? new CampoInvalido("senha", error.message) : error;
    }
  });

  const campoComErro = falha && (falha.campo ?? "senha");

  useEffect(() => {
    if (!falha) {
      return;
    }
    const timer = setTimeout(() => setTooltip({ id: falha.id, aberto: false }), 5000);
    return () => clearTimeout(timer);
  }, [falha]);

  const erroDoCampo = falha ? (
    <Tooltip
      key={falha.id}
      open={tooltip?.id === falha.id ? tooltip.aberto : true}
      onOpenChange={(aberto) => setTooltip({ id: falha.id, aberto })}
    >
      <TooltipTrigger
        delay={0}
        render={<span role="img" tabIndex={0} aria-label={`Erro: ${falha.mensagem}`} />}
        className="flex size-6 animate-in cursor-help items-center justify-center rounded-full text-destructive duration-300 outline-none zoom-in-50 focus-visible:ring-2 focus-visible:ring-destructive/40 motion-reduce:animate-none"
      >
        <LuCircleAlert className="size-4.5" />
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={14}
        className="max-w-60 bg-destructive px-3 py-2 text-[13px] leading-snug font-medium text-white shadow-lg shadow-destructive/25 *:last:bg-destructive *:last:fill-destructive"
      >
        <span>{falha.mensagem}</span>
      </TooltipContent>
    </Tooltip>
  ) : null;

  return (
    <Card className="relative mt-16 w-full max-w-120 animate-in gap-6 overflow-visible rounded-3xl border-10 border-white/15 bg-clip-padding pt-0 pb-0 shadow-2xl ring-0 duration-500 fade-in-0 slide-in-from-bottom-4 motion-reduce:animate-none">
      <ItajobsLogo
        priority
        className="absolute -top-16 left-1/2 w-36 -translate-x-1/2 drop-shadow-[0_12px_18px_rgba(0,0,0,0.45)]"
      />

      <CardHeader className="flex flex-col items-center gap-0 px-7 pt-22 text-center">
        <h1 aria-label="ItaJobs" className="text-[32px] leading-none">
          <ItajobsLogo variant="wordmark" />
        </h1>
        <p className="mt-4 text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
          Empregos em Itajaí
        </p>
        <CardTitle className="mt-6 text-lg font-semibold text-card-foreground">Entrar na sua conta</CardTitle>
        <CardDescription className="mt-0.5">Acesse com seu e-mail e senha.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-7">
        <form noValidate onSubmit={onSubmit} onInput={() => falha && limparErro()}>
          <FieldGroup className="gap-4">
            <IconInputField
              id="email"
              label="E-mail"
              icon={LuMail}
              type="email"
              autoComplete="username"
              required
              maxLength={100}
              placeholder="seu@email.com"
              aria-invalid={campoComErro === "email"}
              addonEnd={campoComErro === "email" ? erroDoCampo : null}
            />
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="senha">Senha</FieldLabel>
                <button type="button" disabled title="Recuperação de senha em breve." aria-describedby="recuperacao-indisponivel" className="cursor-not-allowed text-sm font-medium text-muted-foreground underline-offset-4 disabled:opacity-60">
                  Esqueci a senha
                </button>
                <span id="recuperacao-indisponivel" className="sr-only">Recuperação de senha ainda indisponível.</span>
              </div>
              <PasswordInput
                id="senha"
                name="senha"
                autoComplete="current-password"
                required
                placeholder="Sua senha"
                aria-invalid={campoComErro === "senha"}
                addonEnd={campoComErro === "senha" ? erroDoCampo : null}
              />
            </Field>
            <SubmitButton pending={enviando} pendingLabel="Entrando..." size="lg" className="mt-1 w-full">
              Entrar
            </SubmitButton>
          </FieldGroup>
        </form>

        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">ou</FieldSeparator>

        <Button type="button" variant="outline" size="lg" disabled title="Login com Google em breve." aria-describedby="google-indisponivel" className="w-full">
          <FcGoogle className="size-4.5" />
          Continuar com Google
        </Button>
        <p id="google-indisponivel" className="-mt-4 text-center text-xs text-muted-foreground">Login com Google · Em breve</p>
      </CardContent>

      <CardFooter className="justify-center gap-1.5 rounded-b-xl px-7 py-5 text-sm text-muted-foreground">
        Ainda não tem conta?
        <Link
          href="/cadastro/candidato"
          className="inline-flex items-center gap-1 font-semibold text-primary underline decoration-secondary decoration-2 underline-offset-4 transition-colors hover:decoration-primary"
        >
          <LuUserPlus className="size-4" />
          Criar conta
        </Link>
      </CardFooter>
    </Card>
  );
}
