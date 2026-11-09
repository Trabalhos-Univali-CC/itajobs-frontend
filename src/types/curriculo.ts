export type Habilidade = {
  id: number;
  descricao: string;
};

export type Experiencia = {
  id: number;
  nomeEmpresa: string | null;
  cargo: string;
  dataInicio: string;
  dataFim: string | null;
};

export type ExperienciaCreate = Omit<Experiencia, "id">;

export type Curriculo = {
  id: number;
  idCandidato: number;
  nomeCandidato: string;
  habilidades: Habilidade[];
  experiencias: Experiencia[];
};
