import { LuIdCard, LuLink, LuMail, LuMapPin, LuPhone, LuUserRound } from "react-icons/lu";
import { IconInputField } from "@/components/form/IconInputField";
import type { Candidato } from "@/types/usuario";
import { formatarTelefone } from "@/utils/utils";
import { ResumeSection } from "./ResumeSection";
import { PhotoField } from "./PhotoField";

export function PersonalInfoSection({ candidato, imagem, portfolio, onPortfolioChange }: { candidato: Candidato; imagem: string | null; portfolio: string; onPortfolioChange: (value: string) => void }) {
  return (
    <ResumeSection parte={1} titulo="Dados pessoais" descricao="O cabeçalho do currículo. Nome, bairro e telefone vêm do seu cadastro." icon={LuIdCard}>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <PhotoField imagem={imagem} />
        <div className="grid w-full min-w-0 flex-1 gap-4 sm:grid-cols-2">
        <IconInputField id="nome-candidato" label="Nome" icon={LuUserRound} value={`${candidato.nome} ${candidato.sobrenome}`} readOnly className="sm:col-span-2" />
        <IconInputField id="bairro-candidato" label="Endereço" icon={LuMapPin} value={[candidato.endereco.bairro, candidato.endereco.cidade].filter(Boolean).join(", ")} readOnly />
        <IconInputField id="telefone-candidato" label="Telefone" icon={LuPhone} value={formatarTelefone(candidato.contato.telefone)} readOnly />
        <IconInputField id="email-candidato" label="E-mail" icon={LuMail} value={candidato.contato.email} readOnly className="sm:col-span-2" />
        <IconInputField id="portfolio" label="Portfólio (opcional)" icon={LuLink} type="url" form="curriculo-resumo" value={portfolio} onChange={(event) => onPortfolioChange(event.target.value)} maxLength={255} pattern="https?://.+" placeholder="https://github.com/seu-perfil" description="LinkedIn, GitHub, Behance ou seu site. Confirme as alterações em Salvar dados." className="sm:col-span-2" />
        </div>
      </div>
    </ResumeSection>
  );
}
