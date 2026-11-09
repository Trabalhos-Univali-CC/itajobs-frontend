export type Vaga = {
  id: number;
  idEmpresa: number;
  nomeEmpresa: string;
  cargo: string;
  descricao: string;
  salario: number | null;
};

export type VagaCreate = Omit<Vaga, "id" | "nomeEmpresa">;

export type Candidatura = {
  idVaga: number;
  cargo: string;
  idEmpresa: number;
  nomeEmpresa: string;
  idCandidato: number;
  nomeCandidato: string;
  dataCandidatura: string;
};
