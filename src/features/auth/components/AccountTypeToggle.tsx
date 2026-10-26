"use client";

import { accountTypes, type AccountType } from "@/features/auth/AccountTypes";
import { cn } from "@/lib/Utils";

type AccountTypeToggleProps = {
  value: AccountType;
  onChange: (value: AccountType) => void;
};

export function AccountTypeToggle({ value, onChange }: AccountTypeToggleProps) {
  const selectedIndex = accountTypes.findIndex((type) => type.id === value);

  return (
    <div role="radiogroup" aria-label="Tipo de conta" className="relative grid grid-cols-2 rounded-xl bg-muted p-1">
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-primary shadow-md transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(${selectedIndex * 100}%)` }}
      />
      {accountTypes.map(({ id, label, icon: Icon }) => {
        const selected = id === value;

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(id)}
            className={cn(
              "relative z-10 flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-secondary",
              selected ? "text-primary-foreground" : "text-muted-foreground hover:text-card-foreground",
            )}
          >
            <Icon
              aria-hidden
              className={cn(
                "size-4 transition-transform duration-300 motion-reduce:transition-none",
                selected && "scale-110 text-secondary",
              )}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
