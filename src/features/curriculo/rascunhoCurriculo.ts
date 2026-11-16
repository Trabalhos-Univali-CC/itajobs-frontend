"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type Dispatch, type SetStateAction, type FormEvent, type RefObject } from "react";
import { ApiError, del, post, put } from "@/lib/api";
import { buscarCurriculo } from "./curriculoApi";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { ArquivoCurriculo, Curriculo } from "@/types/curriculo";
import type { Candidato } from "@/types/usuario";

const grupos = ["habilidades", "experiencias", "projetos", "formacoes", "cursos", "idiomas"] as const;
type Grupo = typeof grupos[number];
type Item = Curriculo[Grupo][number];
type Foto = { dados: string; nome: string; contentType: string };
type Rascunho = {
  versao: 1;
  candidato: Candidato;
  base: Curriculo | null;
  dados: Curriculo;
  campos: Record<string, unknown>;
  foto?: Foto | null;
  revisao?: number;
  criando?: { grupo: Grupo; id: number; dados: Omit<Item, "id"> };
};

export function curriculoVazio(candidato: Candidato): Curriculo {
  return { id: -1, idCandidato: candidato.id, nomeCandidato: `${candidato.nome} ${candidato.sobrenome}`, resumo: null, portfolio: null, habilidades: [], experiencias: [], projetos: [], formacoes: [], cursos: [], idiomas: [], arquivos: [] };
}

const chave = (id: number) => `itajobs:curriculo:rascunho:v1:${id}`;

export function lerRascunho(id: number): Rascunho | null {
  const texto = localStorage.getItem(chave(id));
  if (!texto) return null;
  const salvo = JSON.parse(texto) as Rascunho;
  if (salvo.versao !== 1 || salvo.candidato.id !== id || salvo.dados.idCandidato !== id || !salvo.campos || !grupos.every((grupo) => Array.isArray(salvo.dados[grupo]))) throw new Error("Não foi possível recuperar o rascunho deste currículo.");
  return salvo;
}

type Contexto = {
  rascunho: Rascunho;
  alterar: (acao: (atual: Rascunho) => Rascunho) => void;
  preparar: Map<string, () => Promise<void>>;
};

export const RascunhoCurriculoContext = createContext<Contexto | null>(null);

export function useRascunhoCurriculo() {
  const contexto = useContext(RascunhoCurriculoContext);
  if (!contexto) throw new Error("O editor do currículo não foi carregado.");
  return contexto;
}

export function useEstadoCurriculo<T>(nome: string, inicial: T): [T, Dispatch<SetStateAction<T>>] {
  const { rascunho, alterar } = useRascunhoCurriculo();
  const valor = Object.hasOwn(rascunho.campos, nome) ? rascunho.campos[nome] as T : inicial;
  return [valor, (acao) => alterar((atual) => {
    const anterior = Object.hasOwn(atual.campos, nome) ? atual.campos[nome] as T : inicial;
    const novo = typeof acao === "function" ? (acao as (valor: T) => T)(anterior) : acao;
    const campos = { ...atual.campos };
    if (JSON.stringify(novo) === JSON.stringify(inicial)) delete campos[nome];
    else campos[nome] = novo;
    return { ...atual, campos };
  })];
}

export function useFormularioCurriculo(nome: string, ref: RefObject<HTMLFormElement | null>, acao: (form: FormData) => Promise<void>, pendente: boolean) {
  const { preparar, rascunho } = useRascunhoCurriculo();
  const restaurado = useRef<HTMLFormElement | null>(null);
  const callback = useRef({ acao, pendente });
  const temCampos = Object.keys(rascunho.campos).some((campo) => campo.startsWith(`${nome}:`));
  useLayoutEffect(() => {
    callback.current = { acao, pendente: pendente || temCampos };
    if (!ref.current || ref.current === restaurado.current) return;
    restaurado.current = ref.current;
    ref.current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[id], textarea[id]").forEach((campo) => {
      const salvo = rascunho.campos[`${nome}:${campo.id}`];
      if (typeof salvo === "string") campo.value = salvo;
    });
  });
  useEffect(() => {
    preparar.set(nome, async () => {
      if (!callback.current.pendente || !ref.current) return;
      if (!ref.current.reportValidity()) throw new Error("Revise os campos da seção antes de salvar o currículo.");
      await callback.current.acao(new FormData(ref.current));
      ref.current?.reset();
    });
    return () => { preparar.delete(nome); };
  }, [nome, preparar, ref]);
  return useFormSubmit(async (form) => { await acao(form); ref.current?.reset(); });
}

let ultimoIdLocal = 0;

export function novoIdLocal(value: { id: number }[]) {
  ultimoIdLocal = Math.min(ultimoIdLocal, -Date.now(), ...value.map((item) => item.id)) - 1;
  return ultimoIdLocal;
}

function conteudo(item: Item) {
  return Object.fromEntries(Object.entries(item).filter(([campo]) => campo !== "id")) as Omit<Item, "id">;
}

function iguais(a: unknown, b: unknown): boolean {
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return a === b;
  const primeiro = a as Record<string, unknown>;
  const segundo = b as Record<string, unknown>;
  return Object.keys(primeiro).length === Object.keys(segundo).length && Object.keys(primeiro).every((campo) => iguais(primeiro[campo], segundo[campo]));
}

export function useEditorCurriculo(candidato: Candidato, curriculo: Curriculo | null) {
  const [inicial] = useState(() => {
    const vazio: Rascunho = { versao: 1, candidato, base: curriculo, dados: curriculo ?? curriculoVazio(candidato), campos: {} };
    try { return { rascunho: lerRascunho(candidato.id) ?? vazio, erro: null }; }
    catch { return { rascunho: vazio, erro: "Não foi possível recuperar o rascunho neste navegador. Mantenha a página aberta e salve seus dados." }; }
  });
  const [rascunho, setRascunho] = useState(inicial.rascunho);
  const atual = useRef(rascunho);
  const [preparar] = useState(() => new Map<string, () => Promise<void>>());
  const [erroCache, setErroCache] = useState<string | null>(inicial.erro);
  const [salvo, setSalvo] = useState(false);
  const alterar = (acao: (anterior: Rascunho) => Rascunho) => {
    const novo = acao(atual.current);
    atual.current = novo;
    setRascunho(novo);
    setSalvo(false);
    try { localStorage.setItem(chave(candidato.id), JSON.stringify(novo)); setErroCache(null); }
    catch { setErroCache("Não foi possível guardar o rascunho neste navegador. Mantenha esta página aberta e salve seus dados."); }
  };
  const salvando = useRef(false);
  const formulario = useFormSubmit(async () => {
    if (salvando.current) return;
    salvando.current = true;
    try {
      for (const prepararSecao of preparar.values()) await prepararSecao();
      let servidor = await buscarCurriculo(candidato.id);
      if (!servidor) {
        try { servidor = await post<Curriculo>("/api/curriculo", { idCandidato: candidato.id }); }
        catch (error) {
          if (!(error instanceof ApiError) || error.status !== 409) throw error;
          servidor = await buscarCurriculo(candidato.id);
          if (!servidor) throw error;
        }
      }
      const baseAnterior = atual.current.base;
      let base = servidor;
      const confirmar = (novaBase: Curriculo, ajustar?: (dados: Curriculo) => Curriculo) => {
        base = novaBase;
        alterar((estado) => ({ ...estado, base, dados: { ...(ajustar ? ajustar(estado.dados) : estado.dados), id: base.id } }));
      };
      confirmar(base);
      const tentativa = atual.current.criando;
      if (tentativa) {
        const encontrado = base[tentativa.grupo].find((item) => !baseAnterior?.[tentativa.grupo].some((antigo) => antigo.id === item.id) && iguais(conteudo(item), tentativa.dados));
        if (encontrado) {
          confirmar(base, (dados) => ({ ...dados, [tentativa.grupo]: dados[tentativa.grupo].map((item) => item.id === tentativa.id ? { ...item, id: encontrado.id } : item) }));
        }
        alterar((estado) => ({ ...estado, criando: undefined }));
      }
      const snapshot = structuredClone(atual.current);
      const resumo = snapshot.dados.resumo?.trim() || null;
      const portfolio = snapshot.dados.portfolio?.trim() || null;
      if (resumo !== base.resumo || portfolio !== base.portfolio) {
        const resposta = await put<Curriculo>(`/api/curriculo/${base.id}`, { resumo, portfolio });
        confirmar({ ...base, resumo: resposta.resumo, portfolio: resposta.portfolio }, (dados) => ({ ...dados, resumo: dados.resumo === snapshot.dados.resumo ? resposta.resumo : dados.resumo, portfolio: dados.portfolio === snapshot.dados.portfolio ? resposta.portfolio : dados.portfolio }));
      }
      for (const grupo of grupos) {
        const itens = snapshot.dados[grupo];
        for (const antigo of [...base[grupo]]) {
          if (itens.some((item) => item.id === antigo.id)) continue;
          await del(`/api/curriculo/${base.id}/${grupo}/${antigo.id}`);
          confirmar({ ...base, [grupo]: base[grupo].filter((item) => item.id !== antigo.id) });
        }
        for (const item of itens) {
          const anterior = base[grupo].find((existente) => existente.id === item.id);
          if (anterior && iguais(conteudo(anterior), conteudo(item))) continue;
          let resposta: Item;
          if (item.id < 0) {
            alterar((estado) => ({ ...estado, criando: { grupo, id: item.id, dados: conteudo(item) } }));
            resposta = await post<Item>(`/api/curriculo/${base.id}/${grupo}`, conteudo(item));
          } else {
            resposta = await put<Item>(`/api/curriculo/${base.id}/${grupo}/${item.id}`, conteudo(item));
          }
          confirmar({ ...base, [grupo]: anterior ? base[grupo].map((existente) => existente.id === resposta.id ? resposta : existente) : [...base[grupo], resposta] }, (dados) => ({ ...dados, [grupo]: dados[grupo].map((existente) => existente.id !== item.id ? existente : iguais(existente, item) ? resposta : { ...existente, id: resposta.id }) }));
          alterar((estado) => ({ ...estado, criando: undefined }));
        }
      }
      if (snapshot.foto !== undefined) {
        let foto: ArquivoCurriculo | null = null;
        if (snapshot.foto) {
          const bytes = Uint8Array.from(atob(snapshot.foto.dados.split(",")[1]), (byte) => byte.charCodeAt(0));
          const form = new FormData();
          form.set("arquivo", new Blob([bytes], { type: snapshot.foto.contentType }), snapshot.foto.nome);
          foto = await put<ArquivoCurriculo>(`/api/curriculo/${base.id}/arquivos/foto`, form);
        } else if (base.arquivos.some((arquivo) => arquivo.tipo === "foto")) await del(`/api/curriculo/${base.id}/arquivos/foto`);
        const arquivos = [...base.arquivos.filter((arquivo) => arquivo.tipo !== "foto"), ...(foto ? [foto] : [])];
        confirmar({ ...base, arquivos }, (dados) => ({ ...dados, arquivos: [...dados.arquivos.filter((arquivo) => arquivo.tipo !== "foto"), ...(foto ? [foto] : [])] }));
        alterar((estado) => ({ ...estado, foto: iguais(estado.foto, snapshot.foto) ? undefined : estado.foto }));
      }
      for (const arquivo of [...base.arquivos]) {
        if (arquivo.tipo === "foto" || snapshot.dados.arquivos.some((item) => item.tipo === arquivo.tipo)) continue;
        await del(`/api/curriculo/${base.id}/arquivos/${arquivo.tipo}`);
        confirmar({ ...base, arquivos: base.arquivos.filter((item) => item.tipo !== arquivo.tipo) });
      }
      if (atual.current.dados.resumo === base.resumo && atual.current.dados.portfolio === base.portfolio && iguais(atual.current.dados.arquivos, base.arquivos) && grupos.every((grupo) => iguais([...atual.current.dados[grupo]].sort((a, b) => a.id - b.id), [...base[grupo]].sort((a, b) => a.id - b.id))) && atual.current.foto === undefined && Object.keys(atual.current.campos).length === 0) {
        try { localStorage.removeItem(chave(candidato.id)); }
        catch { throw new Error("Os dados foram salvos, mas o navegador não permitiu limpar o rascunho."); }
        setErroCache(null);
        setSalvo(true);
      }
    } finally { salvando.current = false; }
  });
  const fotoSalva = rascunho.dados.arquivos.find((arquivo) => arquivo.tipo === "foto");
  const imagem = rascunho.foto !== undefined ? rascunho.foto?.dados ?? null : fotoSalva && rascunho.dados.id > 0 ? `/api/curriculo/${rascunho.dados.id}/arquivos/foto?v=${encodeURIComponent(fotoSalva.enviadoEm)}` : null;
  const capture = (event: FormEvent<HTMLDivElement>) => {
    const campo = event.target;
    if (!(campo instanceof HTMLInputElement || campo instanceof HTMLTextAreaElement) || ["file", "checkbox", "radio", "hidden"].includes(campo.type) || campo.readOnly || campo.id === "resumo" || campo.id === "portfolio" || campo.id === "competencia") return;
    const form = campo.closest("form");
    if (!form?.id) return;
    alterar((estado) => {
      const campos = { ...estado.campos };
      if (campo.value === campo.defaultValue) delete campos[`${form.id}:${campo.id}`];
      else campos[`${form.id}:${campo.id}`] = campo.value;
      return { ...estado, campos };
    });
  };
  const reset = (event: FormEvent<HTMLDivElement>) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    alterar((estado) => ({ ...estado, campos: Object.fromEntries(Object.entries(estado.campos).filter(([campo]) => !campo.startsWith(`${form.id}:`))) }));
  };
  return { contexto: { rascunho, alterar, preparar }, dados: rascunho.dados, imagem, erro: formulario.erro ?? erroCache, enviando: formulario.enviando, onSubmit: formulario.onSubmit, capture, reset, salvo };
}
