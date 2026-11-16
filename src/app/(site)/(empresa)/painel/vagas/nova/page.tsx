import { PageHero } from "@/components/layout/PageHero";
import { VagaForm } from "@/features/vagas/components/VagaForm";

export default function NovaVagaPage() {
  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title="Publicar vaga" description="Apresente sua oportunidade e confira a prévia antes de publicar." className="max-w-6xl" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6"><VagaForm /></div>
    </main>
  );
}
