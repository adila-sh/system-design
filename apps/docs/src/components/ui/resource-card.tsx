import * as React from "react";

import { cn } from "@/lib/utils";

function ResourceCard({
  className,
  ...props
}: React.ComponentProps<"article">) {
  return (
    <article
      data-slot="resource-card"
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:border-foreground/20",
        className,
      )}
      {...props}
    />
  );
}

function ResourceCardHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="resource-card-header"
      className={cn("flex min-w-0 items-start gap-3", className)}
      {...props}
    />
  );
}

function ResourceCardIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="resource-card-icon"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function ResourceCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="resource-card-content"
      className={cn("min-w-0 flex-1 space-y-1", className)}
      {...props}
    />
  );
}

function ResourceCardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="resource-card-title"
      className={cn("truncate text-sm font-semibold", className)}
      {...props}
    />
  );
}

function ResourceCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="resource-card-description"
      className={cn("text-sm leading-5 text-muted-foreground", className)}
      {...props}
    />
  );
}

function ResourceCardMeta({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="resource-card-meta"
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function ResourceCardActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="resource-card-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  );
}

export {
  ResourceCard,
  ResourceCardActions,
  ResourceCardContent,
  ResourceCardDescription,
  ResourceCardHeader,
  ResourceCardIcon,
  ResourceCardMeta,
  ResourceCardTitle,
};
