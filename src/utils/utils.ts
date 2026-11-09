export { cn } from "cn";

export function normalizarCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

export function normalizarCnpj(cnpj: string) {
  return cnpj.toUpperCase().replace(/[^0-9A-Z]/g, "");
}

export function cpfValido(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || new Set(cpf).size === 1) {
    return false;
  }

  return (
    digitoVerificador(cpf.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(cpf[9]) &&
    digitoVerificador(cpf.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(cpf[10])
  );
}

export function cnpjValido(cnpj: string) {
  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || new Set(cnpj).size === 1) {
    return false;
  }

  return (
    digitoVerificador(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(cnpj[12]) &&
    digitoVerificador(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(cnpj[13])
  );
}

function digitoVerificador(caracteres: string, pesos: number[]) {
  const soma = pesos.reduce((total, peso, index) => total + (caracteres.charCodeAt(index) - 48) * peso, 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export async function recortarFotoQuadrada(arquivo: File, tamanho = 320) {
  const imagem = await createImageBitmap(arquivo);
  const lado = Math.min(imagem.width, imagem.height);
  const canvas = document.createElement("canvas");
  canvas.width = tamanho;
  canvas.height = tamanho;
  canvas
    .getContext("2d")
    ?.drawImage(imagem, (imagem.width - lado) / 2, (imagem.height - lado) / 2, lado, lado, 0, 0, tamanho, tamanho);
  imagem.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function formatarTelefone(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return telefone;
}

export function separarTopicos(texto: string) {
  return texto
    .split("\n")
    .map((linha) => linha.replace(/^[\s?\-*]+/, "").trim())
    .filter(Boolean);
}

export function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}
