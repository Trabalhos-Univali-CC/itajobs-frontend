import { LuIdCard, LuMail, LuPhone, LuUserRound } from "react-icons/lu";

import { IconInputField } from "@/components/form/IconInputField";

import { AddressFields } from "@/features/auth/components/AddressFields";

export default function CadastroCandidatoPage() {
  return (
    <>
      <IconInputField id="nome" label="Nome" icon={LuUserRound} autoComplete="given-name" placeholder="Ex.: Marina" required minLength={2} maxLength={100} />
      <IconInputField id="sobrenome" label="Sobrenome" icon={LuUserRound} autoComplete="family-name" placeholder="Ex.: Deschamps" required minLength={2} maxLength={100} />
      <IconInputField id="cpf" label="CPF" icon={LuIdCard} inputMode="numeric" placeholder="000.000.000-00" required maxLength={14} />
      <IconInputField id="telefone" label="WhatsApp" icon={LuPhone} type="tel" autoComplete="tel" placeholder="(47) 9 0000-0000" required maxLength={16} />
      <IconInputField id="email" label="E-mail" icon={LuMail} type="email" autoComplete="email" placeholder="seu@email.com" required maxLength={100} />
      <AddressFields bairroLabel="Bairro onde mora" bairroDescription="O ItaJobs é exclusivo para Itajaí." />
    </>
  );
}
