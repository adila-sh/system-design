import * as React from "react";

import { Progress } from "@/components/progress";
import { cn } from "@/lib/utils";

type UsageCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode;
  value: number;
  max: number;
  description?: React.ReactNode;
  formatValue?: (value: number, max: number) => React.ReactNode;
  warningAt?: number;
  criticalAt?: number;
  icon?: React.ReactNode;
  action?: React.ReactNode;
};

function UsageCard({
  label,
  value,
  max,
  description,
  formatValue = (current, limit) => `${current} de ${limit}`,
  warningAt = 70,
  criticalAt = 90,
  icon,
  action,
  className,
  ...props
}: UsageCardProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const state =
    percentage >= criticalAt
      ? "critical"
      : percentage >= warningAt
        ? "warning"
        : "default";

  return (
    <div
      data-slot="usage-card"
      data-state={state}
      className={cn("space-y-4 rounded-lg border bg-card p-4", className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-4">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">{label}</div>
          {description ? (
            <div className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </div>
          ) : null}
        </div>
        {action}
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-lg font-semibold tabular-nums">
            {formatValue(value, max)}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
        <Progress
          value={percentage}
          aria-label={typeof label === "string" ? label : "Uso"}
          className={cn(
            "gap-0",
            state === "warning" &&
              "[&_[data-slot=progress-indicator]]:bg-warning",
            state === "critical" &&
              "[&_[data-slot=progress-indicator]]:bg-destructive",
          )}
        />
      </div>
    </div>
  );
}

export { UsageCard, type UsageCardProps };
