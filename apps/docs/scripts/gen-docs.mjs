// Gera páginas-base de documentação (MDX) para cada componente do pacote
// @adila-sh/ui. Cria content/docs/components/<name>.mdx se ainda não existir
// (não sobrescreve docs curadas escritas à mão); sempre regenera o meta.json.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const UI_DIR = join(ROOT, "../../packages/ui/src/components");
const DOCS_DIR = join(ROOT, "content/docs/components");

/** Extrai os nomes exportados de um componente. */
function exportsOf(file) {
  const src = readFileSync(join(UI_DIR, file), "utf8");
  const names = new Set();
  for (const m of src.matchAll(
    /export\s+(?:function|const)\s+([A-Za-z0-9_]+)/g,
  ))
    names.add(m[1]);
  for (const block of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of block[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)
        .pop()
        ?.trim();
      if (name && /^[A-Z]/.test(name)) names.add(name);
    }
  }
  return [...names].filter((n) => !n.endsWith("Variants")).sort();
}

function titleOf(name) {
  return name
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}

const files = readdirSync(UI_DIR).filter((f) => f.endsWith(".tsx"));
const allNames = files.map((f) => f.replace(/\.tsx$/, "")).sort();

let created = 0;
for (const file of files) {
  const name = file.replace(/\.tsx$/, "");
  const out = join(DOCS_DIR, `${name}.mdx`);
  if (existsSync(out)) continue; // preserva docs curadas

  const exps = exportsOf(file);
  const importLine = exps.length
    ? `import { ${exps.join(", ")} } from '@adila-sh/ui';`
    : `import '@adila-sh/ui';`;

  const body = `---
title: ${titleOf(name)}
description: Componente ${name} do design system adila.co.
---

## Instalação

\`\`\`bash
bun add @adila-sh/ui
\`\`\`

## Uso

\`\`\`tsx
${importLine}
\`\`\`
`;

  writeFileSync(out, body);
  created++;
}

writeFileSync(
  join(DOCS_DIR, "meta.json"),
  JSON.stringify({ title: "Componentes", pages: allNames }, null, 2) + "\n",
);

console.log(
  `gen-docs: ${created} páginas-base criadas, ${allNames.length} no meta.json.`,
);
