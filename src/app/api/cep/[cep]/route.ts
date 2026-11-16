import { NextResponse } from "next/server";
import type { EnderecoCep } from "@/types/usuario";

export async function GET(_request: Request, { params }: { params: Promise<{ cep: string }> }) {
  const { cep } = await params;
  if (!/^\d{8}$/.test(cep)) return NextResponse.json({ mensagem: "Informe os 8 dígitos do CEP." }, { status: 400 });

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!resposta.ok) throw new Error("ViaCEP indisponível.");
    const dados = await resposta.json();
    if (dados.erro === true || dados.erro === "true") return NextResponse.json({ mensagem: "CEP não encontrado. Confira os números informados." }, { status: 404 });
    if (typeof dados.localidade !== "string" || typeof dados.uf !== "string") throw new Error("Endereço inválido.");
    const itajai = dados.ibge ? dados.ibge === "4208203" : dados.uf.toUpperCase() === "SC" && dados.localidade.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === "itajai";
    if (!itajai) return NextResponse.json({ mensagem: `O ItaJobs atende apenas Itajaí/SC. Este CEP é de ${dados.localidade}/${dados.uf}.` }, { status: 400 });
    return NextResponse.json({ cep, rua: typeof dados.logradouro === "string" ? dados.logradouro.trim() : "", bairro: typeof dados.bairro === "string" ? dados.bairro.trim() || null : null, cidade: dados.localidade, uf: dados.uf } satisfies EnderecoCep, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ mensagem: "Não foi possível consultar o CEP agora. Você pode preencher o endereço manualmente." }, { status: 502 });
  }
}
