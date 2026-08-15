import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { CodeBlock } from "@/components/code-block";
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
        GET: "bg-primary-tint text-primary-tint-foreground",
        POST: "bg-success-tint text-success-tint-foreground",
        PUT: "bg-warning-tint text-warning-tint-foreground",
        PATCH: "bg-warning-tint text-warning-tint-foreground",
        DELETE: "bg-destructive-tint text-destructive-tint-foreground",
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
  language = "json",
  className,
  ...props
}: Omit<React.ComponentProps<"figure">, "children"> & {
  value: string;
  language?: string;
}) {
  return (
    <CodeBlock
      data-slot="api-request-code"
      code={value}
      language={language}
      hideHeader
      className={cn(
        "rounded-none border-x-0 border-b-0 shadow-none",
        className,
      )}
      codeClassName="py-3 pr-8 text-xs leading-5"
      {...props}
    />
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
