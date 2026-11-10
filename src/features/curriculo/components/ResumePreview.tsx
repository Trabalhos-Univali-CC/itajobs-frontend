import type { Curriculo } from "@/types/curriculo";
import type { Candidato } from "@/types/usuario";
import { formatarTelefone } from "@/utils/utils";

export function ResumePreview({ candidato, curriculo }: { candidato: Candidato; curriculo: Curriculo }) {
  return (
    <article aria-label="Pré-visualização do currículo" className="rounded-xl border bg-white p-6 text-sm leading-relaxed shadow-lg shadow-primary/5">
      <header className="border-b-2 border-primary pb-4">
        <h3 className="text-lg font-bold text-primary">{curriculo.nomeCandidato}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{candidato.endereco.bairro} ? {candidato.endereco.cidade}</p>
        <p className="text-xs text-muted-foreground">{formatarTelefone(candidato.contato.telefone)} ? {candidato.contato.email}</p>
      </header>
      <section className="mt-4"><h4 className="mb-2 border-b pb-1 font-semibold text-primary">Competências</h4>
        {curriculo.habilidades.length ? <p>{curriculo.habilidades.map((habilidade) => habilidade.descricao).join(" ? ")}</p> : <p className="text-muted-foreground">Nenhuma competência cadastrada.</p>}
      </section>
      <section className="mt-4"><h4 className="mb-2 border-b pb-1 font-semibold text-primary">Experiências</h4>
        {curriculo.experiencias.map((experiencia) => <div key={experiencia.id} className="mb-3"><p className="font-medium">{experiencia.cargo}</p><p>{experiencia.nomeEmpresa}</p><p className="text-xs text-muted-foreground">{experiencia.dataInicio} ? {experiencia.dataFim ?? "Atual"}</p></div>)}
        {curriculo.experiencias.length === 0 && <p className="text-muted-foreground">Nenhuma experiência cadastrada.</p>}
      </section>
    </article>
  );
}
