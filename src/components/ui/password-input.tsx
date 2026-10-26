"use client"

import * as React from "react"
import { LuEye, LuEyeOff, LuLock } from "react-icons/lu"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/Utils"

function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = React.useState(false)
  const Icon = visible ? LuEyeOff : LuEye

  return (
    <InputGroup data-slot="password-input" className={cn("h-10", className)}>
      <InputGroupAddon>
        <LuLock />
      </InputGroupAddon>
      <InputGroupInput type={visible ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          <Icon
            key={visible ? "ocultar" : "mostrar"}
            className="animate-in duration-200 zoom-in-50 motion-reduce:animate-none"
          />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { PasswordInput }
