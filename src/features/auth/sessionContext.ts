"use client";

import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { UsuarioLogado } from "@/types/usuario";

export const SessionContext = createContext<(UsuarioLogado & { foto: string | null; setFoto: Dispatch<SetStateAction<string | null>> }) | null>(null);

export function useUsuario() {
  const usuario = useContext(SessionContext);
  if (!usuario) throw new Error("É necessário estar autenticado para acessar esta página.");
  return usuario;
}
