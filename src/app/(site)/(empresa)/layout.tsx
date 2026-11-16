import type { ReactNode } from "react";
import { exigirUsuario } from "@/lib/sessao";

export default async function EmpresaLayout({ children }: { children: ReactNode }) {
  await exigirUsuario("empresa");
  return children;
}
