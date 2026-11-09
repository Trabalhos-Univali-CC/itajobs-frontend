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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
    const cadastro = await registrar(current.tipo, form);
    router.push(`/cadastros/${current.tipo}/${cadastro.id}`);
  });

  return (
    <Card className="gap-0 rounded-2xl border px-6 py-7 shadow-xl shadow-primary/5 ring-0 sm:px-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <FieldGroup key={current.id} className="grid animate-in gap-x-5 gap-y-4 duration-300 fade-in-0 sm:grid-cols-2 motion-reduce:animate-none">
          {children}
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
          <div className="flex gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 flex-1 px-5 sm:flex-none")}>
              <LuArrowLeft className="transition-transform duration-200 group-hover/button:-translate-x-0.5" />
              Voltar
            </Link>
            <SubmitButton
              pending={enviando}
              pendingLabel="Cadastrando..."
              variant="secondary"
              size="lg"
              className="h-10 flex-1 px-6 font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/40 sm:flex-none"
            >
              Cadastrar
            </SubmitButton>
          </div>
        </div>
      </form>
    </Card>
  );
}
