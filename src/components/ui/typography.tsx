import * as React from "react";

import { cn } from "@/lib/utils";

const titleStyles = {
  1: "text-4xl font-semibold tracking-tight text-balance sm:text-5xl",
  2: "text-3xl font-semibold tracking-tight text-balance",
  3: "text-2xl font-semibold tracking-tight text-balance",
  4: "text-xl font-semibold tracking-tight text-balance",
  5: "text-lg font-semibold tracking-tight",
  6: "text-base font-semibold tracking-tight",
} as const;

type TitleLevel = keyof typeof titleStyles;

function Title({
  className,
  level = 1,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { level?: TitleLevel }) {
  const Component = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Component
      data-slot="typography-title"
      data-level={level}
      className={cn(
        "scroll-m-20 text-foreground",
        titleStyles[level],
        className,
      )}
      {...props}
    />
  );
}

function Text({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography-text"
      className={cn("text-base leading-7 text-foreground", className)}
      {...props}
    />
  );
}

function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography-lead"
      className={cn("text-xl leading-8 text-muted-foreground", className)}
      {...props}
    />
  );
}

function Label({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="typography-label"
      className={cn(
        "text-sm font-medium leading-none text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function Description({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography-description"
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  );
}

function Small({ className, ...props }: React.ComponentProps<"small">) {
  return (
    <small
      data-slot="typography-small"
      className={cn("text-xs font-medium leading-5", className)}
      {...props}
    />
  );
}

function Muted({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography-muted"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function InlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="typography-inline-code"
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function Blockquote({
  className,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      data-slot="typography-blockquote"
      className={cn(
        "border-l-2 border-primary pl-4 text-base italic leading-7 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="typography-list"
      className={cn(
        "my-4 ml-6 list-disc space-y-2 text-base leading-7 marker:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Blockquote,
  Description,
  InlineCode,
  Label,
  Lead,
  List,
  Muted,
  Small,
  Text,
  Title,
};
