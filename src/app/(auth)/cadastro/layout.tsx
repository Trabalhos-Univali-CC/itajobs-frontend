"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuCheck } from "react-icons/lu";

import { ItajobsLogo } from "@/components/brand/ItajobsLogo";
import { PageHero } from "@/components/layout/PageHero";
import { accountTypes, type AccountType } from "@/features/auth/accountTypes";
import { SignupFormCard } from "@/features/auth/components/SignupFormCard";
import { cn } from "@/utils/utils";

const descriptions: Record<AccountType, string> = {
  empregado: "Monte seu currículo, receba vagas do seu bairro e acompanhe suas candidaturas.",
  contratante: "Publique vagas, veja os candidatos inscritos e organize seus processos seletivos.",
};

export default function CadastroLayout({ children }: LayoutProps<"/cadastro">) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen flex-1 bg-background pb-16">
      <PageHero
        title="Cadastrar no ItaJobs"
        description="Leva poucos minutos. Comece escolhendo o tipo de cadastro."
        topo={
          <div className="flex items-center justify-between gap-4">
            <Link href="/login" aria-label="ItaJobs" className="flex items-center gap-3">
              <ItajobsLogo priority className="w-12" />
              <ItajobsLogo variant="wordmark" className="text-xl text-white" />
            </Link>
            <p className="text-sm text-white/80">
              <span className="hidden sm:inline">Já tenho cadastro?</span>
              <Link href="/login" className="ml-2 font-semibold text-secondary underline-offset-4 hover:underline">
                Consultar
              </Link>
            </p>
          </div>
        }
      />
      <div className="relative z-10 mx-auto mt-4 flex max-w-5xl flex-col gap-6 px-6">
        <ol aria-label="Etapas do cadastro" className="flex items-center gap-2 text-sm font-medium sm:gap-3">
          <li className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-secondary">
              <LuCheck className="size-4" />
            </span>
            <span className="hidden text-muted-foreground sm:inline">Tipo de conta</span>
          </li>
          <li aria-hidden className="h-0.5 w-6 rounded-full bg-primary sm:w-10" />
          <li aria-current="step" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-4 ring-primary/15">
              2
            </span>
            <span className="hidden text-card-foreground sm:inline">Seus dados</span>
          </li>
          <li aria-hidden className="h-0.5 w-6 rounded-full bg-border sm:w-10" />
          <li className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full border border-input text-xs font-semibold text-muted-foreground">
              3
            </span>
            <span className="hidden text-muted-foreground sm:inline">Confirmação</span>
          </li>
        </ol>
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
        <SignupFormCard>{children}</SignupFormCard>
      </div>
    </main>
  );
}
