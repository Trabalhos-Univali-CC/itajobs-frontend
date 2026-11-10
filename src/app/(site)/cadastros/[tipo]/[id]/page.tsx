"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuUserRound, LuIdCard, LuMail, LuPhone, LuStar } from "react-icons/lu";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { AddressFields } from "@/features/auth/components/AddressFields";
import { registrar } from "@/features/auth/authApi";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { get, patch, del } from "@/lib/api";
import type { Candidato, Empresa } from "@/types/usuario";

export default function CadastroPage() {
  const { tipo, id } = useParams<{ tipo: string; id: string }>();
  const router = useRouter();
  const [registro, setCadastro] = useState<Candidato | Empresa | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    if (tipo !== "candidato" && tipo !== "empresa") throw new Error("Tipo de cadastro inválido.");
    setCadastro(await registrar(tipo, form, Number(id)));
    setSalvo(true);
  });
  const { erro: erroNota, enviando: avaliando, onSubmit: enviarNota } = useFormSubmit(async (form) => {
    setCadastro(await patch<Empresa>(`/api/empresa/${id}/nota`, { nota: Number(form.get("nota")) }));
    setSalvo(true);
  });
  useEffect(() => {
    if (tipo !== "candidato" && tipo !== "empresa") return;
    let ativo = true;
    get<Candidato | Empresa>(`/api/${tipo}/${id}`).then((dados) => { if (ativo) setCadastro(dados); }).catch((error) => { if (ativo) setFalha(error.message); });
    return () => { ativo = false; };
  }, [tipo, id]);
  const cadastro = registro?.id === Number(id) && (tipo === "candidato" ? "cpf" in registro : tipo === "empresa" && "cnpj" in registro) ? registro : null;

  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title={cadastro?.nome ?? "Cadastro"} description="Consulte e atualize os dados registrados." />
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6">
        <FormErrorAlert message={erro ?? erroNota ?? falha ?? (tipo !== "candidato" && tipo !== "empresa" ? "Tipo de cadastro inválido." : null)} />
        {!cadastro && !falha && (tipo === "candidato" || tipo === "empresa") && <p role="status">Carregando cadastro...</p>}
        {cadastro && <>
          <Card className="p-6"><form key={`${tipo}-${cadastro.id}`} onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <IconInputField id="nome" label={tipo === "empresa" ? "Razão social" : "Nome"} icon={LuUserRound} required minLength={2} maxLength={100} defaultValue={cadastro.nome} />
            {"sobrenome" in cadastro && <IconInputField id="sobrenome" label="Sobrenome" icon={LuUserRound} required minLength={2} maxLength={100} defaultValue={cadastro.sobrenome} />}
            {"cpf" in cadastro ? <IconInputField id="cpf" label="CPF" icon={LuIdCard} required maxLength={14} defaultValue={cadastro.cpf} /> : <IconInputField id="cnpj" label="CNPJ" icon={LuIdCard} required maxLength={18} defaultValue={cadastro.cnpj} />}
            <IconInputField id="email" label="E-mail" icon={LuMail} type="email" required maxLength={100} defaultValue={cadastro.contato.email} />
            <IconInputField id="telefone" label="Telefone" icon={LuPhone} required maxLength={15} defaultValue={cadastro.contato.telefone} />
            <AddressFields bairroLabel="Bairro" bairroDescription="Endereço do cadastro." endereco={cadastro.endereco} />
            <SubmitButton pending={enviando} pendingLabel="Salvando...">Salvar cadastro</SubmitButton>
            {salvo && <p role="status" className="self-center text-sm text-primary">Dados salvos na API.</p>}
          </form></Card>
          {"nota" in cadastro && <Card className="p-6"><form onSubmit={enviarNota} className="flex flex-wrap items-end gap-4"><IconInputField id="nota" label="Nota da empresa (0 a 5)" icon={LuStar} type="number" min={0} max={5} step="0.01" required defaultValue={cadastro.nota ?? ""} /><SubmitButton pending={avaliando} pendingLabel="Salvando...">Salvar nota</SubmitButton></form></Card>}
          <div className="flex flex-wrap gap-4 text-primary underline">{tipo === "candidato" ? <><Link href={`/curriculo?candidato=${id}`}>Editar currículo</Link><Link href={`/candidaturas?candidato=${id}`}>Ver candidaturas</Link></> : <Link href={`/painel/vagas?empresa=${id}`}>Gerenciar vagas</Link>}</div>
          <details className="rounded-xl border p-4"><summary className="cursor-pointer text-destructive">Excluir cadastro</summary><p className="my-3 text-sm">O cadastro e seus registros relacionados serão removidos.</p><Button variant="destructive" disabled={excluindo} onClick={async () => {
            setExcluindo(true);
            try { await del(`/api/${tipo}/${id}`); router.replace("/cadastros"); }
            catch (error) { setFalha(error instanceof Error ? error.message : "Não foi possível excluir."); setExcluindo(false); }
          }}>Confirmar exclusão</Button></details>
        </>}
      </div>
    </main>
  );
}
