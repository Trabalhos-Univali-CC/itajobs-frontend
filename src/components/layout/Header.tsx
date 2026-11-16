"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { LuBriefcaseBusiness, LuBuilding2, LuChevronDown, LuCirclePlus, LuFileText, LuLoaderCircle, LuLogOut, LuSearch, LuSettings, LuUserRound, LuUsersRound } from "react-icons/lu";

import { ItajobsLogo } from "@/components/brand/ItajobsLogo";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUsuario } from "@/features/auth/sessionContext";
import { post } from "@/lib/api";
import { cn } from "@/utils/utils";

type HeaderNavLink = {
  href: string;
  label: string;
  icon: IconType;
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const usuario = useUsuario();
  const links: HeaderNavLink[] = [
    { href: "/", label: "Vagas", icon: LuSearch },
    { href: "/cadastros", label: usuario.tipo === "empresa" ? "Candidatos" : "Avaliações de empresas", icon: usuario.tipo === "empresa" ? LuUsersRound : LuBuilding2 },
    ...(usuario.tipo === "empresa" ? [{ href: "/painel/vagas/nova", label: "Publicar", icon: LuCirclePlus }] : []),
  ];
  const linksPerfil: HeaderNavLink[] = [
    { href: `/cadastros/${usuario.tipo}/${usuario.id}`, label: "Meu perfil", icon: LuUserRound },
    ...(usuario.tipo === "candidato" ? [
      { href: "/curriculo", label: "Currículo", icon: LuFileText },
    ] : [
      { href: "/painel/empresa", label: "Minha empresa", icon: LuBuilding2 },
      { href: "/painel/vagas", label: "Painel", icon: LuBriefcaseBusiness },
    ]),
  ];
  const [rolado, setRolado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuAzul = rolado && menuAberto;
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const atualizar = () => setRolado(window.scrollY > 8);
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    return () => window.removeEventListener("scroll", atualizar);
  }, []);

  const ativo = links
    .filter(({ href }) => (href === "/" ? pathname === "/" : href === "/cadastros" ? pathname === href || pathname.startsWith(`/cadastros/${usuario.tipo === "empresa" ? "candidato" : "empresa"}/`) || (usuario.tipo === "empresa" && pathname.startsWith("/painel/candidatos/")) : pathname === href || pathname.startsWith(`${href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const navegacaoPrincipal = (
    <nav aria-label="Navegação principal" className="max-w-full">
      <ul className="flex items-stretch justify-center gap-2 sm:gap-4">
        {links.map(({ href, label, icon: Icon }) => {
          const atual = href === ativo;

          return (
            <li key={href} className="min-w-0">
              <Link
                href={href}
                aria-current={atual ? "page" : undefined}
                className={cn(
                  "group/header-link flex items-center text-sm font-semibold transition-colors duration-300 ease-out outline-none focus-visible:ring-3 motion-reduce:transition-none",
                  "relative isolate h-full min-h-12 min-w-11 justify-center gap-2 rounded-md px-1.5 py-2.5 text-center before:absolute before:inset-x-0 before:top-1 before:bottom-2 before:-z-10 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 before:ease-out before:content-[''] after:absolute after:bottom-0.5 after:left-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:scale-x-0 after:rounded-full after:opacity-0 after:transition-[scale,opacity,width,background-color] after:duration-300 after:ease-out after:content-[''] hover:before:opacity-100 hover:after:w-10 hover:after:scale-x-100 hover:after:opacity-100 focus-visible:before:opacity-100 focus-visible:after:w-10 focus-visible:after:scale-x-100 focus-visible:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none sm:gap-2.5 sm:px-6",
                  usuario.tipo === "empresa" && "max-sm:flex-col max-sm:gap-1 max-sm:px-1",
                  rolado ? "before:bg-primary/12" : "before:bg-white/20",
                  rolado
                    ? atual
                      ? "text-primary focus-visible:ring-ring/30"
                      : "text-muted-foreground hover:text-primary focus-visible:ring-ring/30"
                    : atual
                      ? "text-white focus-visible:ring-white/40"
                      : "text-white/70 hover:text-white focus-visible:ring-white/40",
                  atual
                    ? rolado ? "after:scale-x-100 after:bg-primary after:opacity-100" : "after:scale-x-100 after:bg-secondary after:opacity-100"
                    : rolado ? "after:bg-primary/50" : "after:bg-secondary/65",
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center">
                  <Icon className={cn("size-4 shrink-0 transition-colors duration-300 ease-out motion-reduce:transition-none", atual && (rolado ? "text-primary" : "text-secondary"), !atual && (rolado ? "group-hover/header-link:text-primary group-focus-visible/header-link:text-primary" : "group-hover/header-link:text-secondary group-focus-visible/header-link:text-secondary"))} />
                </span>
                <span className="min-w-0 leading-snug">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const acoes = (
    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
      <DropdownMenu open={menuAberto} onOpenChange={setMenuAberto}>
        <DropdownMenuTrigger
          aria-label={`Abrir menu de ${usuario.nome}`}
          render={<Button type="button" variant="ghost" />}
          className={cn("grid h-12 w-44 min-w-0 grid-cols-[2.25rem_minmax(0,1fr)_1rem] gap-3 rounded-2xl px-3 py-1 aria-expanded:rounded-b-none aria-expanded:border-b-transparent aria-expanded:bg-clip-border aria-expanded:backdrop-blur-md sm:w-52", menuAzul ? "border-primary/20 bg-primary/85 text-white/90 hover:bg-primary/85 hover:text-white aria-expanded:bg-primary/85 aria-expanded:text-white/90 aria-expanded:hover:bg-primary/85 aria-expanded:hover:text-white focus-visible:ring-primary/20" : rolado ? "border-primary/10 bg-primary/3 text-primary/80 hover:bg-primary/5 hover:text-primary focus-visible:ring-primary/20" : "border-white/10 bg-white/4 text-white/75 hover:bg-white/8 hover:text-white aria-expanded:bg-white/10 aria-expanded:text-white/85 aria-expanded:hover:bg-white/10 aria-expanded:hover:text-white focus-visible:ring-white/30")}
        >
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background/75 text-sm font-medium text-primary/75 ring-1 ring-secondary/70">
            {usuario.foto ? <Image src={usuario.foto} width={36} height={36} alt="" unoptimized className="size-full object-cover" onError={() => usuario.setFoto(null)} /> : usuario.nome.trim().charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 truncate text-left text-sm font-medium">{usuario.nome}</span>
          <LuChevronDown aria-hidden className="size-3.5 shrink-0 justify-self-center opacity-50 group-aria-expanded/button:rotate-180" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={0} className={cn("min-w-0 rounded-t-none rounded-b-2xl border border-t-0 p-0 text-white/85 shadow-[0_12px_24px_-12px_rgb(24_24_27/0.15)] ring-0 backdrop-blur-md data-open:animate-none data-closed:animate-none", menuAzul ? "border-primary/20 bg-primary/85" : "border-white/10 bg-white/10")}>
          <div className="space-y-1 p-1.5">
          {linksPerfil.map(({ href, label, icon: Icon }) => <DropdownMenuItem key={href} render={<Link href={href} />} aria-current={pathname === href ? "page" : undefined} className="grid min-h-11 cursor-pointer grid-cols-[2.25rem_minmax(0,1fr)] gap-3 rounded-lg px-1.5 py-1 font-normal text-white/85 focus:bg-white/10 focus:text-white aria-[current=page]:bg-white/10 not-data-[variant=destructive]:focus:**:text-white">
            <span className="flex size-9 items-center justify-center"><Icon aria-hidden className="size-4" /></span><span className="min-w-0 truncate">{label}</span>
          </DropdownMenuItem>)}
          </div>
          <DropdownMenuItem variant="destructive" closeOnClick={false} disabled={saindo} aria-busy={saindo} className="grid min-h-12 w-full cursor-pointer grid-cols-[2.25rem_minmax(0,1fr)] gap-3 rounded-none border-t border-red-300/20 px-3 py-1.5 font-medium transition-colors data-[variant=destructive]:bg-red-950/80 data-[variant=destructive]:text-red-200 data-[variant=destructive]:focus:bg-red-900/85 data-[variant=destructive]:focus:text-red-100" onClick={async () => {
            setSaindo(true);
            setErro(null);
            try { await post("/api/auth/logout", {}); router.replace("/login"); router.refresh(); }
            catch (error) { setErro(error instanceof Error ? error.message : "Não foi possível sair."); setSaindo(false); }
          }}>
            <span className="flex size-9 items-center justify-center">{saindo ? <LuLoaderCircle aria-hidden className="size-4 animate-spin" /> : <LuLogOut aria-hidden className="size-4" />}</span><span className="min-w-0 truncate">{saindo ? "Saindo..." : "Sair"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link href={`/cadastros/${usuario.tipo}/${usuario.id}`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full", rolado ? "border-primary/10 bg-primary/3 text-primary/70 hover:bg-primary/8 hover:text-primary focus-visible:ring-primary/20" : "border-white/10 bg-white/4 text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-white/30")} aria-label="Configurações da conta" title="Configurações da conta"><LuSettings aria-hidden /></Link>
    </div>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        rolado ? "border-border bg-white/95 shadow-sm backdrop-blur-md" : "border-transparent bg-primary",
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="ItaJobs, página inicial" className="flex shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/30">
          <ItajobsLogo priority className="w-11" />
          <ItajobsLogo variant="wordmark" className={cn("hidden text-lg transition-colors duration-300 sm:inline", rolado ? "text-primary" : "text-white")} />
        </Link>
        {links.length > 0 && (
          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            {navegacaoPrincipal}
          </div>
        )}
        {acoes}
      </div>
      {erro && <p role="alert" className="mx-auto max-w-6xl px-6 py-2 text-sm text-destructive">{erro}</p>}
      {links.length > 0 && (
        <div className="mx-auto flex max-w-6xl justify-center px-4 pb-3 sm:px-6 lg:hidden">
          {navegacaoPrincipal}
        </div>
      )}
    </header>
  );
}
