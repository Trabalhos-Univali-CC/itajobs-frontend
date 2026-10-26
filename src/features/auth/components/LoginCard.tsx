"use client";

import Link from "next/link";
import { useState } from "react";
import { LuUserPlus } from "react-icons/lu";

import { ItajobsEmblem, ItajobsWordmark } from "@/components/brand/ItajobsLogo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { accountTypes, type AccountType } from "@/features/auth/AccountTypes";

import { AccountTypeToggle } from "./AccountTypeToggle";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { LoginForm } from "./LoginForm";

export function LoginCard() {
  const [accountType, setAccountType] = useState<AccountType>("empregado");
  const current = accountTypes.find((type) => type.id === accountType)!;

  return (
    <Card className="relative mt-16 w-full max-w-120 animate-in gap-6 overflow-visible rounded-3xl border-10 border-white/15 bg-clip-padding pt-0 pb-0 shadow-2xl ring-0 duration-500 fade-in-0 slide-in-from-bottom-4 motion-reduce:animate-none">
      <ItajobsEmblem
        priority
        className="absolute -top-16 left-1/2 w-36 -translate-x-1/2 drop-shadow-[0_12px_18px_rgba(0,0,0,0.45)]"
      />

      <CardHeader className="flex flex-col items-center gap-0 px-7 pt-22 text-center">
        <h1 aria-label="ItaJobs" className="text-[32px] leading-none">
          <ItajobsWordmark />
        </h1>
        <p className="mt-4 text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
          Empregos em Itajaí
        </p>
        <CardTitle className="mt-6 text-lg font-semibold text-card-foreground">Entrar na sua conta</CardTitle>
        <CardDescription className="mt-1">Escolha como você usa o ItaJobs.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-7">
        <AccountTypeToggle value={accountType} onChange={setAccountType} />
        <LoginForm redirectTo={current.home} />
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">ou</FieldSeparator>
        <GoogleSignInButton href={current.home} />
      </CardContent>

      <CardFooter className="justify-center gap-1.5 rounded-b-xl px-7 py-5 text-sm text-muted-foreground">
        Ainda não tem conta?
        <Link
          href={current.signup}
          className="inline-flex items-center gap-1 font-semibold text-primary underline decoration-secondary decoration-2 underline-offset-4 transition-colors hover:decoration-primary"
        >
          <LuUserPlus className="size-4" />
          Criar conta
        </Link>
      </CardFooter>
    </Card>
  );
}
