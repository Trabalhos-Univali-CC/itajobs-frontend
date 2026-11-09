import { LuIdCard, LuMail, LuMapPin, LuPhone, LuUserRound } from "react-icons/lu";
import { IconInputField } from "@/components/form/IconInputField";
import type { Candidato } from "@/types/usuario";
import { formatarTelefone } from "@/utils/utils";
import { ResumeSection } from "./ResumeSection";

export function PersonalInfoSection({ candidato }: { candidato: Candidato }) {
  return (
    <ResumeSection parte={1} titulo="Dados pessoais" descricao="Informações do cadastro do candidato." icon={LuIdCard}>
      <div className="grid gap-4 sm:grid-cols-2">
        <IconInputField id="nome-candidato" label="Nome" icon={LuUserRound} value={`${candidato.nome} ${candidato.sobrenome}`} readOnly />
        <IconInputField id="bairro-candidato" label="Endereço" icon={LuMapPin} value={[candidato.endereco.bairro, candidato.endereco.cidade].filter(Boolean).join(", ")} readOnly />
        <IconInputField id="telefone-candidato" label="Telefone" icon={LuPhone} value={formatarTelefone(candidato.contato.telefone)} readOnly />
        <IconInputField id="email-candidato" label="E-mail" icon={LuMail} value={candidato.contato.email} readOnly />
      </div>
    </ResumeSection>
  );
}
