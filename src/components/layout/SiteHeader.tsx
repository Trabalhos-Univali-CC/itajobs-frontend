"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { LuBriefcaseBusiness, LuCirclePlus, LuFileText, LuSearch, LuSend } from "react-icons/lu";

import { ItajobsLogo } from "@/components/brand/ItajobsLogo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/utils";

type HeaderNavLink = {
  href: string;
  label: string;
  icon: IconType;
};

const links: HeaderNavLink[] = [
  { href: "/", label: "Vagas", icon: LuSearch },
  { href: "/cadastros", label: "Cadastros", icon: LuFileText },
  { href: "/curriculo", label: "Currículo", icon: LuFileText },
  { href: "/candidaturas", label: "Candidaturas", icon: LuSend },
  { href: "/painel/vagas", label: "Painel", icon: LuBriefcaseBusiness },
  { href: "/painel/vagas/nova", label: "Publicar", icon: LuCirclePlus },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [rolado, setRolado] = useState(false);

  useEffect(() => {
    const atualizar = () => setRolado(window.scrollY > 8);
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    return () => window.removeEventListener("scroll", atualizar);
  }, []);

  const ativo = links
    .filter(({ href }) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const navegacaoPrincipal = (
    <nav aria-label="Navegação principal">
      <ul className="flex w-max items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const atual = href === ativo;

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={atual ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-300 outline-none focus-visible:ring-3",
                  rolado
                    ? atual
                      ? "bg-accent text-primary focus-visible:ring-ring/30"
                      : "text-muted-foreground hover:bg-muted hover:text-primary focus-visible:ring-ring/30"
                    : atual
                      ? "bg-white/15 text-white focus-visible:ring-white/40"
                      : "text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/40",
                )}
              >
                <Icon className={cn("size-4", atual && (rolado ? "text-primary" : "text-secondary"))} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const acoes = (
    <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "h-9 px-3.5 font-semibold")}>
      Consultar cadastro
    </Link>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        rolado ? "border-border bg-white/95 shadow-sm backdrop-blur-md" : "border-transparent bg-primary",
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" aria-label="ItaJobs, página inicial" className="flex shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/30">
          <ItajobsLogo priority className="w-11" />
          <ItajobsLogo variant="wordmark" className={cn("text-lg transition-colors duration-300", rolado ? "text-primary" : "text-white")} />
        </Link>
        {links.length > 0 && (
          <div className="hidden xl:block">
            {navegacaoPrincipal}
          </div>
        )}
        {acoes}
      </div>
      {links.length > 0 && (
        <div className="mx-auto max-w-6xl overflow-x-auto px-6 pb-3 scrollbar-none xl:hidden">
          {navegacaoPrincipal}
        </div>
      )}
    </header>
  );
}
