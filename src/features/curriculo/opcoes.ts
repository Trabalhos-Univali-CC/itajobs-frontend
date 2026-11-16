import type { NivelFormacao, NivelIdioma } from "@/types/curriculo";

export const niveisFormacao: Record<NivelFormacao, string> = {
  fundamental: "Ensino fundamental",
  medio: "Ensino médio",
  tecnico: "Curso técnico",
  superior: "Ensino superior",
  posGraduacao: "Pós-graduação",
};

export const idiomasComuns = ["Português", "Inglês", "Espanhol", "Francês", "Alemão", "Italiano", "Libras", "Mandarim", "Japonês", "Coreano", "Russo", "Árabe"];

export const niveisIdioma: Record<NivelIdioma, string> = {
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
  fluente: "Fluente",
  nativo: "Nativo",
};
