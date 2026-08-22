import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { listComponentNames } from "./component-catalog.mjs";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");
const MAX_BUTTON_BYTES = 30_000;

function dependencias(arquivo, visitados = new Set()) {
  const caminho = resolve(arquivo);
  if (visitados.has(caminho)) return visitados;
  visitados.add(caminho);

  const codigo = readFileSync(caminho, "utf8");
  const imports = codigo.matchAll(
    /(?:from\s*|import\s*|require\s*\()["'](\.\.?\/[^"']+)["']/g,
  );
  for (const [, importado] of imports) {
    const dependencia = resolve(dirname(caminho), importado);
    if (existsSync(dependencia)) dependencias(dependencia, visitados);
  }
  return visitados;
}

const require = createRequire(import.meta.url);
const [raizEsm, buttonEsm] = await Promise.all([
  import("@adila-sh/ui"),
  import("@adila-sh/ui/button"),
]);
const buttonCjs = require("@adila-sh/ui/button");

assert.equal(buttonEsm.Button, raizEsm.Button, "Button ESM divergiu do barrel");
assert.equal(typeof buttonCjs.Button, "function", "Button CJS não carregou");
assert.equal(
  require.resolve("@adila-sh/ui"),
  join(DIST, "index.cjs"),
  "barrel CJS não resolveu para o entrypoint compatível",
);
assert.ok(existsSync(join(DIST, "style.css")), "export style.css ausente");
assert.ok(existsSync(join(DIST, "theme.css")), "export theme.css ausente");
for (const componente of listComponentNames(ROOT)) {
  for (const extensao of ["js", "cjs", "d.ts"]) {
    assert.ok(
      existsSync(join(DIST, `${componente}.${extensao}`)),
      `artefato granular ausente: ${componente}.${extensao}`,
    );
  }
}

const arquivosEsm = dependencias(join(DIST, "button.js"));
const arquivosCjs = dependencias(join(DIST, "button.cjs"));
const bytesEsm = [...arquivosEsm].reduce(
  (total, arquivo) => total + statSync(arquivo).size,
  0,
);
const codigoGranular = [
  ...[...arquivosEsm].map((arquivo) => readFileSync(arquivo, "utf8")),
  ...[...arquivosCjs].map((arquivo) => readFileSync(arquivo, "utf8")),
].join("\n");

assert.ok(
  bytesEsm <= MAX_BUTTON_BYTES,
  `Button ESM excedeu ${MAX_BUTTON_BYTES} bytes: ${bytesEsm}`,
);
assert.doesNotMatch(codigoGranular, /recharts|PixelBlast|uRipples/);

execFileSync(
  "bunx",
  [
    "tsc",
    "--noEmit",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--target",
    "ES2022",
    "--skipLibCheck",
    "scripts/fixtures/package-consumer.ts",
  ],
  { stdio: "inherit" },
);

console.log(
  `Package exports: raiz, ESM, CJS e tipos válidos; Button ESM ${bytesEsm}/${MAX_BUTTON_BYTES} bytes.`,
);
