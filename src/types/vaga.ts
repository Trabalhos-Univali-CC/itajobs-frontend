export type Vaga = {
  id: number;
  idEmpresa: number;
  nomeEmpresa: string;
  cargo: string;
  descricao: string;
  salario: number | null;
  tipoContrato: "clt" | "pj" | "estagio" | "temporario" | "aprendiz";
  jornada: "integral" | "meioPeriodo" | "noturno" | "escala";
  bairro: string | null;
  requisitos: string | null;
  status: "aberta" | "encerrada";
  dataPublicacao: string;
};

export type VagaCreate = Omit<Vaga, "id" | "nomeEmpresa" | "status" | "dataPublicacao">;

export type Pagina<T> = { itens: T[]; pagina: number; tamanhoPagina: number; total: number; totalPaginas: number };

export type Candidatura = {
  idVaga: number;
  cargo: string;
  idEmpresa: number;
  nomeEmpresa: string;
  idCandidato: number;
  nomeCandidato: string;
  dataCandidatura: string;
  status: string;
  dataStatus: string | null;
  statusVaga: Vaga["status"];
};
