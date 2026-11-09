"use client";

import { useRouter } from "next/navigation";
import { LuBriefcaseBusiness, LuBuilding2, LuBanknote } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { post, put } from "@/lib/api";
import type { Vaga, VagaCreate } from "@/types/vaga";

type VagaFormProps = { vaga?: Vaga; idEmpresa?: number; onSave?: (vaga: Vaga) => void };

export function VagaForm({ vaga, idEmpresa, onSave }: VagaFormProps) {
  const router = useRouter();
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    const dados: VagaCreate = {
      idEmpresa: vaga?.idEmpresa ?? Number(form.get("idEmpresa")),
      cargo: String(form.get("cargo")).trim(),
      descricao: String(form.get("descricao")).trim(),
      salario: form.get("salario") ? Number(form.get("salario")) : null,
    };
    const salva = vaga ? await put<Vaga>(`/api/vaga/${vaga.id}`, dados) : await post<Vaga>("/api/vaga", dados);
    onSave?.(salva);
    if (!vaga) router.push(`/painel/vagas/${salva.id}`);
  });

  return (
    <Card className="p-6">
      <form key={vaga?.id ?? "nova"} onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <IconInputField id="idEmpresa" label="ID da empresa" icon={LuBuilding2} type="number" min={1} required defaultValue={vaga?.idEmpresa ?? idEmpresa} readOnly={!!vaga} />
        <IconInputField id="cargo" label="Cargo" icon={LuBriefcaseBusiness} minLength={2} maxLength={45} required defaultValue={vaga?.cargo} />
        <IconInputField id="salario" label="Salário (opcional)" icon={LuBanknote} type="number" min={0.01} step="0.01" defaultValue={vaga?.salario ?? ""} />
        <Field className="sm:col-span-2"><FieldLabel htmlFor="descricao">Descrição</FieldLabel><Textarea id="descricao" name="descricao" required rows={6} defaultValue={vaga?.descricao} /></Field>
        <div className="sm:col-span-2"><FormErrorAlert message={erro} /></div>
        <SubmitButton pending={enviando} pendingLabel="Salvando...">{vaga ? "Salvar alterações" : "Publicar vaga"}</SubmitButton>
      </form>
    </Card>
  );
}
