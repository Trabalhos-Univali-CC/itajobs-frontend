export type TipoUsuario = "candidato" | "empresa";

export type Endereco = {
  cidade: string;
  bairro: string | null;
  rua: string;
  numero: string;
  complemento: string | null;
};

export type Contato = {
  email: string;
  telefone: string;
};

export type Candidato = {
  id: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  endereco: Endereco;
  contato: Contato;
  idCurriculo: number | null;
};

export type Empresa = {
  id: number;
  nome: string;
  cnpj: string;
  nota: number | null;
  endereco: Endereco;
  contato: Contato;
};

export type CandidatoCreate = Omit<Candidato, "id" | "idCurriculo">;

export type EmpresaCreate = Omit<Empresa, "id" | "nota">;
