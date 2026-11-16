"use client";

import { useEffect, useRef, useState } from "react";
import { LuHash, LuHouse, LuLoaderCircle, LuMapPin, LuSignpost } from "react-icons/lu";

import { IconInputField } from "@/components/form/IconInputField";
import { FormErrorAlert } from "@/components/form/FormErrorAlert";
import { Field, FieldDescription, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bairros } from "@/features/auth/bairros";
import { ApiError } from "@/lib/api";
import type { Endereco, EnderecoCep } from "@/types/usuario";

type AddressFieldsProps = {
  bairroLabel: string;
  bairroDescription: string;
  endereco?: Endereco;
};

export function AddressFields({ bairroLabel, bairroDescription, endereco }: AddressFieldsProps) {
  const [cep, setCep] = useState(endereco?.cep ?? "");
  const [cepEditado, setCepEditado] = useState(false);
  const [rua, setRua] = useState(endereco?.rua ?? "");
  const [bairro, setBairro] = useState(endereco?.bairro ?? "");
  const [cidade, setCidade] = useState(endereco?.cidade ?? "Itajaí");
  const [consulta, setConsulta] = useState<{ cep: string; carregando: boolean; erro: string | null; invalido: boolean } | null>(null);
  const cepRef = useRef<HTMLInputElement>(null);
  const edicoesRef = useRef({ rua: 0, bairro: 0 });
  const cepLimpo = cep.replace(/\D/g, "");
  const status = consulta?.cep === cepLimpo ? consulta : null;
  const opcoesBairro = bairro && !bairros.includes(bairro) ? [bairro, ...bairros] : bairros;
  const items = [{ label: "Selecione o bairro", value: null }, ...opcoesBairro.map((value) => ({ label: value, value }))];

  useEffect(() => {
    if (!cepEditado || cepLimpo.length !== 8) return;
    let ativo = true;
    const controller = new AbortController();
    const edicoes = { ...edicoesRef.current };
    const timer = setTimeout(async () => {
      setConsulta({ cep: cepLimpo, carregando: true, erro: null, invalido: false });
      try {
        const resposta = await fetch(`/api/cep/${cepLimpo}`, { cache: "no-store", signal: controller.signal });
        const dados: EnderecoCep & { mensagem?: string } = await resposta.json();
        if (!resposta.ok) throw new ApiError(resposta.status, dados.mensagem ?? "Não foi possível consultar o CEP.");
        if (!ativo) return;
        if (edicoesRef.current.rua === edicoes.rua) setRua(dados.rua);
        if (edicoesRef.current.bairro === edicoes.bairro) setBairro(dados.bairro ?? "");
        setCidade(dados.cidade);
        cepRef.current?.setCustomValidity("");
        setConsulta({ cep: cepLimpo, carregando: false, erro: null, invalido: false });
      } catch (error) {
        if (!ativo) return;
        const invalido = error instanceof ApiError && (error.status === 400 || error.status === 404);
        const mensagem = error instanceof ApiError ? error.message : "Não foi possível consultar o CEP agora. Você pode preencher o endereço manualmente.";
        cepRef.current?.setCustomValidity(invalido ? mensagem : "");
        setConsulta({ cep: cepLimpo, carregando: false, erro: mensagem, invalido });
      }
    }, 300);
    return () => { ativo = false; clearTimeout(timer); controller.abort(); };
  }, [cepLimpo, cepEditado]);

  return (
    <>
      <input type="hidden" name="cidade" value={cidade} />
      <FieldSeparator className="my-1 sm:col-span-2 *:data-[slot=field-separator-content]:bg-card">Endereço em Itajaí</FieldSeparator>
      <div className="space-y-2 sm:col-span-2">
        <div className="grid items-start gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <IconInputField ref={cepRef} id="cep" value={cep} onChange={(event) => {
            const numeros = event.target.value.replace(/\D/g, "").slice(0, 8);
            if (numeros !== cepLimpo || !cepEditado) event.currentTarget.setCustomValidity(numeros.length === 8 ? "Aguarde a consulta do CEP." : "");
            setCep(numeros.length > 5 ? `${numeros.slice(0, 5)}-${numeros.slice(5)}` : numeros);
            setCepEditado(true);
          }} label="CEP" icon={LuMapPin} autoComplete="postal-code" inputMode="numeric" placeholder="88301-001" required maxLength={9} pattern="[0-9]{5}-?[0-9]{3}" aria-invalid={status?.invalido || undefined} aria-describedby={status?.erro ? "cep-erro" : "cep-ajuda"} addonEnd={status?.carregando ? <LuLoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : null} />
          <Field>
            <FieldLabel htmlFor="bairro">{bairroLabel}</FieldLabel>
            <Select items={items} name="bairro" value={bairro || null} onValueChange={(value) => { edicoesRef.current.bairro += 1; setBairro(value ?? ""); }}>
              <SelectTrigger id="bairro" className="w-full">
                <LuMapPin />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {opcoesBairro.map((bairro) => (
                  <SelectItem key={bairro} value={bairro}>
                    {bairro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <FieldDescription id="cep-ajuda" role={status?.carregando ? "status" : undefined} className="text-xs">{status?.carregando ? "Consultando endereço..." : "Ao completar o CEP, a rua e o bairro são preenchidos automaticamente."} {bairroDescription}</FieldDescription>
        {status?.erro && <div id="cep-erro"><FormErrorAlert message={status.erro} /></div>}
      </div>
      <div className="grid items-start gap-5 sm:col-span-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <IconInputField id="rua" value={rua} onChange={(event) => { edicoesRef.current.rua += 1; setRua(event.target.value); }} label="Rua" icon={LuSignpost} autoComplete="address-line1" placeholder="Preenchida pelo CEP ou informe a rua" maxLength={100} />
        <IconInputField id="numero" defaultValue={endereco?.numero} label="Número" icon={LuHash} placeholder="Ex.: 250" required maxLength={6} />
      </div>
      <IconInputField id="complemento" defaultValue={endereco?.complemento ?? ""} label="Complemento (opcional)" icon={LuHouse} autoComplete="address-line2" placeholder="Ex.: Apartamento 201, bloco B" maxLength={100} className="sm:col-span-2" />
    </>
  );
}
