// Gera src/index.ts re-exportando todo componente em src/components.
// Fonte única de verdade: os próprios arquivos do pacote.
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const COMPONENTS_DIR = join(ROOT, "src/components");
const OUT_FILE = join(ROOT, "src/index.ts");

// Nomes exportados em namespace por colidirem com outro componente no barrel.
// (typography exporta "Label", que também existe em label.tsx — o Label
// canônico (form) é o de label.tsx; os primitives tipográficos ficam em
// Typography.*)
const NAMESPACED = new Set(["typography"]);

const names = readdirSync(COMPONENTS_DIR)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))
  .sort();

const lines = names.map((name) =>
  NAMESPACED.has(name)
    ? `export * as ${name[0].toUpperCase()}${name.slice(1)} from "./components/${name}";`
    : `export * from "./components/${name}";`,
);
writeFileSync(OUT_FILE, `${lines.join("\n")}\n`);

console.log(`gen-barrel: src/index.ts gerado com ${names.length} módulos.`);
