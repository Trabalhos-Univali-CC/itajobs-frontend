import { LuCircleAlert } from "react-icons/lu";

import { Alert, AlertDescription } from "@/components/ui/alert";

export function FormErrorAlert({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <Alert
      variant="destructive"
      className="animate-in border-destructive/30 bg-destructive/5 px-3 py-2.5 duration-200 fade-in-0 slide-in-from-top-1 motion-reduce:animate-none"
    >
      <LuCircleAlert />
      <AlertDescription className="text-pretty">{message}</AlertDescription>
    </Alert>
  );
}
