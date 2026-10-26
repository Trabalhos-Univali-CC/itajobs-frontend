"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuCheck } from "react-icons/lu";

import { accountTypes, type AccountType } from "@/features/auth/AccountTypes";
import { cn } from "@/lib/Utils";

const descriptions: Record<AccountType, string> = {
  empregado: "Monte seu currículo, receba vagas do seu bairro e acompanhe suas candidaturas.",
  contratante: "Publique vagas, veja os candidatos inscritos e organize seus processos seletivos.",
};

export function AccountTypeCards() {
  const pathname = usePathname();

  return (
    <nav aria-label="Tipo de conta" className="grid gap-4 md:grid-cols-2">
      {accountTypes.map(({ id, label, icon: Icon, signup }) => {
        const selected = pathname === signup;

        return (
          <Link
            key={id}
            href={signup}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "group flex items-start gap-4 rounded-2xl border bg-card p-5 text-card-foreground transition-all duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              selected
                ? "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary"
                : "border-border shadow-sm hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
            )}
          >
            <span
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                selected ? "bg-primary text-secondary" : "bg-muted text-muted-foreground group-hover:text-primary",
              )}
            >
              <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" />
            </span>
            <span className="flex-1">
              <span className="block text-lg font-semibold">Sou {label.toLowerCase()}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{descriptions[id]}</span>
            </span>
            <span
              aria-hidden
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                selected ? "border-primary bg-primary text-secondary" : "border-input",
              )}
            >
              {selected && <LuCheck className="size-3.5 animate-in duration-300 zoom-in-50 motion-reduce:animate-none" />}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
