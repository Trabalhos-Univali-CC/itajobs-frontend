import type { ComponentProps } from "react";
import type { IconType } from "react-icons";

import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

type IconInputFieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  icon: IconType;
};

export function IconInputField({ id, label, icon: Icon, className, ...props }: IconInputFieldProps) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className="h-10">
        <InputGroupAddon>
          <Icon />
        </InputGroupAddon>
        <InputGroupInput id={id} {...props} />
      </InputGroup>
    </Field>
  );
}
