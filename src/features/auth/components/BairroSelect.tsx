"use client";

import { LuMapPin } from "react-icons/lu";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bairros } from "@/features/auth/Bairros";

const items = [{ label: "Selecione o bairro", value: null }, ...bairros.map((bairro) => ({ label: bairro, value: bairro }))];

export function BairroSelect({ id }: { id: string }) {
  return (
    <Select items={items}>
      <SelectTrigger id={id} className="w-full data-[size=default]:h-10">
        <LuMapPin className="text-muted-foreground" />
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
  );
}
