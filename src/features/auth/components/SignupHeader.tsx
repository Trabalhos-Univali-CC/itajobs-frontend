import Link from "next/link";

import { AnimatedWaves } from "@/components/brand/AnimatedWaves";
import { ItajobsEmblem, ItajobsWordmark } from "@/components/brand/ItajobsLogo";

export function SignupHeader() {
  return (
    <header className="relative overflow-hidden bg-primary pb-28 text-primary-foreground">
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/login" aria-label="ItaJobs" className="flex items-center gap-3">
            <ItajobsEmblem priority className="w-12" />
            <ItajobsWordmark className="text-xl text-white" />
          </Link>
          <p className="text-sm text-white/80">
            <span className="hidden sm:inline">Já tenho conta</span>
            <Link href="/login" className="ml-2 font-semibold text-secondary underline-offset-4 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
        <h1 className="mt-10 text-3xl font-bold tracking-tight sm:text-4xl">Criar conta no ItaJobs</h1>
        <p className="mt-2 text-white/75">Leva poucos minutos. Comece escolhendo o tipo de conta.</p>
      </div>
      <AnimatedWaves className="absolute inset-x-0 bottom-0" />
    </header>
  );
}
