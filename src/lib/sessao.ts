import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiUrl, sessionCookie } from "@/lib/backend";
import type { UsuarioLogado } from "@/types/usuario";

export const obterUsuario = cache(async (): Promise<UsuarioLogado | null> => {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !apiUrl) return null;
  try {
    const response = await fetch(`${apiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
      redirect: "manual",
    });
    if (!response.ok) return null;
    const usuario: UsuarioLogado = await response.json();
    return usuario.id > 0 && (usuario.tipo === "candidato" || usuario.tipo === "empresa") ? usuario : null;
  } catch {
    return null;
  }
});

export async function exigirUsuario(tipo?: UsuarioLogado["tipo"]) {
  const usuario = await obterUsuario();
  if (!usuario) redirect("/login");
  if (tipo && usuario.tipo !== tipo) redirect(usuario.tipo === "empresa" ? "/painel/vagas" : "/");
  return usuario;
}
