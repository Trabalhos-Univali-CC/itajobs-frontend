import { PortScene } from "@/components/port-scene/PortScene";

export function AuthBackground() {
  return (
    <div aria-hidden className="fixed inset-0">
      <PortScene className="scale-[1.02] blur-[2px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.25),rgba(10,10,10,0.7))]" />
    </div>
  );
}
