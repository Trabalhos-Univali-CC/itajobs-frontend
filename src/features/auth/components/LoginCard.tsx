"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuHash } from "react-icons/lu";
import { ItajobsLogo } from "@/components/brand/ItajobsLogo";
import { IconInputField } from "@/components/form/IconInputField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { accountTypes, type AccountType } from "@/features/auth/accountTypes";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { get } from "@/lib/api";
import type { Candidato, Empresa } from "@/types/usuario";
import { cn } from "@/utils/utils";

export function LoginCard() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("empregado");
  const current = accountTypes.find((type) => type.id === accountType)!;
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    const cadastro = await get<Candidato | Empresa>(`/api/${current.tipo}/${Number(form.get("id"))}`);
    router.push(`/cadastros/${current.tipo}/${cadastro.id}`);
  });
  return (
    <Card className="relative mt-16 w-full max-w-120 gap-6 overflow-visible rounded-3xl border-10 border-white/15 bg-clip-padding pt-0 pb-0 shadow-2xl ring-0">
      <ItajobsLogo priority className="absolute -top-16 left-1/2 w-36 -translate-x-1/2 drop-shadow-[0_12px_18px_rgba(0,0,0,0.45)]" />
      <CardHeader className="flex flex-col items-center gap-0 px-7 pt-22 text-center">
        <h1 aria-label="ItaJobs" className="text-[32px] leading-none"><ItajobsLogo variant="wordmark" /></h1>
        <CardTitle className="mt-6 text-lg">Consultar cadastro</CardTitle>
        <CardDescription className="mt-2">O acesso por ID não autentica sua identidade. O login ainda não está disponível.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-7">
        <div role="radiogroup" aria-label="Tipo de cadastro" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
          {accountTypes.map(({ id, label, icon: Icon }) => <button key={id} type="button" role="radio" aria-checked={id === accountType} onClick={() => setAccountType(id)} className={cn("flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium", id === accountType && "bg-primary text-white")}><Icon className="size-4" />{label}</button>)}
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <IconInputField id="id" label={`ID do ${current.tipo}`} icon={LuHash} type="number" min={1} required />
          <FormErrorAlert message={erro} />
          <SubmitButton pending={enviando} pendingLabel="Consultando..." className="w-full">Consultar</SubmitButton>
        </form>
        <Link href="/cadastros" className="text-center text-sm text-primary underline">Ver cadastros disponíveis</Link>
      </CardContent>
      <CardFooter className="justify-center gap-2 py-5 text-sm text-muted-foreground">Ainda não tem cadastro?<Link href={current.signup} className="font-semibold text-primary underline">Cadastrar</Link></CardFooter>
    </Card>
  );
}
