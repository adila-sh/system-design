// Gera páginas-base de documentação (MDX) para cada componente do registry.
// - cria content/docs/components/<name>.mdx se ainda não existir (não
//   sobrescreve docs curadas escritas à mão);
// - sempre regenera o meta.json com todos os componentes em ordem alfabética.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const UI_DIR = join(ROOT, "src/components/ui")
const DOCS_DIR = join(ROOT, "content/docs/components")

const registry = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"))
const byName = new Map(registry.items.map((i) => [i.name, i]))

/** Extrai os nomes exportados de um componente. */
function exportsOf(file) {
  const src = readFileSync(join(UI_DIR, file), "utf8")
  const names = new Set()
  // export function X / export const X
  for (const m of src.matchAll(/export\s+(?:function|const)\s+([A-Za-z0-9_]+)/g))
    names.add(m[1])
  // export { A, B, C }
  for (const block of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of block[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim()
      if (name && /^[A-Z]/.test(name)) names.add(name)
    }
  }
  // ignora *Variants (cva helpers)
  return [...names].filter((n) => !n.endsWith("Variants")).sort()
}

function titleOf(name) {
  return name
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ")
}

const files = readdirSync(UI_DIR).filter((f) => f.endsWith(".tsx"))
const allNames = files.map((f) => f.replace(/\.tsx$/, "")).sort()

let created = 0
for (const file of files) {
  const name = file.replace(/\.tsx$/, "")
  const out = join(DOCS_DIR, `${name}.mdx`)
  if (existsSync(out)) continue // preserva docs curadas

  const exps = exportsOf(file)
  const item = byName.get(name)
  const deps = item?.dependencies ?? []
  const regDeps = (item?.registryDependencies ?? []).filter((d) => d !== "utils")

  const importLine = exps.length
    ? `import { ${exps.join(", ")} } from '@/components/ui/${name}';`
    : `import '@/components/ui/${name}';`

  const depsSection = deps.length
    ? `\n## Dependências\n\n${deps.map((d) => `- \`${d}\``).join("\n")}\n`
    : ""
  const relatedSection = regDeps.length
    ? `\n## Componentes relacionados\n\n${regDeps
        .map((d) => `- [${titleOf(d)}](/docs/components/${d})`)
        .join("\n")}\n`
    : ""

  const body = `---
title: ${titleOf(name)}
description: Componente ${name} do design system LAI, sobre Base UI.
---

## Instalação

\`\`\`bash
npx shadcn@latest add https://<host>/r/${name}.json
\`\`\`

## Uso

\`\`\`tsx
${importLine}
\`\`\`
${depsSection}${relatedSection}`

  writeFileSync(out, body)
  created++
}

// meta.json com todos os componentes
writeFileSync(
  join(DOCS_DIR, "meta.json"),
  JSON.stringify({ title: "Componentes", pages: allNames }, null, 2) + "\n",
)

console.log(
  `gen-docs: ${created} páginas-base criadas, ${allNames.length} no meta.json.`,
)
