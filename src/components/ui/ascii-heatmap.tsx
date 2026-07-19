import * as React from "react";

import { cn } from "@/lib/utils";

const CELLS = [" ", "░", "▒", "▓", "█"];

function finiteValues(values: number[][]) {
  return values.flat().filter(Number.isFinite);
}

function toCell(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return CELLS[0];
  const range = max - min || 1;
  const index = Math.round(((value - min) / range) * (CELLS.length - 1));
  return CELLS[Math.max(0, Math.min(CELLS.length - 1, index))];
}

type AsciiHeatmapProps = Omit<React.ComponentProps<"div">, "children"> & {
  values: number[][];
  label?: string;
};

function AsciiHeatmap({
  values,
  label,
  className,
  ...props
}: AsciiHeatmapProps) {
  const flat = finiteValues(values);
  const min = flat.length > 0 ? Math.min(...flat) : 0;
  const max = flat.length > 0 ? Math.max(...flat) : 0;
  const accessibleLabel = label
    ? `${label}: ${values.length} linhas, mínimo ${min}, máximo ${max}`
    : `Mapa de intensidade com ${values.length} linhas, mínimo ${min}, máximo ${max}`;

  return (
    <div
      data-slot="ascii-heatmap"
      role="img"
      aria-label={accessibleLabel}
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    >
      {label ? (
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
      ) : null}
      <div
        aria-hidden="true"
        className="font-mono text-sm leading-tight tracking-tight"
      >
        {values.map((row, rowIndex) => (
          <div key={rowIndex} className="leading-none">
            {row.map((value, columnIndex) => {
              const intensity =
                max === min || !Number.isFinite(value)
                  ? 0
                  : (value - min) / (max - min);
              return (
                <span
                  key={columnIndex}
                  className="text-primary"
                  style={{
                    opacity: 0.2 + Math.max(0, Math.min(1, intensity)) * 0.8,
                  }}
                >
                  {toCell(value, min, max)}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export { AsciiHeatmap };
export type { AsciiHeatmapProps };
