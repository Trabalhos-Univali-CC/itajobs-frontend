import { AccountTypeCards } from "@/features/auth/components/AccountTypeCards";
import { SignupFormCard } from "@/features/auth/components/SignupFormCard";
import { SignupHeader } from "@/features/auth/components/SignupHeader";
import { SignupSteps } from "@/features/auth/components/SignupSteps";

export default function CadastroLayout({ children }: LayoutProps<"/cadastro">) {
  return (
    <main className="min-h-screen flex-1 bg-background pb-16">
      <SignupHeader />
      <div className="relative z-10 mx-auto mt-4 flex max-w-5xl flex-col gap-6 px-6">
        <SignupSteps className="justify-start" />
        <AccountTypeCards />
        <SignupFormCard>{children}</SignupFormCard>
      </div>
    </main>
  );
}
