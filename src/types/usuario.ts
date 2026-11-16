export type TipoUsuario = "candidato" | "empresa";

export type Endereco = {
  cep: string;
  cidade: string;
  bairro: string | null;
  rua: string;
  numero: string;
  complemento: string | null;
};

export type EnderecoCep = Pick<Endereco, "cep" | "cidade" | "bairro" | "rua"> & { uf: string };

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
  totalAvaliacoes: number;
  endereco: Endereco;
  contato: Contato;
};

export type CandidatoCreate = Omit<Candidato, "id" | "idCurriculo"> & { senha?: string };

export type EmpresaCreate = Omit<Empresa, "id" | "nota" | "totalAvaliacoes"> & { senha?: string };

export type AvaliacaoEmpresa = {
  idEmpresa: number;
  idCandidato: number;
  nomeCandidato: string;
  nota: number;
  comentario: string | null;
  data: string;
};

export type UsuarioLogado = { tipo: TipoUsuario; id: number; nome: string };

export type TokenResponse = { token: string; expiraEm: string; usuario: UsuarioLogado };
