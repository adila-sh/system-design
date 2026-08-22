import { useReducedMotion, useSpring } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const FULL = "⣿";
const HALF = "⡇";
const EMPTY = "⠀";

function percentage(value: number, max: number) {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}

function buildBar(progress: number, columns: number) {
  const safeColumns = Math.max(1, Math.floor(columns));
  const units = safeColumns * 2;
  const filled = Math.round(
    (Math.max(0, Math.min(100, progress)) / 100) * units,
  );
  const fullCharacters = Math.floor(filled / 2);
  const hasHalf = filled % 2 === 1;
  const emptyCharacters = safeColumns - fullCharacters - (hasHalf ? 1 : 0);

  return {
    filled: FULL.repeat(fullCharacters),
    half: hasHalf ? HALF : "",
    empty: EMPTY.repeat(emptyCharacters),
  };
}

type AsciiProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  value: number;
  max?: number;
  columns?: number;
  /** @deprecated Use `columns`. */
  cols?: number;
  label?: string;
  showPercent?: boolean;
};

function AsciiProgress({
  value,
  max = 100,
  columns = 20,
  cols,
  label,
  showPercent = true,
  className,
  ...props
}: AsciiProgressProps) {
  const resolvedColumns = cols ?? columns;
  const target = percentage(value, max);
  const prefersReducedMotion = useReducedMotion();
  const spring = useSpring(target, { stiffness: 80, damping: 20, mass: 1 });
  const [animado, setAnimado] = React.useState(target);

  React.useEffect(() => {
    if (prefersReducedMotion) spring.jump(target);
    else spring.set(target);
  }, [prefersReducedMotion, spring, target]);

  React.useEffect(() => spring.on("change", setAnimado), [spring]);

  /* Com movimento reduzido o valor exibido É o alvo, então dá para derivar
     durante o render em vez de chamar setState dentro do efeito — que era o
     que o oxlint apontava, e que custava um render a mais a cada mudança de
     valor. A mola continua sendo atualizada para não ficar defasada se a
     preferência mudar no meio do caminho. */
  const displayed = prefersReducedMotion ? target : animado;

  const rounded = Math.round(displayed);
  const bar = buildBar(displayed, resolvedColumns);

  return (
    <div
      data-slot="ascii-progress"
      role="progressbar"
      aria-label={label ?? "Progresso"}
      aria-valuemin={0}
      aria-valuemax={max > 0 ? max : 100}
      aria-valuenow={Math.max(0, Math.min(max > 0 ? max : 100, value))}
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
        <span className="text-primary">
          {bar.filled}
          {bar.half}
        </span>
        <span className="text-muted-foreground/25">{bar.empty}</span>
        {showPercent ? (
          <span className="ml-2 text-xs text-muted-foreground tabular-nums">
            {rounded}%
          </span>
        ) : null}
      </span>
    </div>
  );
}

export { AsciiProgress };
export type { AsciiProgressProps };
