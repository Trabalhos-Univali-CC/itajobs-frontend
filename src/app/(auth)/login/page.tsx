import { AuthBackground } from "@/features/auth/components/AuthBackground";
import { LoginCard } from "@/features/auth/components/LoginCard";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center bg-neutral-950 px-4 py-10">
      <AuthBackground />
      <LoginCard />
    </main>
  );
}
