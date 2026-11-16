export const contratos = [
  { value: "clt", label: "CLT" },
  { value: "pj", label: "PJ" },
  { value: "estagio", label: "Estágio" },
  { value: "temporario", label: "Temporário" },
  { value: "aprendiz", label: "Aprendiz" },
] as const;

export const jornadas = [
  { value: "integral", label: "Integral" },
  { value: "meioPeriodo", label: "Meio período" },
  { value: "noturno", label: "Noturno" },
  { value: "escala", label: "Escala" },
] as const;

export const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
