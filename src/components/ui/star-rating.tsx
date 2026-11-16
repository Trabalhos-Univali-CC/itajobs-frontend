"use client";

import { useState } from "react";
import { LuStar } from "react-icons/lu";
import { cn } from "@/utils/utils";

type StarRatingProps = {
  value: number;
  onValueChange?: (value: number) => void;
  name?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export function StarRating({ value, onValueChange, name = "nota", label = "Avaliação", disabled, required, className }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const editavel = !!onValueChange;
  const estrelas = [1, 2, 3, 4, 5].map((estrela) => {
    const preenchimento = Math.max(0, Math.min(1, (editavel ? hover ?? value : value) - estrela + 1));
    const icone = <span aria-hidden className={cn("relative inline-flex shrink-0", editavel ? "size-6" : "size-4")}>
      <LuStar className="size-full fill-muted/40 text-input" />
      <LuStar className="absolute inset-0 size-full fill-secondary text-yellow-500" style={{ clipPath: `inset(0 ${(1 - preenchimento) * 100}% 0 0)` }} />
    </span>;

    return editavel ? <label key={estrela} className="flex size-11 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-secondary/10 focus-within:ring-2 focus-within:ring-primary/25 has-disabled:cursor-not-allowed has-disabled:opacity-60" onMouseEnter={() => !disabled && setHover(estrela)}>
      <input type="radio" name={name} value={estrela} checked={value === estrela} onChange={() => onValueChange?.(estrela)} onFocus={() => setHover(estrela)} onBlur={() => setHover(null)} aria-label={`${estrela} ${estrela === 1 ? "estrela" : "estrelas"}`} required={required} className="sr-only" />
      {icone}
    </label> : <span key={estrela} className="inline-flex">{icone}</span>;
  });

  return editavel ? <fieldset disabled={disabled} className={className} onMouseLeave={() => setHover(null)}>
    <legend className="sr-only">{label}</legend>
    <div className="flex items-center gap-1">{estrelas}</div>
  </fieldset> : <span role="img" aria-label={value > 0 ? `${label}: ${value.toLocaleString("pt-BR")} de 5 estrelas` : `${label}: sem avaliações`} className={cn("inline-flex items-center gap-1", className)}>{estrelas}</span>;
}
