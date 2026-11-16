"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LuCamera, LuUpload, LuUserRound } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useRascunhoCurriculo } from "../rascunhoCurriculo";

type PhotoFieldProps = { imagem: string | null };

export function PhotoField({ imagem }: PhotoFieldProps) {
  const { alterar } = useRascunhoCurriculo();
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  return (
    <div className="flex shrink-0 flex-col items-center gap-3 text-center sm:w-36">
      <button type="button" disabled={enviando} onClick={() => inputRef.current?.click()} aria-label={imagem ? "Trocar foto" : "Enviar foto"} className="group relative flex size-32 items-center justify-center overflow-hidden rounded-full bg-muted ring-4 ring-secondary ring-offset-4 ring-offset-card outline-none focus-visible:ring-primary disabled:cursor-not-allowed">
        {imagem ? <Image src={imagem} alt="Sua foto" fill unoptimized className="object-cover" /> : <LuUserRound className="size-14 text-muted-foreground/70" />}
        <span className="absolute inset-0 flex items-center justify-center bg-primary/65 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"><LuCamera className="size-7" /></span>
      </button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Arquivo da foto" tabIndex={-1} className="sr-only" disabled={enviando} onChange={async (event) => {
        const arquivo = event.target.files?.[0];
        event.target.value = "";
        if (!arquivo || enviando) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type) || arquivo.size > 2 * 1024 * 1024) { setErro("Envie uma foto JPG, PNG ou WebP de até 2 MB."); return; }
        setEnviando(true);
        setErro(null);
        try {
          const dados = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error("Não foi possível ler a foto."));
            reader.readAsDataURL(arquivo);
          });
          alterar((estado) => ({ ...estado, foto: { dados, nome: arquivo.name, contentType: arquivo.type } }));
        } catch (error) { setErro(error instanceof Error ? error.message : "Não foi possível enviar a foto."); }
        finally { setEnviando(false); }
      }} />
      <div className="mt-3 flex flex-wrap justify-center gap-1">
        <Button type="button" variant="outline" size="sm" disabled={enviando} onClick={() => inputRef.current?.click()}><LuUpload />{enviando ? "Preparando..." : imagem ? "Trocar" : "Enviar foto"}</Button>
        {imagem && <Button type="button" variant="ghost" size="sm" disabled={enviando} onClick={() => { alterar((estado) => ({ ...estado, foto: null })); setErro(null); }}>Remover</Button>}
      </div>
      <p className="text-xs text-muted-foreground">Opcional · JPG, PNG ou WebP · até 2 MB</p>
      {erro && <p role="alert" className="text-xs text-destructive">{erro}</p>}
    </div>
  );
}
