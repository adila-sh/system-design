import type { ReactNode } from 'react';

/** Caixa de preview para renderizar componentes ao vivo nos docs. */
export function Preview({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-4 flex min-h-40 flex-wrap items-center justify-center gap-4 rounded-xl border bg-background p-8">
      {children}
    </div>
  );
}
