// Gera src/index.ts re-exportando todo componente em src/components e os
// utilitários que fazem parte da API pública.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { listComponentNames } from "./component-catalog.mjs";

const ROOT = process.cwd();
const OUT_FILE = join(ROOT, "src/index.ts");

// Nomes exportados em namespace por colidirem com outro componente no barrel.
// (typography exporta "Label", que também existe em label.tsx — o Label
// canônico (form) é o de label.tsx; os primitives tipográficos ficam em
// Typography.*)
const NAMESPACED = new Set(["typography"]);

// Testes moram ao lado do componente (*.browser.test.tsx) e NÃO podem entrar no
// barrel — o tsup empacota a partir dele, então um teste no index viraria código
// publicado, arrastando vitest pro bundle.
const names = listComponentNames(ROOT);

// Sonner já publica Toaster e toast. O novo Toast mantém os nomes upstream no
// subpath, com aliases no barrel para preservar a API dos produtos existentes.
const lines = names.map((name) =>
  name === "toast"
    ? `export { Toaster as ToastToaster, toast as toastManager, Toast, ToastAction, ToastClose, ToastContent, ToastDescription, ToastPortal, ToastProvider, ToastTitle, ToastViewport, createToastManager, useToastManager } from "./components/toast";`
    : NAMESPACED.has(name)
      ? `export * as ${name[0].toUpperCase()}${name.slice(1)} from "./components/${name}";`
      : `export * from "./components/${name}";`,
);
lines.push('export { cn } from "./lib/utils";');
writeFileSync(OUT_FILE, `${lines.join("\n")}\n`);

console.log(`gen-barrel: src/index.ts gerado com ${names.length} módulos.`);
