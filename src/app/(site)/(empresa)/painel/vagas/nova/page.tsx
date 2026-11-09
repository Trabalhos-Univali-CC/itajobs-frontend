import { PageHero } from "@/components/layout/PageHero";
import { VagaForm } from "@/features/vagas/components/VagaForm";

export default async function NovaVagaPage({ searchParams }: { searchParams: Promise<{ empresa?: string }> }) {
  const consulta = await searchParams;
  const idEmpresa = Number(consulta.empresa) > 0 ? Number(consulta.empresa) : undefined;
  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title="Publicar vaga" description="Cadastre uma oportunidade vinculada a uma empresa existente." />
      <div className="mx-auto max-w-4xl px-6"><VagaForm idEmpresa={idEmpresa} /></div>
    </main>
  );
}
