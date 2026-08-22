import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusVariants = cva(
  "inline-flex w-fit items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-muted-foreground",
        info: "bg-info-tint text-info-tint-foreground",
        success: "bg-success-tint text-success-tint-foreground",
        warning: "bg-warning-tint text-warning-tint-foreground",
        destructive: "bg-destructive-tint text-destructive-tint-foreground",
      },
      size: {
        sm: "h-5 px-2 text-xs",
        default: "h-6 px-2.5 text-xs",
        lg: "h-8 px-3 text-sm",
      },
    },
    defaultVariants: { variant: "neutral", size: "default" },
  },
);

function Status({
  className,
  variant = "neutral",
  size = "default",
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof statusVariants>) {
  return (
    <span
      data-slot="status"
      data-variant={variant}
      className={cn(statusVariants({ variant, size }), className)}
      {...props}
    >
      <span
        data-slot="status-indicator"
        aria-hidden="true"
        className="size-1.5 rounded-full bg-current"
      />
      {children}
    </span>
  );
}

export { Status, statusVariants };
