import { post, put } from "@/lib/api";
import type { Candidato, CandidatoCreate, Empresa, EmpresaCreate, TipoUsuario } from "@/types/usuario";

export function registrar(tipo: TipoUsuario, form: FormData, id?: number) {
  const endereco = {
    cidade: texto(form, "cidade") || "Itajaí",
    bairro: texto(form, "bairro") || null,
    rua: texto(form, "rua"),
    numero: texto(form, "numero"),
    complemento: texto(form, "complemento") || null,
  };
  const contato = { email: texto(form, "email").toLowerCase(), telefone: texto(form, "telefone").replace(/\D/g, "") };
  if (tipo === "candidato") {
    const dados: CandidatoCreate = { nome: texto(form, "nome"), sobrenome: texto(form, "sobrenome"), cpf: texto(form, "cpf"), endereco, contato };
    return id ? put<Candidato>(`/api/candidato/${id}`, dados) : post<Candidato>("/api/candidato", dados);
  }
  const dados: EmpresaCreate = { nome: texto(form, "nome"), cnpj: texto(form, "cnpj"), endereco, contato };
  return id ? put<Empresa>(`/api/empresa/${id}`, dados) : post<Empresa>("/api/empresa", dados);
}

export function texto(form: FormData, campo: string) {
  return String(form.get(campo) ?? "").trim();
}
