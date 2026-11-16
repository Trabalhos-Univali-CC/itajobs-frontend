import type { ReactNode } from "react";
import { LuBanknote, LuBriefcaseBusiness, LuBuilding2, LuCheck, LuClock3, LuMapPin } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import type { Vaga } from "@/types/vaga";
import { separarTopicos } from "@/utils/utils";
import { contratos, jornadas, moeda } from "../opcoes";

type VagaPreviewProps = {
  vaga: Partial<Pick<Vaga, "cargo" | "nomeEmpresa" | "descricao" | "salario" | "bairro" | "requisitos" | "tipoContrato" | "jornada">>;
  children?: ReactNode;
};

export function VagaPreview({ vaga, children }: VagaPreviewProps) {
  const requisitos = separarTopicos(vaga.requisitos ?? "");

  return (
    <Card className="gap-0 overflow-hidden p-0 shadow-sm ring-primary/10">
      <div className="space-y-4 border-b border-primary/10 bg-primary/[0.025] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-primary/70"><LuBuilding2 aria-hidden className="size-4 shrink-0" /><span className="min-w-0 break-words">{vaga.nomeEmpresa}</span></div>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-4">
            <h2 className="text-xl leading-tight font-bold break-words text-primary sm:text-2xl">{vaga.cargo?.trim() || "Nome do cargo"}</h2>
            <p className="flex items-start gap-2 text-sm text-muted-foreground"><LuMapPin aria-hidden className="mt-0.5 size-4 shrink-0" /><span className="min-w-0 break-words">{vaga.bairro ? `${vaga.bairro}, Itajaí · SC` : "Itajaí · SC"}</span></p>
          </div>
          <div role="img" aria-label="Logo da empresa: em breve" data-disabled="" className="flex size-20 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-primary/10 bg-card text-primary/40">
            <LuBuilding2 aria-hidden className="size-7" />
            <span className="text-[10px] font-medium text-muted-foreground">Em breve</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/10 bg-card px-2.5 py-1.5 text-xs font-medium text-primary/80"><LuBriefcaseBusiness aria-hidden className="size-3.5" />{contratos.find(({ value }) => value === vaga.tipoContrato)?.label ?? "Contrato a definir"}</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/10 bg-card px-2.5 py-1.5 text-xs font-medium text-primary/80"><LuClock3 aria-hidden className="size-3.5" />{jornadas.find(({ value }) => value === vaga.jornada)?.label ?? "Jornada a definir"}</span>
        </div>
      </div>
      <div className="space-y-6 p-5 sm:p-6">
        <div className="flex items-center gap-3 rounded-xl bg-accent/60 p-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary"><LuBanknote aria-hidden className="size-4" /></span>
          <div className="min-w-0"><p className="text-xs text-muted-foreground">Remuneração</p><p className="mt-0.5 font-semibold break-words text-primary">{vaga.salario === undefined ? "Defina o salário" : vaga.salario === null ? "Salário a combinar" : moeda.format(vaga.salario)}</p></div>
        </div>
        <section className="space-y-2"><h3 className="font-semibold text-foreground">Sobre a vaga</h3><p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-muted-foreground">{vaga.descricao?.trim() || "Preencha a descrição para visualizar aqui."}</p></section>
        <section className="space-y-2.5"><h3 className="font-semibold text-foreground">Requisitos</h3>{requisitos.length > 0 ? <ul className="space-y-2">{requisitos.map((requisito, index) => <li key={`${index}-${requisito}`} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"><LuCheck aria-hidden className="mt-1 size-3.5 shrink-0 text-primary/70" /><span className="min-w-0 break-words">{requisito}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">Nenhum requisito informado.</p>}</section>
      </div>
      {children && <div className="border-t border-primary/10 p-5 sm:p-6">{children}</div>}
    </Card>
  );
}
