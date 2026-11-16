"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SessionContext } from "@/features/auth/sessionContext";
import { buscarCurriculo } from "@/features/curriculo/curriculoApi";
import type { UsuarioLogado } from "@/types/usuario";

export function SessionProvider({ usuario, children }: { usuario: UsuarioLogado; children: ReactNode }) {
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    if (usuario.tipo !== "candidato") return;
    let ativo = true;
    buscarCurriculo(usuario.id)
      .then((curriculo) => {
        const arquivo = curriculo?.arquivos.find((item) => item.tipo === "foto");
        if (ativo) setFoto(arquivo && curriculo ? `/api/curriculo/${curriculo.id}/arquivos/foto?v=${encodeURIComponent(arquivo.enviadoEm)}` : null);
      })
      .catch(() => { if (ativo) setFoto(null); });
    return () => { ativo = false; };
  }, [usuario.id, usuario.tipo]);

  return <SessionContext value={{ ...usuario, foto, setFoto }}>{children}</SessionContext>;
}
