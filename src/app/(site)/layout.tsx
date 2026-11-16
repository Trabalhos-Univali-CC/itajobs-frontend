import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SessionProvider } from "@/features/auth/components/SessionProvider";
import { exigirUsuario } from "@/lib/sessao";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const usuario = await exigirUsuario();
  return (
    <SessionProvider usuario={usuario}>
      <Header />
      {children}
      <Footer />
    </SessionProvider>
  );
}
