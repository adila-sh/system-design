import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";

const deploymentStatusVariants = cva(
  "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      status: {
        queued: "bg-muted text-muted-foreground",
        building: "bg-primary-tint text-primary-tint-foreground",
        ready: "bg-success-tint text-success-tint-foreground",
        failed: "bg-destructive-tint text-destructive-tint-foreground",
        canceled: "bg-muted text-muted-foreground line-through",
      },
    },
    defaultVariants: { status: "queued" },
  },
);

const deploymentStatusLabels = {
  queued: "Na fila",
  building: "Em construção",
  ready: "Disponível",
  failed: "Falhou",
  canceled: "Cancelado",
} as const;

function DeploymentStatus({
  status = "queued",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof deploymentStatusVariants>) {
  const currentStatus = status ?? "queued";

  return (
    <span
      data-slot="deployment-status"
      data-status={currentStatus}
      role="status"
      className={cn(
        deploymentStatusVariants({ status: currentStatus }),
        className,
      )}
      {...props}
    >
      {currentStatus === "building" ? (
        <Spinner className="size-3" />
      ) : (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      )}
      {children ?? deploymentStatusLabels[currentStatus]}
    </span>
  );
}

export { DeploymentStatus, deploymentStatusLabels, deploymentStatusVariants };
