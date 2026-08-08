import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const pageStateVariants = cva(
  "relative isolate flex min-h-[28rem] w-full items-center justify-center overflow-hidden rounded-xl px-6 py-16 text-center",
  {
    variants: {
      variant: {
        default: "[--page-state-accent:var(--primary)]",
        muted: "[--page-state-accent:var(--muted-foreground)]",
        warning: "[--page-state-accent:var(--warning)]",
        destructive: "[--page-state-accent:var(--destructive)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function PageState({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof pageStateVariants>) {
  return (
    <section
      data-slot="page-state"
      data-variant={variant}
      className={cn(pageStateVariants({ variant }), className)}
      {...props}
    />
  );
}

function PageStateBackdrop({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-state-backdrop"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 opacity-60 [background:radial-gradient(circle_at_center,color-mix(in_oklch,var(--page-state-accent)_12%,transparent),transparent_56%)]",
        className,
      )}
      {...props}
    />
  );
}

function PageStateContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-state-content"
      className={cn(
        "flex w-full max-w-lg flex-col items-center text-balance",
        className,
      )}
      {...props}
    />
  );
}

function PageStateCode({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-state-code"
      className={cn(
        "mb-5 font-mono text-6xl font-medium tracking-[-0.08em] text-[var(--page-state-accent)] sm:text-7xl",
        className,
      )}
      {...props}
    />
  );
}

function PageStateMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-state-media"
      className={cn(
        "mb-6 flex size-12 items-center justify-center rounded-xl border border-[color-mix(in_oklch,var(--page-state-accent)_25%,var(--border))] bg-[color-mix(in_oklch,var(--page-state-accent)_10%,var(--background))] text-[var(--page-state-accent)] shadow-sm [&_svg]:size-5",
        className,
      )}
      {...props}
    />
  );
}

function PageStateEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-state-eyebrow"
      className={cn(
        "mb-3 text-xs font-medium tracking-[0.14em] text-[var(--page-state-accent)] uppercase",
        className,
      )}
      {...props}
    />
  );
}

function PageStateTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-state-title"
      className={cn(
        "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
        className,
      )}
      {...props}
    />
  );
}

function PageStateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-state-description"
      className={cn(
        "mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base",
        className,
      )}
      {...props}
    />
  );
}

function PageStateActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-state-actions"
      className={cn(
        "mt-7 flex flex-wrap items-center justify-center gap-2",
        className,
      )}
      {...props}
    />
  );
}

function PageStateFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-state-footer"
      className={cn("mt-8 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  PageState,
  PageStateActions,
  PageStateBackdrop,
  PageStateCode,
  PageStateContent,
  PageStateDescription,
  PageStateEyebrow,
  PageStateFooter,
  PageStateMedia,
  PageStateTitle,
  pageStateVariants,
};
