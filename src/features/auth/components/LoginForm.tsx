"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { LuArrowRight, LuMail } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";

import { IconInputField } from "./IconInputField";

type LoginFormProps = {
  redirectTo: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(redirectTo);
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-4">
        <IconInputField id="email" label="E-mail" icon={LuMail} type="email" autoComplete="email" placeholder="seu@email.com" />
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="senha">Senha</FieldLabel>
            <Link href="#" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              Esqueci a senha
            </Link>
          </div>
          <PasswordInput id="senha" autoComplete="current-password" placeholder="Sua senha" />
        </Field>
        <Button type="submit" size="lg" className="mt-1 h-10 w-full">
          Entrar
          <LuArrowRight className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
        </Button>
      </FieldGroup>
    </form>
  );
}
