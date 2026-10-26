import { LuIdCard, LuMail, LuPhone, LuUserRound } from "react-icons/lu";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";

import { BairroSelect } from "./BairroSelect";
import { IconInputField } from "./IconInputField";

export function CandidateSignupFields() {
  return (
    <>
      <IconInputField id="nome" label="Nome completo" icon={LuUserRound} autoComplete="name" placeholder="Ex.: Marina Deschamps" />
      <IconInputField id="cpf" label="CPF" icon={LuIdCard} inputMode="numeric" placeholder="000.000.000-00" />
      <IconInputField id="email" label="E-mail" icon={LuMail} type="email" autoComplete="email" placeholder="seu@email.com" />
      <IconInputField id="telefone" label="WhatsApp" icon={LuPhone} type="tel" autoComplete="tel" placeholder="(47) 9 0000-0000" />
      <Field>
        <FieldLabel htmlFor="bairro">Bairro onde mora</FieldLabel>
        <BairroSelect id="bairro" />
        <FieldDescription className="text-xs">O ItaJobs é exclusivo para Itajaí.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="senha">Crie uma senha</FieldLabel>
        <PasswordInput id="senha" autoComplete="new-password" placeholder="Mínimo de 8 caracteres" />
      </Field>
    </>
  );
}
