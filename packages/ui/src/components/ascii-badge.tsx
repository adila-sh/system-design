import * as React from "react";

import { cn } from "@/lib/utils";

type AsciiBadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "destructive"
  | "error"
  | "info";

const SYMBOLS: Record<AsciiBadgeVariant, string> = {
  default: "◉",
  success: "●",
  warning: "◆",
  destructive: "✕",
  error: "✕",
  info: "◈",
};

const VARIANT_CLASSES: Record<AsciiBadgeVariant, string> = {
  default: "text-muted-foreground",
  success: "text-success-tint-foreground",
  warning: "text-warning-tint-foreground",
  destructive: "text-destructive-tint-foreground",
  error: "text-destructive-tint-foreground",
  info: "text-primary-tint-foreground",
};

type AsciiBadgeProps = React.ComponentProps<"span"> & {
  label: string;
  variant?: AsciiBadgeVariant;
  showSymbol?: boolean;
  /** @deprecated Use `showSymbol`. */
  dot?: boolean;
};

function AsciiBadge({
  label,
  variant = "default",
  showSymbol = true,
  dot,
  className,
  ...props
}: AsciiBadgeProps) {
  return (
    <span
      data-slot="ascii-badge"
      data-variant={variant}
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-muted-foreground/50">
        [
      </span>
      {(dot ?? showSymbol) ? (
        <span aria-hidden="true">{SYMBOLS[variant]}</span>
      ) : null}
      <span>{label}</span>
      <span aria-hidden="true" className="text-muted-foreground/50">
        ]
      </span>
    </span>
  );
}

export { AsciiBadge };
export type { AsciiBadgeProps, AsciiBadgeVariant };
