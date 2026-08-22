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

function buildGaugeFill(progress: number, columns: number) {
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

type AsciiGaugeProps = Omit<React.ComponentProps<"div">, "children"> & {
  value: number;
  max?: number;
  columns?: number;
  /** @deprecated Use `columns`. */
  cols?: number;
  label?: string;
};

function AsciiGauge({
  value,
  max = 100,
  columns = 16,
  cols,
  label,
  className,
  ...props
}: AsciiGaugeProps) {
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

  const safeColumns = Math.max(1, Math.floor(resolvedColumns));
  const bar = buildGaugeFill(displayed, safeColumns);
  const percentText = `${Math.round(displayed)}%`.padStart(4);
  const innerWidth = safeColumns + 2;
  const padding = Math.max(0, innerWidth - percentText.length);

  return (
    <div
      data-slot="ascii-gauge"
      role="meter"
      aria-label={label ?? "Medidor"}
      aria-valuemin={0}
      aria-valuemax={max > 0 ? max : 100}
      aria-valuenow={Math.max(0, Math.min(max > 0 ? max : 100, value))}
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    >
      {label ? (
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
      ) : null}
      <div
        aria-hidden="true"
        className="font-mono text-sm leading-snug tracking-tight"
      >
        <div className="text-border">╭{"─".repeat(innerWidth)}╮</div>
        <div>
          <span className="text-border">│</span>
          <span className="text-primary">
            {bar.filled}
            {bar.half}
          </span>
          <span className="text-muted-foreground/25">{bar.empty} </span>
          <span className="text-border">│</span>
        </div>
        <div className="text-muted-foreground">
          │{" ".repeat(Math.floor(padding / 2))}
          {percentText}
          {" ".repeat(Math.ceil(padding / 2))}│
        </div>
        <div className="text-border">╰{"─".repeat(innerWidth)}╯</div>
      </div>
    </div>
  );
}

export { AsciiGauge };
export type { AsciiGaugeProps };
