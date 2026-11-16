"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";

import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { accountTypes } from "@/features/auth/accountTypes";
import { registrar } from "@/features/auth/authApi";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { cn } from "@/utils/utils";

import { TermoDeUsoDialog } from "./TermoDeUsoDialog";

export function SignupFormCard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const current = accountTypes.find((type) => type.signup === pathname) ?? accountTypes[0];
  const [aceito, setAceito] = useState(false);

  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    if (!aceito) {
      throw new Error("Aceite os termos de uso e a política de privacidade para continuar.");
    }
    if (form.get("senha") !== form.get("confirmarSenha")) throw new Error("As senhas não coincidem.");
    await registrar(current.tipo, form);
    router.push("/login");
  });

  return (
    <Card className="gap-0 rounded-2xl border px-6 py-7 shadow-xl shadow-primary/5 ring-0 sm:px-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <FieldGroup key={current.id} className="grid animate-in items-start gap-x-5 gap-y-5 duration-300 fade-in-0 sm:grid-cols-2 motion-reduce:animate-none">
          <FieldSeparator className="my-1 sm:col-span-2 *:data-[slot=field-separator-content]:bg-card">{current.tipo === "candidato" ? "Dados pessoais e contato" : "Dados da empresa e contato"}</FieldSeparator>
          {children}
          <FieldSeparator className="my-1 sm:col-span-2 *:data-[slot=field-separator-content]:bg-card">Segurança da conta</FieldSeparator>
          <Field><FieldLabel htmlFor="senha">Senha</FieldLabel><PasswordInput id="senha" name="senha" required minLength={8} maxLength={100} autoComplete="new-password" /><FieldDescription>Use entre 8 e 100 caracteres.</FieldDescription></Field>
          <Field><FieldLabel htmlFor="confirmarSenha">Confirmar senha</FieldLabel><PasswordInput id="confirmarSenha" name="confirmarSenha" required minLength={8} maxLength={100} autoComplete="new-password" /></Field>
        </FieldGroup>

        <Field orientation="horizontal">
          <Checkbox id="termos" name="termos" checked={aceito} onCheckedChange={setAceito} />
          <FieldLabel htmlFor="termos" className="inline font-normal text-muted-foreground">
            Li e aceito os <TermoDeUsoDialog onAccept={() => setAceito(true)} /> do ItaJobs.
          </FieldLabel>
        </Field>

        <FormErrorAlert message={erro} />

        <div className="flex flex-col-reverse gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-center text-sm text-muted-foreground sm:text-left">Etapa 2 de 3</span>
          <div className="flex flex-col gap-3 min-[360px]:flex-row">
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex-1 sm:flex-none")}>
              <LuArrowLeft />
              Voltar
            </Link>
            <SubmitButton
              pending={enviando}
              pendingLabel="Cadastrando..."
              variant="secondary"
              size="lg"
              className="flex-1 px-6 sm:flex-none"
            >
              Cadastrar
            </SubmitButton>
          </div>
        </div>
      </form>
    </Card>
  );
}
