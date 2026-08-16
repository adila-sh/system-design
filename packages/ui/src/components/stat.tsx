import * as React from "react";

import { cn } from "@/lib/utils";

function StatGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-group"
      className={cn(
        "grid grid-cols-1 divide-y overflow-hidden rounded-lg border bg-card text-card-foreground sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
}

function Stat({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat"
      className={cn("flex min-w-0 flex-col gap-3 p-5", className)}
      {...props}
    />
  );
}

function StatHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-header"
      className={cn("flex items-start justify-between gap-3", className)}
      {...props}
    />
  );
}

function StatLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-label"
      className={cn("text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

function StatIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-icon"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function StatValue({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-value"
      className={cn(
        "truncate text-2xl font-semibold tracking-tight tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

function StatFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-footer"
      className={cn("flex flex-wrap items-center gap-2 text-xs", className)}
      {...props}
    />
  );
}

function StatTrend({
  className,
  trend = "neutral",
  ...props
}: React.ComponentProps<"span"> & {
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <span
      data-slot="stat-trend"
      data-trend={trend}
      className={cn(
        "inline-flex items-center gap-1 font-medium tabular-nums data-[trend=down]:text-destructive-tint-foreground data-[trend=neutral]:text-muted-foreground data-[trend=up]:text-success-tint-foreground [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}

function StatDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="stat-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Stat,
  StatDescription,
  StatFooter,
  StatGroup,
  StatHeader,
  StatIcon,
  StatLabel,
  StatTrend,
  StatValue,
};
