import type { IconType } from "react-icons";
import { LuBuilding2, LuUserRound } from "react-icons/lu";

import type { TipoUsuario } from "@/types/usuario";

type AccountTypeOption = {
  id: string;
  label: string;
  tipo: TipoUsuario;
  icon: IconType;
  home: string;
  signup: string;
};

export const accountTypes = [
  { id: "empregado", label: "Empregado", tipo: "candidato", icon: LuUserRound, home: "/", signup: "/cadastro/candidato" },
  { id: "contratante", label: "Contratante", tipo: "empresa", icon: LuBuilding2, home: "/painel/vagas", signup: "/cadastro/empresa" },
] as const satisfies readonly AccountTypeOption[];

export type AccountType = (typeof accountTypes)[number]["id"];
