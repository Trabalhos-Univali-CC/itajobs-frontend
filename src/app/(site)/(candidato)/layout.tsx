import type { ReactNode } from "react";
import { exigirUsuario } from "@/lib/sessao";

export default async function CandidatoLayout({ children }: { children: ReactNode }) {
  await exigirUsuario("candidato");
  return children;
}
