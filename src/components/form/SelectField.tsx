"use client";

import type { IconType } from "react-icons";

import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  icon?: IconType;
  disabled?: boolean;
  className?: string;
};

export function SelectField({ id, label, value, onChange, options, placeholder, icon: Icon, disabled, className }: SelectFieldProps) {
  const opcoes = value && !options.includes(value) ? [value, ...options] : options;
  const items = [{ label: placeholder, value: null }, ...opcoes.map((opcao) => ({ label: opcao, value: opcao }))];

  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select items={items} value={value || null} onValueChange={(novo) => onChange(novo ?? "")} disabled={disabled}>
        <SelectTrigger id={id} className="w-full">
          {Icon && <Icon />}
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {opcoes.map((opcao) => (
            <SelectItem key={opcao} value={opcao}>
              {opcao}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
