import * as React from "react";
import { CheckSquareIcon, XIcon } from "@phosphor-icons/react";

import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

function BulkActionBar({
  selectedCount,
  onClear,
  children,
  className,
  label,
  ...props
}: React.ComponentProps<"div"> & {
  selectedCount: number;
  onClear?: () => void;
  label?: (count: number) => React.ReactNode;
}) {
  if (selectedCount <= 0) return null;

  return (
    <div
      data-slot="bulk-action-bar"
      role="toolbar"
      aria-label="Ações para itens selecionados"
      className={cn(
        "flex w-full flex-wrap items-center gap-2 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2 px-1 text-sm font-medium">
        <CheckSquareIcon className="shrink-0 text-primary" />
        <span className="truncate">
          {label?.(selectedCount) ?? `${selectedCount} selecionado(s)`}
        </span>
      </div>
      <div
        data-slot="bulk-action-bar-actions"
        className="ml-auto flex flex-wrap items-center gap-1"
      >
        {children}
        {onClear ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Limpar seleção"
            onClick={onClear}
          >
            <XIcon />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export { BulkActionBar };
