// Workaround: o trace do nitro copia o tslib incompleto (sem modules/), e os
// chunks _libs de @radix-ui (via Fumadocs/cmdk) o importam por esse caminho.
// Copiamos o pacote tslib completo para o .output do servidor.
import { cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const ROOT = process.cwd();
const require = createRequire(import.meta.url);
// resolve a localização real do tslib (no monorepo bun ele fica hoisted na
// raiz do workspace, não dentro de apps/docs/node_modules)
const src = dirname(require.resolve("tslib/package.json"));
const dest = join(ROOT, ".output/server/node_modules/tslib");

if (!existsSync(join(ROOT, ".output/server"))) {
  console.log("fix-tslib: .output/server ausente — nada a fazer.");
  process.exit(0);
}

cpSync(src, dest, { recursive: true });
console.log(
  "fix-tslib: tslib completo copiado para .output/server/node_modules/tslib.",
);
