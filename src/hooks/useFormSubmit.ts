"use client";

import { useState, useTransition, type FormEvent } from "react";

export class CampoInvalido extends Error {
  constructor(
    readonly campo: string,
    message: string,
  ) {
    super(message);
  }
}

type Falha = {
  id: number;
  mensagem: string;
  campo: string | null;
};

export function useFormSubmit(acao: (form: FormData) => Promise<void>) {
  const [falha, setFalha] = useState<Falha | null>(null);
  const [enviando, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFalha(null);
    startTransition(async () => {
      try {
        await acao(form);
      } catch (error) {
        setFalha({
          id: Date.now(),
          mensagem: error instanceof Error ? error.message : "Não foi possível concluir a operação.",
          campo: error instanceof CampoInvalido ? error.campo : null,
        });
      }
    });
  }

  return { erro: falha?.mensagem ?? null, falha, enviando, onSubmit, limparErro: () => setFalha(null) };
}
