import { ApiError, get } from "@/lib/api";
import type { Curriculo } from "@/types/curriculo";

export async function buscarCurriculo(idCandidato: number) {
  try {
    return await get<Curriculo>(`/api/candidato/${idCandidato}/curriculo`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
