import * as React from "react";

import { cn } from "@/lib/utils";

const BLOCKS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

function toSparkline(values: number[]) {
  if (values.length === 0) return "";
  const finite = values.filter(Number.isFinite);
  if (finite.length === 0) return "";
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const range = max - min || 1;

  return values
    .map((value) => {
      if (!Number.isFinite(value)) return " ";
      return BLOCKS[Math.round(((value - min) / range) * (BLOCKS.length - 1))];
    })
    .join("");
}

type AsciiSparklineProps = Omit<React.ComponentProps<"div">, "children"> & {
  values: number[];
  width?: number;
  label?: string;
};

function AsciiSparkline({
  values,
  width = 20,
  label,
  className,
  ...props
}: AsciiSparklineProps) {
  const trimmed = values.slice(-Math.max(1, Math.floor(width)));
  const finite = trimmed.filter(Number.isFinite);
  const last = finite.at(-1);
  const previous = finite.at(-2);
  const trend =
    last === undefined || previous === undefined
      ? null
      : last > previous
        ? "up"
        : last < previous
          ? "down"
          : "stable";
  const accessibleLabel = `${label ?? "Tendência"}: ${finite.length} valores${last === undefined ? "" : `, atual ${last}`}`;

  return (
    <div
      data-slot="ascii-sparkline"
      role="img"
      aria-label={accessibleLabel}
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    >
      {label ? (
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
      ) : null}
      <span
        aria-hidden="true"
        className="font-mono text-sm leading-none tracking-tight"
      >
        <span className="text-primary">{toSparkline(trimmed)}</span>
        {trend ? (
          <span
            className={cn(
              "ml-1.5 text-xs",
              trend === "up" && "text-success",
              trend === "down" && "text-destructive",
              trend === "stable" && "text-muted-foreground",
            )}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export { AsciiSparkline };
export type { AsciiSparklineProps };
