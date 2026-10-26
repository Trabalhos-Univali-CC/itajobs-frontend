"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { accountTypes } from "@/features/auth/AccountTypes";
import { cn } from "@/lib/Utils";

export function SignupFormCard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const current = accountTypes.find((type) => type.signup === pathname) ?? accountTypes[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(current.home);
  }

  return (
    <Card className="gap-0 rounded-2xl border px-6 py-7 shadow-xl shadow-primary/5 ring-0 sm:px-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FieldGroup key={current.id} className="grid animate-in gap-x-5 gap-y-4 duration-300 fade-in-0 sm:grid-cols-2 motion-reduce:animate-none">
          {children}
        </FieldGroup>

        <Field orientation="horizontal">
          <Checkbox id="termos" />
          <FieldLabel htmlFor="termos" className="font-normal text-muted-foreground">
            Li e aceito os termos de uso e a política de privacidade do ItaJobs.
          </FieldLabel>
        </Field>

        <div className="flex flex-col-reverse gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-center text-sm text-muted-foreground sm:text-left">Etapa 2 de 3</span>
          <div className="flex gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 flex-1 px-5 sm:flex-none")}>
              <LuArrowLeft className="transition-transform duration-200 group-hover/button:-translate-x-0.5" />
              Voltar
            </Link>
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="h-10 flex-1 px-6 font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/40 sm:flex-none"
            >
              Continuar
              <LuArrowRight className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
