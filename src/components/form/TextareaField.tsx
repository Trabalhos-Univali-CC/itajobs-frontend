import type { ComponentProps } from "react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/utils";

type TextareaFieldProps = Omit<ComponentProps<"textarea">, "value" | "onChange" | "maxLength"> & {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  idealLength?: number;
  description?: string;
};

export function TextareaField({ id, label, value, onChange, maxLength, idealLength, description, className, ...props }: TextareaFieldProps) {
  const atingiuIdeal = idealLength !== undefined && value.trim().length >= idealLength;

  return (
    <Field className={className}>
      <div className="flex items-end justify-between gap-3">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <span className={cn("text-xs text-muted-foreground tabular-nums transition-colors", atingiuIdeal && "font-medium text-primary")}>
          {value.length}/{maxLength}
        </span>
      </div>
      <Textarea
        id={id}
        name={id}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 resize-y px-3 py-2.5 leading-relaxed transition-[border-color,box-shadow] duration-200 hover:border-ring/40 focus-visible:ring-ring/20"
        {...props}
      />
      {description && <FieldDescription className="text-xs">{description}</FieldDescription>}
    </Field>
  );
}
