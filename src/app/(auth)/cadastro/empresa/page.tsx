import { LuBuilding2, LuFileText, LuMail, LuPhone } from "react-icons/lu";

import { IconInputField } from "@/components/form/IconInputField";

import { AddressFields } from "@/features/auth/components/AddressFields";

export default function CadastroEmpresaPage() {
  return (
    <>
      <IconInputField id="nome" label="Razão social" icon={LuBuilding2} autoComplete="organization" placeholder="Ex.: Porto Pesca Ltda." required minLength={2} maxLength={100} className="sm:col-span-2" />
      <IconInputField id="cnpj" label="CNPJ" icon={LuFileText} placeholder="00.000.000/0000-00" required maxLength={18} />
      <IconInputField id="telefone" label="Telefone" icon={LuPhone} type="tel" autoComplete="tel" placeholder="(47) 0000-0000" required maxLength={16} />
      <IconInputField id="email" label="E-mail corporativo" icon={LuMail} type="email" autoComplete="email" placeholder="rh@suaempresa.com.br" required maxLength={100} />
      <AddressFields bairroLabel="Bairro da empresa" bairroDescription="Só empresas com endereço em Itajaí." />
    </>
  );
}
