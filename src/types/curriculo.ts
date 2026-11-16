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
  descricao: string | null;
};

export type ExperienciaCreate = Omit<Experiencia, "id">;

export type NivelFormacao = "fundamental" | "medio" | "tecnico" | "superior" | "posGraduacao";

export type Formacao = {
  id: number;
  instituicao: string;
  curso: string | null;
  nivel: NivelFormacao;
  dataInicio: string;
  dataFim: string | null;
};

export type FormacaoCreate = Omit<Formacao, "id">;

export type Curso = {
  id: number;
  nome: string;
  instituicao: string | null;
  cargaHoraria: number | null;
  dataConclusao: string | null;
};

export type CursoCreate = Omit<Curso, "id">;

export type Projeto = {
  id: number;
  titulo: string;
  descricao: string | null;
};

export type ProjetoCreate = Omit<Projeto, "id">;

export type NivelIdioma = "basico" | "intermediario" | "avancado" | "fluente" | "nativo";

export type Idioma = {
  id: number;
  idioma: string;
  nivel: NivelIdioma;
};

export type IdiomaCreate = Omit<Idioma, "id">;

export type ArquivoCurriculo = {
  tipo: "foto" | "pdf";
  nome: string;
  contentType: string;
  tamanho: number;
  enviadoEm: string;
};

export type Curriculo = {
  id: number;
  idCandidato: number;
  nomeCandidato: string;
  resumo: string | null;
  portfolio: string | null;
  habilidades: Habilidade[];
  experiencias: Experiencia[];
  formacoes: Formacao[];
  cursos: Curso[];
  projetos: Projeto[];
  idiomas: Idioma[];
  arquivos: ArquivoCurriculo[];
};
