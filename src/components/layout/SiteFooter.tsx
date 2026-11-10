import Link from "next/link";
import { LuMapPin } from "react-icons/lu";

import { ItajobsLogo } from "@/components/brand/ItajobsLogo";

const colunas = [
  {
    titulo: "Para candidatos",
    links: [
      { href: "/", label: "Buscar vagas" },
      { href: "/curriculo", label: "Meu currículo" },
      { href: "/candidaturas", label: "Minhas candidaturas" },
      { href: "/cadastro/candidato", label: "Criar conta de candidato" },
    ],
  },
  {
    titulo: "Para empresas",
    links: [
      { href: "/painel/vagas", label: "Painel de vagas" },
      { href: "/painel/vagas/nova", label: "Publicar uma vaga" },
      { href: "/cadastro/empresa", label: "Cadastrar empresa" },
    ],
  },
  {
    titulo: "Acesso",
    links: [
      { href: "/login", label: "Entrar" },
      { href: "/cadastro/candidato", label: "Criar conta" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative bg-primary text-white/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-14 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" aria-label="ItaJobs, página inicial" className="inline-flex items-center gap-3">
            <ItajobsLogo className="w-12" />
            <ItajobsLogo variant="wordmark" className="text-xl text-white" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Conectamos quem procura trabalho às empresas de Itajaí, do porto ao comércio, da saúde à tecnologia.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-white/60">
            <LuMapPin className="size-4 text-secondary" />
            Itajaí, Santa Catarina
          </p>
        </div>

        {colunas.map((coluna) => (
          <nav key={coluna.titulo} aria-label={coluna.titulo}>
            <h2 className="text-sm font-semibold text-white">{coluna.titulo}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {coluna.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm transition-colors duration-200 hover:text-secondary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-6 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ItaJobs. Todos os direitos reservados.</p>
          <p>Projeto acadêmico · Engenharia de Software II · UNIVALI</p>
        </div>
      </div>
    </footer>
  );
}
