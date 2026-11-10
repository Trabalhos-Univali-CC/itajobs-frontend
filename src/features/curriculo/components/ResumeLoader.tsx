"use client";

import { useEffect, useState } from "react";
import { LuUserRound, LuFileText } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { IconInputField } from "@/components/form/IconInputField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { buscarCurriculo } from "@/features/curriculo/curriculoApi";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { get } from "@/lib/api";
import type { Curriculo } from "@/types/curriculo";
import type { Candidato } from "@/types/usuario";
import { ResumeEditor } from "./ResumeEditor";

type Dados = { candidato: Candidato; curriculo: Curriculo | null };

export function ResumeLoader({ idCandidato }: { idCandidato?: number }) {
  const [dados, setDados] = useState<Dados | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const carregando = !!idCandidato && !dados && !falha;
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    if (form.get("idCurriculo")) {
      const curriculo = await get<Curriculo>(`/api/curriculo/${Number(form.get("idCurriculo"))}`);
      const candidato = await get<Candidato>(`/api/candidato/${curriculo.idCandidato}`);
      setDados({ candidato, curriculo });
    } else {
      const id = Number(form.get("idCandidato"));
      if (!id || id < 1) throw new Error("Informe o ID do candidato ou do currículo.");
      const [candidato, curriculo] = await Promise.all([get<Candidato>(`/api/candidato/${id}`), buscarCurriculo(id)]);
      setDados({ candidato, curriculo });
    }
    setFalha(null);
  });
  useEffect(() => {
    const id = idCandidato;
    if (!id || id < 1) return;
    let ativo = true;
    Promise.all([get<Candidato>(`/api/candidato/${id}`), buscarCurriculo(id)])
      .then(([candidato, curriculo]) => { if (ativo) setDados({ candidato, curriculo }); })
      .catch((error) => { if (ativo) setFalha(error.message); });
    return () => { ativo = false; };
  }, [idCandidato]);
  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-6xl px-6"><Card className="p-5"><form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4">
        <IconInputField id="idCandidato" label="ID do candidato" icon={LuUserRound} type="number" min={1} />
        <IconInputField id="idCurriculo" label="Ou ID do currículo" icon={LuFileText} type="number" min={1} />
        <SubmitButton pending={enviando} pendingLabel="Consultando...">Consultar</SubmitButton>
      </form></Card><div className="mt-4"><FormErrorAlert message={erro ?? falha} />{carregando && <p role="status">Carregando currículo...</p>}</div></div>
      {dados && <ResumeEditor key={`${dados.candidato.id}-${dados.curriculo?.id ?? "novo"}`} candidato={dados.candidato} curriculo={dados.curriculo} />}
    </div>
  );
}
