"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const itensMes = [
  { label: "Mês", value: null },
  ...meses.map((mes, index) => ({ label: mes, value: String(index + 1).padStart(2, "0") })),
];

type MonthYearFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  futureYears?: number;
  disabled?: boolean;
  className?: string;
};

export function MonthYearField({ id, label, value, onChange, futureYears = 0, disabled, className }: MonthYearFieldProps) {
  const [ano = "", mes = ""] = value.split("-");
  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 61 + futureYears }, (_, index) => String(anoAtual + futureYears - index));
  const itensAno = [{ label: "Ano", value: null }, ...anos.map((item) => ({ label: item, value: item }))];

  return (
    <Field className={className} data-disabled={disabled}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
        <Select items={itensMes} value={mes || null} onValueChange={(novo) => onChange(`${ano}-${novo ?? ""}`)} disabled={disabled}>
          <SelectTrigger id={id} aria-label={`${label}: mês`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {itensMes.slice(1).map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select items={itensAno} value={ano || null} onValueChange={(novo) => onChange(`${novo ?? ""}-${mes}`)} disabled={disabled}>
          <SelectTrigger aria-label={`${label}: ano`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {anos.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Field>
  );
}
