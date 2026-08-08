import { useReducedMotion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

type AsciiSpinnerProps = React.ComponentProps<"span"> & {
  label?: string;
};

function AsciiSpinner({
  label = "Carregando",
  className,
  ...props
}: AsciiSpinnerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = window.setInterval(
      () => setFrame((current) => (current + 1) % FRAMES.length),
      80,
    );
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <span
      data-slot="ascii-spinner"
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-sm",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-primary">
        {FRAMES[frame]}
      </span>
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

export { AsciiSpinner };
export type { AsciiSpinnerProps };
