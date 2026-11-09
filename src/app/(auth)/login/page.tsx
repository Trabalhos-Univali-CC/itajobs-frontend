import { PortScene } from "@/components/port-scene/PortScene";
import { LoginCard } from "@/features/auth/components/LoginCard";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center bg-neutral-950 px-4 py-10">
      <div aria-hidden className="fixed inset-0">
        <PortScene className="scale-[1.02] blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.25),rgba(10,10,10,0.7))]" />
      </div>
      <LoginCard />
    </main>
  );
}
