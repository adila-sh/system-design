import type { ReactNode } from "react";

/** Caixa de preview para renderizar componentes ao vivo nos docs. */
export function Preview({ children }: { children: ReactNode }) {
  return (
    <div className="docs-component-preview not-prose my-6 flex min-h-48 flex-wrap items-center justify-center gap-4">
      {children}
    </div>
  );
}
