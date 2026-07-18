import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

function ApiRequest({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="api-request"
      className={cn("overflow-hidden rounded-lg border bg-card", className)}
      {...props}
    />
  );
}

function ApiRequestHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="api-request-header"
      className={cn(
        "flex flex-wrap items-center gap-2 border-b p-3",
        className,
      )}
      {...props}
    />
  );
}

const apiMethodVariants = cva(
  "rounded px-2 py-1 font-mono text-xs font-semibold",
  {
    variants: {
      method: {
        GET: "bg-primary/10 text-primary",
        POST: "bg-success/10 text-success",
        PUT: "bg-warning/15 text-warning-foreground dark:text-warning",
        PATCH: "bg-warning/15 text-warning-foreground dark:text-warning",
        DELETE: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: { method: "GET" },
  },
);

function ApiRequestMethod({
  className,
  method = "GET",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof apiMethodVariants>) {
  return (
    <span
      data-slot="api-request-method"
      className={cn(apiMethodVariants({ method }), className)}
      {...props}
    >
      {props.children ?? method}
    </span>
  );
}

function ApiRequestUrl({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="api-request-url"
      className={cn("min-w-0 flex-1 truncate font-mono text-xs", className)}
      {...props}
    />
  );
}

function ApiRequestMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="api-request-meta"
      className={cn(
        "ml-auto flex items-center gap-2 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function ApiRequestSection({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="api-request-section"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function ApiRequestSectionHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="api-request-section-header"
      className={cn(
        "flex min-h-9 items-center justify-between gap-2 px-3",
        className,
      )}
      {...props}
    />
  );
}

function ApiRequestSectionTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="api-request-section-title"
      className={cn("text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

function ApiRequestCode({
  value,
  className,
  ...props
}: Omit<React.ComponentProps<"pre">, "children"> & { value: string }) {
  return (
    <div className="relative border-t bg-muted/30">
      <CopyButton
        value={value}
        variant="ghost"
        size="icon-xs"
        aria-label="Copiar conteúdo"
        className="absolute top-2 right-2"
      />
      <pre
        data-slot="api-request-code"
        className={cn(
          "overflow-x-auto p-3 pr-11 font-mono text-xs leading-5",
          className,
        )}
        {...props}
      >
        <code>{value}</code>
      </pre>
    </div>
  );
}

export {
  ApiRequest,
  ApiRequestCode,
  ApiRequestHeader,
  ApiRequestMeta,
  ApiRequestMethod,
  ApiRequestSection,
  ApiRequestSectionHeader,
  ApiRequestSectionTitle,
  ApiRequestUrl,
  apiMethodVariants,
};
