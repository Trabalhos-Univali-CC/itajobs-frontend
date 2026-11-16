"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Slider } from "@base-ui/react/slider";
import { LuBanknote, LuBriefcaseBusiness, LuClock3, LuEye, LuFileText, LuMapPin, LuPlus, LuSend, LuSparkles, LuX } from "react-icons/lu";
import { useUsuario } from "@/features/auth/sessionContext";
import { bairros } from "@/features/auth/bairros";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { post, put } from "@/lib/api";
import type { Vaga, VagaCreate } from "@/types/vaga";
import { cn, separarTopicos } from "@/utils/utils";
import { contratos, jornadas, moeda } from "../opcoes";
import { VagaPreview } from "./VagaPreview";

type VagaFormProps = { vaga?: Vaga; onSave?: (vaga: Vaga) => void };

export function VagaForm({ vaga, onSave }: VagaFormProps) {
  const router = useRouter();
  const usuario = useUsuario();
  const requisitoRef = useRef<HTMLInputElement>(null);
  const adicionarRequisitoRef = useRef<HTMLButtonElement>(null);
  const [cargo, setCargo] = useState(vaga?.cargo ?? "");
  const [descricao, setDescricao] = useState(vaga?.descricao ?? "");
  const [tipoContrato, setTipoContrato] = useState<Vaga["tipoContrato"] | "">(vaga?.tipoContrato ?? "");
  const [jornada, setJornada] = useState<Vaga["jornada"] | "">(vaga?.jornada ?? "");
  const [bairro, setBairro] = useState(vaga?.bairro ?? "");
  const [modoSalario, setModoSalario] = useState(vaga?.salario != null ? "fixo" : "combinar");
  const [salario, setSalario] = useState(vaga?.salario?.toString() ?? "");
  const [requisitos, setRequisitos] = useState(() => separarTopicos(vaga?.requisitos ?? ""));
  const [textoRequisito, setTextoRequisito] = useState("");
  const [erroRequisito, setErroRequisito] = useState<string | null>(null);
  const requisitosAtuais = textoRequisito.trim() && !requisitos.some((item) => item.toLocaleLowerCase() === textoRequisito.trim().toLocaleLowerCase()) ? [...requisitos, textoRequisito.trim()] : requisitos;
  const salarioMaximo = Math.max(20000, Math.ceil(Number(salario || 0) / 1000) * 1000);
  const opcoesBairro = [{ value: "", label: "Usar bairro da empresa" }, ...(bairro && !bairros.includes(bairro) ? [bairro, ...bairros] : bairros).map((value) => ({ value, label: value }))];
  const { erro, enviando, onSubmit } = useFormSubmit(async (form) => {
    if (requisitosAtuais.join("\n").length > 4000) throw new Error("Os requisitos devem ter no máximo 4.000 caracteres no total.");
    const dados: VagaCreate = {
      idEmpresa: usuario.id,
      cargo: String(form.get("cargo")).trim(),
      descricao: String(form.get("descricao")).trim(),
      salario: form.get("salario") ? Number(form.get("salario")) : null,
      tipoContrato: String(form.get("tipoContrato")) as VagaCreate["tipoContrato"],
      jornada: String(form.get("jornada")) as VagaCreate["jornada"],
      bairro: String(form.get("bairro") ?? "").trim() || null,
      requisitos: requisitosAtuais.join("\n") || null,
    };
    const salva = vaga ? await put<Vaga>(`/api/vaga/${vaga.id}`, dados) : await post<Vaga>("/api/vaga", dados);
    setRequisitos(separarTopicos(salva.requisitos ?? ""));
    setTextoRequisito("");
    setErroRequisito(null);
    setBairro(salva.bairro ?? "");
    onSave?.(salva);
    if (!vaga) router.push(`/painel/vagas/${salva.id}`);
  });

  return (
    <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
      <form key={vaga?.id ?? "nova"} onSubmit={onSubmit} className="min-w-0 space-y-5">
        <fieldset disabled={enviando} className="min-w-0 space-y-5 disabled:opacity-70">
          <Card className="gap-5 p-5 shadow-sm ring-primary/10 sm:p-6">
            <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LuBriefcaseBusiness aria-hidden className="size-5" /></span><div className="space-y-0.5"><h2 className="text-lg font-semibold">Informações da vaga</h2><p className="text-sm text-muted-foreground">Defina o cargo, o contrato e o local de trabalho.</p></div></div>
            <IconInputField id="cargo" label="Nome do cargo" icon={LuBriefcaseBusiness} placeholder="Ex.: Assistente de logística" minLength={2} maxLength={45} required value={cargo} onChange={(event) => setCargo(event.target.value)} />
            <div className="grid items-start gap-5 sm:grid-cols-2">
              <Field className="min-w-0"><FieldLabel htmlFor="tipoContrato">Tipo de contrato</FieldLabel><Select items={contratos} name="tipoContrato" required value={tipoContrato || null} onValueChange={(value) => setTipoContrato(value ?? "")} disabled={enviando}><SelectTrigger id="tipoContrato" className="w-full"><LuBriefcaseBusiness /><SelectValue placeholder="Selecione o contrato" /></SelectTrigger><SelectContent>{contratos.map((contrato) => <SelectItem key={contrato.value} value={contrato.value}>{contrato.label}</SelectItem>)}</SelectContent></Select></Field>
              <Field className="min-w-0"><FieldLabel htmlFor="jornada">Jornada</FieldLabel><Select items={jornadas} name="jornada" required value={jornada || null} onValueChange={(value) => setJornada(value ?? "")} disabled={enviando}><SelectTrigger id="jornada" className="w-full"><LuClock3 /><SelectValue placeholder="Selecione a jornada" /></SelectTrigger><SelectContent>{jornadas.map((opcao) => <SelectItem key={opcao.value} value={opcao.value}>{opcao.label}</SelectItem>)}</SelectContent></Select></Field>
            </div>
            <Field className="min-w-0"><FieldLabel htmlFor="bairro">Bairro</FieldLabel><Select items={opcoesBairro} name="bairro" value={bairro} onValueChange={(value) => setBairro(value ?? "")} disabled={enviando}><SelectTrigger id="bairro" className="w-full"><LuMapPin /><SelectValue /></SelectTrigger><SelectContent>{opcoesBairro.map((opcao) => <SelectItem key={opcao.value} value={opcao.value}>{opcao.label}</SelectItem>)}</SelectContent></Select><FieldDescription className="text-xs">Selecione o local da vaga ou use o bairro cadastrado da empresa.</FieldDescription></Field>
          </Card>

          <Card className="gap-5 p-5 shadow-sm ring-primary/10 sm:p-6">
            <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LuBanknote aria-hidden className="size-5" /></span><div className="space-y-0.5"><h2 className="text-lg font-semibold">Remuneração</h2><p className="text-sm text-muted-foreground">Informe como o salário será apresentado.</p></div></div>
            <div role="group" aria-label="Formato do salário" className="grid grid-cols-2 gap-1.5 rounded-xl bg-muted/50 p-1.5 sm:grid-cols-3">
              {[{ value: "combinar", label: "A combinar" }, { value: "fixo", label: "Salário fixo" }].map((opcao) => <Button key={opcao.value} type="button" variant="ghost" aria-pressed={modoSalario === opcao.value} onClick={() => setModoSalario(opcao.value)} className={cn("min-w-0 rounded-lg px-2 text-sm sm:px-3", modoSalario === opcao.value ? "bg-card text-primary shadow-sm hover:bg-card" : "text-muted-foreground hover:bg-card/60")}>{opcao.label}</Button>)}
              <Button type="button" variant="ghost" disabled title="Faixa salarial ainda não disponível no backend." className="col-span-2 min-w-0 gap-1.5 rounded-lg px-2 text-muted-foreground sm:col-span-1 sm:px-3">Faixa salarial<span className="rounded bg-primary/5 px-1.5 py-0.5 text-[10px]">Em breve</span></Button>
            </div>
            {modoSalario === "fixo" ? <div className="space-y-3 rounded-xl border border-primary/10 p-4">
              <IconInputField id="salario" label="Valor do salário" icon={LuBanknote} type="number" inputMode="decimal" min={0.01} step="0.01" required placeholder="0,00" value={salario} onChange={(event) => setSalario(event.target.value)} />
              <Slider.Root min={0} max={salarioMaximo} step={50} largeStep={500} value={Number(salario || 0)} onValueChange={(value) => setSalario(value > 0 ? String(value) : "")} disabled={enviando}>
                <Slider.Label className="sr-only">Ajustar salário fixo</Slider.Label>
                <Slider.Control className="relative flex h-11 w-full touch-none items-center select-none"><Slider.Track className="relative h-1.5 w-full rounded-full bg-primary/10"><Slider.Indicator className="rounded-full bg-primary" /><Slider.Thumb aria-label="Ajustar salário fixo" getAriaValueText={(_, value) => moeda.format(value)} className="size-5 rounded-full border-2 border-primary bg-card shadow-sm outline-none transition-[background-color,box-shadow] hover:bg-accent focus-within:ring-4 focus-within:ring-primary/15" /></Slider.Track></Slider.Control>
                <div className="flex justify-between gap-3 text-xs text-muted-foreground"><span>{moeda.format(0)}</span><span>{moeda.format(salarioMaximo)}</span></div>
              </Slider.Root>
            </div> : <p className="rounded-xl border border-dashed border-primary/15 bg-accent/20 p-4 text-sm text-muted-foreground">O anúncio será exibido com “Salário a combinar”.</p>}
          </Card>

          <Card className="gap-5 p-5 shadow-sm ring-primary/10 sm:p-6">
            <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LuFileText aria-hidden className="size-5" /></span><div className="space-y-0.5"><h2 className="text-lg font-semibold">Sobre a oportunidade</h2><p className="text-sm text-muted-foreground">Apresente as atividades e o que a empresa oferece.</p></div></div>
            <Field><FieldLabel htmlFor="descricao">Descrição da vaga</FieldLabel><Textarea id="descricao" name="descricao" required rows={7} placeholder="Conte como será o dia a dia, as responsabilidades e os benefícios da vaga." value={descricao} onChange={(event) => setDescricao(event.target.value)} className="min-h-44 resize-y leading-relaxed" /></Field>
          </Card>

          <Card className="gap-5 p-5 shadow-sm ring-primary/10 sm:p-6">
            <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LuSparkles aria-hidden className="size-5" /></span><div className="space-y-0.5"><h2 className="text-lg font-semibold">Requisitos</h2><p className="text-sm text-muted-foreground">Adicione uma habilidade ou exigência por vez.</p></div></div>
            <div className="flex min-h-8 flex-wrap items-center gap-2">
              {requisitos.map((requisito, index) => <Badge key={`${index}-${requisito}`} className="h-auto min-h-8 max-w-full gap-0.5 py-1 pr-1.5 pl-3 text-sm font-semibold"><span className="min-w-0 truncate" title={requisito}>{requisito}</span><button type="button" disabled={enviando} aria-label={`Remover ${requisito}`} className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-white/15 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70 disabled:opacity-50" onClick={() => { setRequisitos((atuais) => atuais.filter((_, posicao) => posicao !== index)); setErroRequisito(null); }}><LuX aria-hidden className="size-3.5" /></button></Badge>)}
              {requisitos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum requisito adicionado.</p>}
            </div>
            <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Field className="min-w-0"><FieldLabel htmlFor="requisito">Requisito (opcional)</FieldLabel><Input ref={requisitoRef} id="requisito" value={textoRequisito} maxLength={4000} placeholder="Ex.: Conhecimento em Excel" aria-invalid={!!erroRequisito || undefined} aria-describedby={erroRequisito ? "requisito-erro" : "requisito-ajuda"} onChange={(event) => { setTextoRequisito(event.target.value); setErroRequisito(null); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); adicionarRequisitoRef.current?.click(); } }} /></Field>
              <Button ref={adicionarRequisitoRef} type="button" variant="default" className="gap-2 sm:w-36" disabled={enviando} onClick={() => {
                const texto = textoRequisito.trim();
                if (!texto) setErroRequisito("Informe um requisito para adicionar.");
                else if (requisitos.some((item) => item.toLocaleLowerCase() === texto.toLocaleLowerCase())) setErroRequisito("Este requisito já foi adicionado.");
                else if ([...requisitos, texto].join("\n").length > 4000) setErroRequisito("Os requisitos devem ter no máximo 4.000 caracteres no total.");
                else { setRequisitos([...requisitos, texto]); setTextoRequisito(""); setErroRequisito(null); }
                requisitoRef.current?.focus({ preventScroll: true });
              }}>Adicionar<LuPlus aria-hidden className="size-4" /></Button>
            </div>
            <FieldDescription id="requisito-ajuda" className="text-xs">Pressione Enter ou clique em Adicionar. Você pode continuar digitando em seguida.</FieldDescription>
            {erroRequisito && <div id="requisito-erro"><FormErrorAlert message={erroRequisito} /></div>}
          </Card>
        </fieldset>
        <FormErrorAlert message={erro} />
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-primary/10 pt-4">
          <Link href="/painel/vagas" className={cn(buttonVariants({ variant: "ghost" }), "flex-1 text-muted-foreground sm:flex-none")}>Voltar ao painel</Link>
          <SubmitButton pending={enviando} pendingLabel="Salvando..." icon={LuSend} className="flex-1 gap-2 px-5 sm:flex-none">{vaga ? "Salvar alterações" : "Publicar vaga"}</SubmitButton>
        </div>
      </form>
      <aside aria-label="Prévia da vaga" className="min-w-0 space-y-3 lg:sticky lg:top-24">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1"><h2 className="flex items-center gap-2 text-sm font-semibold text-primary"><LuEye aria-hidden className="size-4" />Prévia da vaga</h2><span className="rounded-md border border-primary/10 bg-accent/60 px-2 py-1 text-[10px] font-medium text-primary/70">{vaga ? "Antes de salvar" : "Antes de publicar"}</span></div>
        <VagaPreview vaga={{ cargo, descricao, nomeEmpresa: usuario.nome, tipoContrato: tipoContrato || undefined, jornada: jornada || undefined, bairro, requisitos: requisitosAtuais.join("\n"), salario: modoSalario === "fixo" ? salario ? Number(salario) : undefined : null }} />
      </aside>
    </div>
  );
}
