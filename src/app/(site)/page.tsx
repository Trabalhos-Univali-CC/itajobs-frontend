"use client";

import { CardSkeleton } from "@/components/ui/card-skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Slider } from "@base-ui/react/slider";
import { LuSearch, LuMapPin, LuSlidersHorizontal, LuTags, LuX } from "react-icons/lu";
import { PageHero } from "@/components/layout/PageHero";
import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bairros } from "@/features/auth/bairros";
import { get } from "@/lib/api";
import type { Vaga, Pagina } from "@/types/vaga";

const filtrosIniciais = { cargo: "", bairro: "", salarioMinimo: "", salarioMaximo: "" };
const salarioLimite = 20000;
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const opcoesBairro = [{ value: null, label: "Todos os bairros" }, ...bairros.map((bairro) => ({ value: bairro, label: bairro }))];
const contratos = [
  { value: "clt", label: "CLT" },
  { value: "pj", label: "PJ" },
  { value: "estagio", label: "Estágio" },
  { value: "temporario", label: "Temporário" },
  { value: "aprendiz", label: "Aprendiz" },
  { value: "diaria", label: "Diária" },
] as const;

export default function Home() {
  const router = useRouter();
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [resultado, setResultado] = useState<Pagina<Vaga> | null>(null);
  const [consultaAtual, setConsultaAtual] = useState<{ filtros: string | null; pagina: number }>({ filtros: null, pagina: 1 });
  const pagina = consultaAtual.pagina;
  const vagas = resultado?.itens ?? [];
  const [carregando, setCarregando] = useState(true);
  const [falha, setFalha] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    const consulta = new URLSearchParams(consultaAtual.filtros ?? "");
    const empresa = new URLSearchParams(window.location.search).get("empresa");
    if (consultaAtual.filtros === null && empresa) consulta.set("idEmpresa", empresa);
    consulta.set("pagina", String(consultaAtual.pagina));
    get<Pagina<Vaga>>(`/api/vaga?${consulta}`)
      .then((dados) => { if (ativo) { setResultado(dados); setFalha(null); } })
      .catch((error) => { if (ativo) setFalha(error.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [consultaAtual]);

  return (
    <main className="flex-1 bg-background pb-16">
      <PageHero title="Vagas em Itajaí" description="Consulte as oportunidades publicadas pelas empresas." />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
        <Card className="gap-0 rounded-2xl border border-primary/10 p-5 shadow-sm ring-0 sm:p-6">
          <form id="busca-vagas" onSubmit={(event) => {
            event.preventDefault();
            const consulta = new URLSearchParams();
            const empresa = consultaAtual.filtros === null ? new URLSearchParams(window.location.search).get("empresa") : new URLSearchParams(consultaAtual.filtros).get("idEmpresa");
            if (empresa) consulta.set("idEmpresa", empresa);
            if (filtros.cargo.trim()) consulta.set("cargo", filtros.cargo.trim());
            if (filtros.bairro) consulta.set("bairro", filtros.bairro);
            if (filtros.salarioMinimo) consulta.set("salarioMinimo", filtros.salarioMinimo);
            if (filtros.salarioMaximo) consulta.set("salarioMaximo", filtros.salarioMaximo);
            setFalha(null);
            setConsultaAtual({ filtros: consulta.toString(), pagina: 1 });
            setCarregando(true);
          }} className="flex flex-col gap-5">
            <div className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_14rem] lg:grid-cols-[minmax(0,1fr)_14rem_auto]">
              <IconInputField id="cargo" label="Cargo" icon={LuSearch} placeholder="Qual vaga você procura?" maxLength={45} value={filtros.cargo} onChange={(event) => setFiltros({ ...filtros, cargo: event.target.value })} />
              <Field className="min-w-0"><FieldLabel htmlFor="bairro">Bairro</FieldLabel><Select items={opcoesBairro} value={filtros.bairro || null} onValueChange={(bairro) => setFiltros({ ...filtros, bairro: bairro ?? "" })}><SelectTrigger id="bairro" className="w-full"><LuMapPin /><SelectValue placeholder="Todos os bairros" /></SelectTrigger><SelectContent><SelectItem value={null}>Todos os bairros</SelectItem>{bairros.map((bairro) => <SelectItem key={bairro} value={bairro}>{bairro}</SelectItem>)}</SelectContent></Select></Field>
              <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1">
                <Button type="button" variant="outline" aria-label="Filtro" title="Filtro" aria-expanded={filtrosAbertos} aria-controls="filtros-vagas" onClick={() => setFiltrosAbertos((abertos) => !abertos)} className="relative gap-2 aria-expanded:border-primary/30 aria-expanded:bg-accent aria-expanded:text-primary">
                  <LuSlidersHorizontal aria-hidden className="size-4" />
                  Filtro
                  {(filtros.salarioMinimo || filtros.salarioMaximo) && <span aria-hidden className="absolute -top-1 -right-1 size-2.5 rounded-full bg-secondary ring-2 ring-card" />}
                </Button>
                <SubmitButton pending={carregando} pendingLabel="Buscando..." icon={LuSearch}>Buscar</SubmitButton>
              </div>
            </div>
            {filtrosAbertos && <section id="filtros-vagas" aria-labelledby="titulo-filtros-vagas" className="animate-in space-y-5 border-t border-primary/10 pt-5 duration-150 fade-in-0 slide-in-from-top-1 motion-reduce:animate-none">
              <h2 id="titulo-filtros-vagas" className="flex items-center gap-2 text-sm font-semibold text-primary"><LuSlidersHorizontal aria-hidden className="size-4" />Filtros de vagas</h2>
              <div className="grid min-w-0 items-start gap-6 sm:grid-cols-2">
                <Slider.Root value={[Number(filtros.salarioMinimo) || 0, filtros.salarioMaximo ? Number(filtros.salarioMaximo) : salarioLimite]} min={0} max={salarioLimite} step={100} largeStep={1000} thumbCollisionBehavior="none" thumbAlignment="edge" onValueChange={([minimo, maximo]) => setFiltros((atuais) => ({ ...atuais, salarioMinimo: minimo > 0 ? String(minimo) : "", salarioMaximo: maximo < salarioLimite ? String(maximo) : "" }))} className="min-w-0">
                  <Slider.Label className="mb-3 block text-sm font-medium">Faixa salarial</Slider.Label>
                  <div className="flex items-center justify-between gap-3 text-sm font-medium text-primary"><span>{filtros.salarioMinimo ? moeda.format(Number(filtros.salarioMinimo)) : "Sem mínimo"}</span><span>{filtros.salarioMaximo ? moeda.format(Number(filtros.salarioMaximo)) : "Sem limite"}</span></div>
                  <Slider.Control className="relative flex h-11 w-full touch-none items-center select-none">
                    <Slider.Track className="relative h-1.5 w-full rounded-full bg-primary/10">
                      <Slider.Indicator className="rounded-full bg-primary" />
                      <Slider.Thumb index={0} aria-label="Salário mínimo" getAriaValueText={(_, valor) => valor === 0 ? "Sem mínimo" : moeda.format(valor)} className="size-5 rounded-full border-2 border-primary bg-card shadow-sm outline-none transition-[background-color,box-shadow] hover:bg-accent focus-within:ring-4 focus-within:ring-primary/15" />
                      <Slider.Thumb index={1} aria-label="Salário máximo" getAriaValueText={(_, valor) => valor === salarioLimite ? "Sem limite" : moeda.format(valor)} className="size-5 rounded-full border-2 border-primary bg-card shadow-sm outline-none transition-[background-color,box-shadow] hover:bg-accent focus-within:ring-4 focus-within:ring-primary/15" />
                    </Slider.Track>
                  </Slider.Control>
                </Slider.Root>

                <fieldset disabled className="min-w-0">
                  <legend className="mb-2.5 flex items-center gap-2 text-sm font-medium text-muted-foreground">Tipo de contrato<span className="rounded-md bg-accent/70 px-2 py-0.5 text-[10px] font-medium text-primary/70">Em breve</span></legend>
                  <div className="flex flex-wrap gap-2">
                    {contratos.map((contrato) => <FieldLabel key={contrato.value} htmlFor={`contrato-${contrato.value}`} className="inline-flex min-h-10 w-auto cursor-not-allowed items-center gap-2 rounded-lg border border-dashed border-primary/15 bg-muted/30 px-3 py-2 text-sm font-normal text-muted-foreground/70"><Checkbox id={`contrato-${contrato.value}`} name="tipoContrato" value={contrato.value} disabled />{contrato.label}</FieldLabel>)}
                  </div>
                </fieldset>

                <fieldset disabled className="min-w-0 space-y-2.5">
                  <legend className="mb-2.5 flex items-center gap-2 text-sm font-medium text-muted-foreground">Palavras-chave<span className="rounded-md bg-accent/70 px-2 py-0.5 text-[10px] font-medium text-primary/70">Em breve</span></legend>
                  <Field><FieldLabel htmlFor="palavras-chave" className="sr-only">Palavras-chave</FieldLabel><InputGroup className="h-11"><InputGroupAddon><LuTags /></InputGroupAddon><InputGroupInput id="palavras-chave" placeholder="Ex.: logística, atendimento" disabled /></InputGroup></Field>
                </fieldset>

                <fieldset disabled className="min-w-0">
                  <legend className="mb-2.5 flex items-center gap-2 text-sm font-medium text-muted-foreground">Modalidade<span className="rounded-md bg-accent/70 px-2 py-0.5 text-[10px] font-medium text-primary/70">Em breve</span></legend>
                  <div className="flex flex-wrap gap-2">{["Presencial", "Híbrido", "Remoto"].map((modalidade) => <button key={modalidade} type="button" disabled className="inline-flex min-h-10 items-center justify-center rounded-lg border border-dashed border-primary/15 bg-muted/30 px-3 py-2 text-sm text-muted-foreground/70 disabled:cursor-not-allowed">{modalidade}</button>)}</div>
                </fieldset>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-primary/10 pt-4 sm:flex sm:justify-end">
                <Button type="button" variant="outline" className="w-full gap-2 sm:w-auto" onClick={() => {
                  setFiltros(filtrosIniciais);
                  setFalha(null);
                  setCarregando(true);
                  setConsultaAtual({ filtros: "", pagina: 1 });
                  router.replace("/", { scroll: false });
                }}><LuX aria-hidden className="size-4" />Limpar filtros</Button>
                <SubmitButton form="busca-vagas" pending={carregando} pendingLabel="Aplicando..." icon={LuSearch} className="w-full sm:w-auto">Aplicar</SubmitButton>
              </div>
            </section>}
          </form>
        </Card>
        <FormErrorAlert message={falha} />
        {carregando ? <CardSkeleton label="Carregando vagas..." count={4} className="md:grid-cols-2" /> : falha ? null : vagas.length === 0 ? <div className="rounded-2xl border border-dashed border-primary/15 bg-muted/20 px-5 py-8 text-center"><LuSearch aria-hidden className="mx-auto size-7 text-primary/40" /><p className="mt-3 font-medium">Nenhuma vaga encontrada.</p><p className="mt-0.5 text-sm text-muted-foreground">Tente outro cargo, bairro ou faixa salarial.</p></div> : (
          <div className="grid gap-4 md:grid-cols-2">
            {vagas.map((vaga) => (
              <Card key={vaga.id} className="gap-3 p-6">
                <Link href={`/vagas/${vaga.id}`} className="text-lg font-semibold text-primary hover:underline">{vaga.cargo}</Link>
                <Link href={`/cadastros/empresa/${vaga.idEmpresa}`} className="text-sm text-muted-foreground hover:underline">{vaga.nomeEmpresa}</Link>
                <p className="line-clamp-3 whitespace-pre-line text-sm">{vaga.descricao}</p>
                <p className="text-sm font-medium">{vaga.salario === null ? "Salário a combinar" : vaga.salario.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
              </Card>
            ))}
          </div>
        )}
        {!falha && resultado && resultado.totalPaginas > 1 && <div className="flex items-center justify-center gap-4"><Button variant="outline" disabled={carregando || pagina <= 1} onClick={() => { setCarregando(true); setConsultaAtual({ ...consultaAtual, pagina: pagina - 1 }); }}>Anterior</Button><span className="text-sm">Página {resultado.pagina} de {resultado.totalPaginas}</span><Button variant="outline" disabled={carregando || pagina >= resultado.totalPaginas} onClick={() => { setCarregando(true); setConsultaAtual({ ...consultaAtual, pagina: pagina + 1 }); }}>Próxima</Button></div>}
      </div>
    </main>
  );
}
