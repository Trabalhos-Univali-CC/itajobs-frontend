import { NextRequest, NextResponse } from "next/server";
import { apiUrl, sessionCookie } from "@/lib/backend";
import type { TokenResponse } from "@/types/usuario";

async function encaminhar(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  if (path.some((segmento) => segmento === "." || segmento === ".." || /[\\/]/.test(segmento))) return new NextResponse(null, { status: 400 });
  const rota = path.join("/").toLowerCase();
  const alteracao = request.method !== "GET" && request.method !== "HEAD";
  const origem = new URL(request.url);
  origem.host = request.headers.get("host") ?? origem.host;
  if (alteracao && ((request.headers.get("origin") && request.headers.get("origin") !== origem.origin) || request.headers.get("sec-fetch-site") === "cross-site")) {
    return NextResponse.json({ mensagem: "Origem da requisição não permitida." }, { status: 403 });
  }
  if (rota === "auth/logout") {
    if (request.method !== "POST") return new NextResponse(null, { status: 405 });
    const response = new NextResponse(null, { status: 204 });
    response.cookies.delete(sessionCookie);
    return response;
  }
  if (!apiUrl) return NextResponse.json({ mensagem: "Serviço temporariamente indisponível." }, { status: 503 });
  const login = rota === "auth/login" && request.method === "POST";
  const token = request.cookies.get(sessionCookie)?.value;
  const headers = new Headers();
  if (request.headers.has("content-type")) headers.set("Content-Type", request.headers.get("content-type")!);
  if (token && !login) headers.set("Authorization", `Bearer ${token}`);
  try {
    const options: RequestInit = {
      method: request.method,
      headers,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    };
    let upstream: Response;
    if (login) {
      const credenciais: unknown = await request.json().catch(() => null);
      if (!credenciais || typeof credenciais !== "object" || !("email" in credenciais) || typeof credenciais.email !== "string" || !credenciais.email.trim() || !("senha" in credenciais) || typeof credenciais.senha !== "string" || !credenciais.senha) {
        return NextResponse.json({ mensagem: "Informe e-mail e senha." }, { status: 400 });
      }
      headers.set("Content-Type", "application/json");
      const dados = { email: credenciais.email.trim().toLowerCase(), senha: credenciais.senha };
      const [candidato, empresa] = await Promise.all([
        fetch(`${apiUrl}/api/auth/login`, { ...options, body: JSON.stringify({ ...dados, tipo: "candidato" }) }),
        fetch(`${apiUrl}/api/auth/login`, { ...options, body: JSON.stringify({ ...dados, tipo: "empresa" }) }),
      ]);
      if (candidato.ok && empresa.ok) {
        await Promise.all([candidato.body?.cancel(), empresa.body?.cancel()]);
        return NextResponse.json({ mensagem: "Estas credenciais correspondem a duas contas. Use um e-mail diferente em uma delas para acessar sem escolher o perfil." }, { status: 409 });
      }
      if (!candidato.ok && candidato.status !== 401) upstream = candidato;
      else if (!empresa.ok && empresa.status !== 401) upstream = empresa;
      else upstream = candidato.ok ? candidato : empresa;
      if (upstream !== candidato) await candidato.body?.cancel();
      if (upstream !== empresa) await empresa.body?.cancel();
    } else {
      upstream = await fetch(`${apiUrl}/api/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`, {
        ...options,
        body: alteracao ? await request.arrayBuffer() : undefined,
      });
    }
    if (upstream.status >= 300 && upstream.status < 400) {
      return NextResponse.json({ mensagem: "A API redirecionou a conexão. Verifique o endereço configurado no servidor." }, { status: 502 });
    }
    let response: NextResponse;
    if (login && upstream.ok) {
      const dados: TokenResponse = await upstream.json();
      const expires = new Date(dados.expiraEm);
      if (!dados.token || !Number.isFinite(expires.getTime()) || expires.getTime() <= Date.now() || !dados.usuario?.id || !["candidato", "empresa"].includes(dados.usuario.tipo)) {
        return NextResponse.json({ mensagem: "A API retornou uma sessão inválida." }, { status: 502 });
      }
      response = NextResponse.json({ usuario: dados.usuario, expiraEm: dados.expiraEm });
      response.cookies.set(sessionCookie, dados.token, { httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "lax", path: "/", expires });
    } else {
      response = new NextResponse(upstream.status === 204 ? null : await upstream.arrayBuffer(), { status: upstream.status });
      if (upstream.headers.has("content-type")) response.headers.set("Content-Type", upstream.headers.get("content-type")!);
      if (upstream.headers.has("content-disposition")) response.headers.set("Content-Disposition", upstream.headers.get("content-disposition")!);
      if (upstream.headers.has("x-content-type-options")) response.headers.set("X-Content-Type-Options", upstream.headers.get("x-content-type-options")!);
      if (upstream.status === 401 && !login) response.cookies.delete(sessionCookie);
    }
    response.headers.set("Cache-Control", "no-store");
    if (upstream.headers.has("retry-after")) response.headers.set("Retry-After", upstream.headers.get("retry-after")!);
    return response;
  } catch {
    return NextResponse.json({ mensagem: "Não foi possível conectar à API. Verifique o endereço e a disponibilidade do backend." }, { status: 502 });
  }
}

export { encaminhar as GET, encaminhar as POST, encaminhar as PUT, encaminhar as PATCH, encaminhar as DELETE };
