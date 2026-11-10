"use client";

import { LuHash, LuHouse, LuMapPin, LuSignpost } from "react-icons/lu";

import { IconInputField } from "@/components/form/IconInputField";
import { Field, FieldDescription, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bairros } from "@/features/auth/bairros";
import type { Endereco } from "@/types/usuario";

const items = [{ label: "Selecione o bairro", value: null }, ...bairros.map((bairro) => ({ label: bairro, value: bairro }))];

type AddressFieldsProps = {
  bairroLabel: string;
  bairroDescription: string;
  endereco?: Endereco;
};

export function AddressFields({ bairroLabel, bairroDescription, endereco }: AddressFieldsProps) {
  return (
    <>
      <input type="hidden" name="cidade" value={endereco?.cidade ?? "Itajaí"} />
      <FieldSeparator className="my-1 sm:col-span-2 *:data-[slot=field-separator-content]:bg-card">Endereço em Itajaí</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="bairro">{bairroLabel}</FieldLabel>
        <Select items={items} name="bairro" defaultValue={endereco?.bairro ?? null}>
          <SelectTrigger id="bairro" className="w-full">
            <LuMapPin />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {bairros.map((bairro) => (
              <SelectItem key={bairro} value={bairro}>
                {bairro}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription className="text-xs">{bairroDescription}</FieldDescription>
      </Field>
      <IconInputField id="rua" defaultValue={endereco?.rua} label="Rua" icon={LuSignpost} autoComplete="address-line1" placeholder="Ex.: Rua Hercílio Luz" required maxLength={100} />
      <IconInputField id="numero" defaultValue={endereco?.numero} label="Número" icon={LuHash} placeholder="Ex.: 250" required maxLength={6} />
      <IconInputField id="complemento" defaultValue={endereco?.complemento ?? ""} label="Complemento" icon={LuHouse} autoComplete="address-line2" placeholder="Opcional" maxLength={100} />
    </>
  );
}
