"use client";

import { useRef, useState, type ReactElement, type ReactNode } from "react";
import { LuCircleAlert, LuCircleHelp, LuLoaderCircle, LuTriangleAlert, LuX } from "react-icons/lu";
import { cn } from "@/utils/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ConfirmationDialogProps = {
  trigger: ReactElement;
  title: string;
  description: string;
  confirmLabel?: string;
  pendingLabel?: string;
  warning?: string;
  variant?: "default" | "destructive";
  children?: ReactNode;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmationDialog({ trigger, title, description, confirmLabel = "Confirmar", pendingLabel = "Processando...", warning, variant = "default", children, onConfirm }: ConfirmationDialogProps) {
  const [aberto, setAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const cancelarRef = useRef<HTMLButtonElement>(null);
  const destrutivo = variant === "destructive";
  const Icon = destrutivo ? LuTriangleAlert : LuCircleHelp;

  return (
    <Dialog open={aberto} disablePointerDismissal={enviando} onOpenChange={(novo, detalhes) => {
      if (enviando) { detalhes.cancel(); return; }
      setAberto(novo);
      setErro(null);
    }}>
      <DialogTrigger render={trigger} />
      <DialogContent initialFocus={cancelarRef} showCloseButton={false} className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto rounded-2xl border border-primary/15 p-0 shadow-2xl shadow-primary/15 sm:max-w-lg">
        <DialogHeader className="relative gap-0 border-b-4 border-secondary bg-primary px-6 pt-6 pb-5 text-primary-foreground">
          <div className="flex items-start gap-3.5 pr-7">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-secondary"><Icon aria-hidden className="size-5" /></span>
            <div className="min-w-0"><p className="text-[11px] font-semibold tracking-[0.18em] text-secondary uppercase">Confirmação</p><DialogTitle className="mt-1 text-xl leading-snug font-semibold text-primary-foreground">{title}</DialogTitle></div>
          </div>
          <DialogDescription className="mt-4 leading-relaxed text-primary-foreground/80">{description}</DialogDescription>
          <DialogClose disabled={enviando} aria-label="Fechar" render={<Button type="button" variant="ghost" size="icon-sm" className="absolute top-3 right-3 rounded-full text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/40" />}><LuX aria-hidden className="size-4" /></DialogClose>
        </DialogHeader>
        {(children || warning || erro) && <div className="flex flex-col gap-4 px-6 py-5">
          {children}
          {warning && <div role="note" className={cn("flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm leading-relaxed", destrutivo ? "border-destructive/20 bg-destructive/5 text-destructive" : "border-border bg-muted/50 text-muted-foreground")}><LuCircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" /><p>{warning}</p></div>}
          {erro && <Alert variant="destructive" className="border-destructive/20"><LuCircleAlert aria-hidden /><AlertDescription>{erro}</AlertDescription></Alert>}
        </div>}
        <DialogFooter className="mx-0 mb-0 grid grid-cols-1 gap-3 rounded-b-2xl border-primary/10 bg-muted/30 px-6 py-4 sm:grid-cols-2">
          <DialogClose disabled={enviando} render={<Button ref={cancelarRef} type="button" variant="outline" className="order-2 w-full sm:order-1" />}>Cancelar</DialogClose>
          <Button type="button" variant={variant} disabled={enviando} aria-busy={enviando} className={cn("order-1 w-full sm:order-2", destrutivo && "bg-destructive text-white hover:bg-destructive/90")} onClick={async () => {
            if (enviando) return;
            setEnviando(true);
            setErro(null);
            try { await onConfirm(); setAberto(false); }
            catch (error) { setErro(error instanceof Error ? error.message : "Não foi possível concluir a ação. Tente novamente."); }
            finally { setEnviando(false); }
          }}>{enviando && <LuLoaderCircle aria-hidden className="size-4 animate-spin" />}{enviando ? pendingLabel : confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
