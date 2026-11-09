"use client";

import { useState } from "react";
import { LuCheck, LuFileText, LuShieldCheck } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TermoDeUsoDialog({ onAccept }: { onAccept: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger type="button" className="cursor-pointer font-medium text-primary underline underline-offset-4 hover:decoration-secondary">
        termos de uso e a política de privacidade
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold">Termos de uso e política de privacidade</DialogTitle>
          <DialogDescription>Leia com atenção. Para criar sua conta no ItaJobs é preciso aceitar os dois documentos.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[min(60vh,28rem)]">
          <div className="flex flex-col gap-8 px-6 py-5">
            <section className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-base font-semibold text-primary">
                <LuFileText className="size-4.5" />
                Termos de uso
              </h3>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">1. Sobre o ItaJobs</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  O ItaJobs é uma plataforma que conecta candidatos e empresas da cidade de Itajaí (SC). O uso é gratuito e exclusivo
                  para pessoas que moram em Itajaí e para empresas com endereço no município.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">2. Cadastro e conta</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Você se compromete a informar dados verdadeiros e atualizados e a não cadastrar dados de terceiros sem autorização.
                  Cada CPF ou CNPJ pode ter apenas um cadastro. O acesso por ID ainda não autentica a identidade do usuário.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">3. Uso para candidatos</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  O candidato pode montar o currículo, buscar vagas e se candidatar. As informações do currículo ficam visíveis para as
                  empresas das vagas em que você se candidatar.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">4. Uso para empresas</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  A empresa pode publicar vagas reais, com descrição clara e sem exigências discriminatórias. Os dados dos candidatos só
                  podem ser usados para o processo seletivo da vaga.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">5. Condutas proibidas</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Não é permitido publicar vagas falsas, cobrar taxas de candidatos, enviar conteúdo ofensivo ou usar a plataforma para
                  fins diferentes da busca e oferta de emprego. Contas que descumprirem estas regras podem ser suspensas.
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className="flex items-center gap-2 text-base font-semibold text-primary">
                <LuShieldCheck className="size-4.5" />
                Política de privacidade
              </h3>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">1. Dados que coletamos</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Nome, CPF ou CNPJ, e-mail, telefone, endereço e as informações que você incluir no currículo ou nas vagas.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">2. Como usamos os dados</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Usamos seus dados para criar seu cadastro, listar vagas e candidatos e permitir o contato entre candidatos e
                  empresas. Não vendemos seus dados.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">3. Compartilhamento</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Na versão atual, cadastros e currículos podem ser consultados sem autenticação. Os dados da empresa aparecem
                  junto das vagas que ela publicar. Cadastre apenas informações autorizadas para consulta.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">4. Seus direitos</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode acessar, corrigir ou pedir a exclusão dos seus
                  dados a qualquer momento pelo seu cadastro.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-card-foreground">5. Segurança</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Esta versão ainda não oferece login nem controle de acesso por usuário. A consulta por ID permite acessar
                  os registros existentes e não substitui autenticação.
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="mx-0 mb-0 px-6 py-4">
          <DialogClose render={<Button variant="outline" />}>Fechar</DialogClose>
          <Button
            type="button"
            onClick={() => {
              onAccept();
              setOpen(false);
            }}
          >
            <LuCheck />
            Li e aceito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
