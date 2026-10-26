import { LuCheck } from "react-icons/lu";

import { cn } from "@/lib/Utils";

const steps = ["Tipo de conta", "Seus dados", "Confirmação"];
const currentStep = 1;

export function SignupSteps({ className }: { className?: string }) {
  return (
    <ol aria-label="Etapas do cadastro" className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}>
      {steps.map((label, index) => {
        const done = index < currentStep;
        const active = index === currentStep;

        return (
          <li key={label} aria-current={active ? "step" : undefined} className="flex items-center gap-2 sm:gap-3">
            {index > 0 && (
              <span aria-hidden className={cn("h-0.5 w-6 rounded-full sm:w-10", done || active ? "bg-primary" : "bg-border")} />
            )}
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                done && "bg-primary text-secondary",
                active && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                !done && !active && "border border-input text-muted-foreground",
              )}
            >
              {done ? <LuCheck className="size-4" /> : index + 1}
            </span>
            <span
              className={cn(
                "hidden text-sm font-medium sm:inline",
                active ? "text-card-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
