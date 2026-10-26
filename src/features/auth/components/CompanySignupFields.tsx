import { LuBuilding2, LuFileText, LuMail, LuPhone } from "react-icons/lu";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";

import { BairroSelect } from "./BairroSelect";
import { IconInputField } from "./IconInputField";

export function CompanySignupFields() {
  return (
    <>
      <IconInputField id="razao-social" label="Razão social" icon={LuBuilding2} autoComplete="organization" placeholder="Ex.: Porto Pesca Ltda." />
      <IconInputField id="cnpj" label="CNPJ" icon={LuFileText} inputMode="numeric" placeholder="00.000.000/0000-00" />
      <IconInputField id="email" label="E-mail corporativo" icon={LuMail} type="email" autoComplete="email" placeholder="rh@suaempresa.com.br" />
      <IconInputField id="telefone" label="Telefone" icon={LuPhone} type="tel" autoComplete="tel" placeholder="(47) 0000-0000" />
      <Field>
        <FieldLabel htmlFor="bairro">Bairro da empresa</FieldLabel>
        <BairroSelect id="bairro" />
        <FieldDescription className="text-xs">Só empresas com endereço em Itajaí.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="senha">Crie uma senha</FieldLabel>
        <PasswordInput id="senha" autoComplete="new-password" placeholder="Mínimo de 8 caracteres" />
      </Field>
    </>
  );
}
