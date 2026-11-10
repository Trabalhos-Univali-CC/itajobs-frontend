export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function get<T>(path: string) {
  return request<T>("GET", path);
}

export function post<T>(path: string, body: unknown) {
  return request<T>("POST", path, body);
}

export function put<T>(path: string, body: unknown) {
  return request<T>("PUT", path, body);
}

export function patch<T>(path: string, body: unknown) {
  return request<T>("PATCH", path, body);
}

export function del(path: string) {
  return request<void>("DELETE", path);
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor. Tente novamente.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, response.status >= 500 && !data ? "A API está indisponível. Verifique se o backend está em execução." : mensagemDeErro(data));
  }
  return data as T;
}

function mensagemDeErro(data: unknown) {
  if (typeof data === "object" && data !== null) {
    if ("mensagem" in data && typeof data.mensagem === "string") {
      return data.mensagem;
    }
    if ("errors" in data && typeof data.errors === "object" && data.errors !== null) {
      return Object.values(data.errors).flat().join(" ");
    }
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}
