import type { ComponentProps } from "react";
import type { IconType } from "react-icons";
import { LuArrowRight, LuLoaderCircle } from "react-icons/lu";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, "type"> & {
  pending: boolean;
  pendingLabel: string;
  icon?: IconType;
};

export function SubmitButton({ pending, pendingLabel, icon: Icon = LuArrowRight, children, disabled, ...props }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={pending || disabled} aria-busy={pending} {...props}>
      {pending ? pendingLabel : children}
      {pending ? (
        <LuLoaderCircle className="animate-spin" />
      ) : (
        <Icon className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
      )}
    </Button>
  );
}
