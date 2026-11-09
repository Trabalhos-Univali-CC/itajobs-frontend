import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { ResumeLoader } from "@/features/curriculo/components/ResumeLoader";

export const metadata: Metadata = {
  title: "Meu currículo | ItaJobs",
};

export default async function CurriculoPage({ searchParams }: { searchParams: Promise<{ candidato?: string }> }) {
  const consulta = await searchParams;
  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero
        title="Meu currículo"
        description="Cadastre suas competências e experiências para se candidatar às vagas."
        className="max-w-6xl"
      />
      <ResumeLoader key={consulta.candidato ?? "consulta"} idCandidato={Number(consulta.candidato) || undefined} />
    </main>
  );
}
