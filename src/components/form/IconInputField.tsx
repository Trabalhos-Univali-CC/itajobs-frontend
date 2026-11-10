import type { ComponentProps, ReactNode } from "react";
import type { IconType } from "react-icons";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/utils/utils";

type IconInputFieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  icon: IconType;
  description?: string;
  addonEnd?: ReactNode;
};

export function IconInputField({ id, label, icon: Icon, description, addonEnd, className, ...props }: IconInputFieldProps) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className={cn("h-10", props.readOnly && "bg-muted/60 hover:border-input")}>
        <InputGroupAddon>
          <Icon />
        </InputGroupAddon>
        <InputGroupInput id={id} name={id} {...props} />
        {addonEnd && <InputGroupAddon align="inline-end">{addonEnd}</InputGroupAddon>}
      </InputGroup>
      {description && <FieldDescription className="text-xs">{description}</FieldDescription>}
    </Field>
  );
}
