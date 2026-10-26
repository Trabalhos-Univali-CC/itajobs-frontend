import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/Utils";

type GoogleSignInButtonProps = {
  href: string;
};

export function GoogleSignInButton({ href }: GoogleSignInButtonProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 w-full")}>
      <FcGoogle className="size-4.5 transition-transform duration-300 group-hover/button:scale-110 group-hover/button:-rotate-12" />
      Continuar com Google
    </Link>
  );
}
