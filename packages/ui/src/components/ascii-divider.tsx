import * as React from "react";

import { cn } from "@/lib/utils";

type AsciiDividerProps = React.ComponentProps<"div"> & {
  label?: string;
  character?: string;
  /** @deprecated Use `character`. */
  char?: string;
};

function AsciiDivider({
  label,
  character,
  char,
  className,
  ...props
}: AsciiDividerProps) {
  const glyph = Array.from(character ?? char ?? "─")[0] ?? "─";

  return (
    <div
      data-slot="ascii-divider"
      role="separator"
      aria-label={label}
      className={cn(
        "flex items-center gap-2 overflow-hidden font-mono text-xs text-muted-foreground/50",
        className,
      )}
      {...props}
    >
      {label ? (
        <>
          <span aria-hidden="true" className="shrink-0">
            {glyph.repeat(2)}
          </span>
          <span className="shrink-0 text-muted-foreground">{label}</span>
          <span
            aria-hidden="true"
            className="min-w-0 flex-1 overflow-hidden whitespace-nowrap"
          >
            {glyph.repeat(80)}
          </span>
        </>
      ) : (
        <span
          aria-hidden="true"
          className="w-full overflow-hidden whitespace-nowrap"
        >
          {glyph.repeat(80)}
        </span>
      )}
    </div>
  );
}

export { AsciiDivider };
export type { AsciiDividerProps };
