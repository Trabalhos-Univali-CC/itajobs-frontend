import type { IconType } from "react-icons";
import { LuBuilding2, LuUserRound } from "react-icons/lu";

type AccountTypeOption = {
  id: string;
  label: string;
  icon: IconType;
  home: string;
  signup: string;
};

export const accountTypes = [
  { id: "empregado", label: "Empregado", icon: LuUserRound, home: "/", signup: "/cadastro/candidato" },
  { id: "contratante", label: "Contratante", icon: LuBuilding2, home: "/painel/vagas", signup: "/cadastro/empresa" },
] as const satisfies readonly AccountTypeOption[];

export type AccountType = (typeof accountTypes)[number]["id"];
