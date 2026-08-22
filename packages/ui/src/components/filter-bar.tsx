import * as React from "react";

import { cn } from "@/lib/utils";

function FilterBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="filter-bar"
      role="search"
      className={cn(
        "flex w-full flex-col gap-2 rounded-md border bg-card p-3 sm:flex-row sm:items-center",
        className,
      )}
      {...props}
    />
  );
}

function FilterBarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="filter-bar-group"
      className={cn(
        "flex min-w-0 flex-1 flex-wrap items-center gap-2",
        className,
      )}
      {...props}
    />
  );
}

function FilterBarActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="filter-bar-actions"
      className={cn(
        "flex shrink-0 items-center gap-2 border-t pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3",
        className,
      )}
      {...props}
    />
  );
}

function FilterBarResults({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="filter-bar-results"
      aria-live="polite"
      className={cn("text-xs text-muted-foreground tabular-nums", className)}
      {...props}
    />
  );
}

export { FilterBar, FilterBarActions, FilterBarGroup, FilterBarResults };
