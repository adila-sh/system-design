// Gera registry.json varrendo src/components/ui, src/hooks e os tokens do
// index.css. Fonte única de verdade: os próprios arquivos do projeto.
import { readFileSync, writeFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const UI_DIR = "src/components/ui"
const HOOKS_DIR = "src/hooks"

const IGNORE_DEPS = new Set(["react", "react-dom"])

/** Extrai o nome do pacote npm de um import specifier. */
function pkgName(spec) {
  if (spec.startsWith("@")) return spec.split("/").slice(0, 2).join("/")
  return spec.split("/")[0]
}

/** Lê imports de um arquivo e classifica em deps npm / registryDeps. */
function analyze(file) {
  const src = readFileSync(file, "utf8")
  const deps = new Set()
  const registryDeps = new Set()
  const re = /from\s+"([^"]+)"/g
  let m
  while ((m = re.exec(src))) {
    const spec = m[1]
    if (spec.startsWith("@/components/ui/")) {
      registryDeps.add(spec.replace("@/components/ui/", ""))
    } else if (spec === "@/lib/utils") {
      registryDeps.add("utils")
    } else if (spec.startsWith("@/hooks/")) {
      registryDeps.add(spec.replace("@/hooks/", ""))
    } else if (!spec.startsWith("@/") && !spec.startsWith(".")) {
      const pkg = pkgName(spec)
      if (!IGNORE_DEPS.has(pkg)) deps.add(pkg)
    }
  }
  return {
    deps: [...deps].sort(),
    registryDeps: [...registryDeps].sort(),
  }
}

/** Extrai um bloco `selector { ... }` do CSS (sem chaves aninhadas). */
function cssBlock(css, selector) {
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const m = new RegExp(`${esc}\\s*\\{`).exec(css)
  if (!m) return {}
  const open = m.index + m[0].length - 1
  const close = css.indexOf("}", open)
  const body = css.slice(open + 1, close)
  const vars = {}
  for (const line of body.split("\n")) {
    const m = line.match(/^\s*--([\w-]+):\s*(.+?);\s*$/)
    if (m) vars[m[1]] = m[2].trim()
  }
  return vars
}

// ---- item base (adila-theme) a partir do index.css ----------------------
const css = readFileSync(join(ROOT, "src/styles/adila-tokens.css"), "utf8")
const root = cssBlock(css, ":root")
const dark = cssBlock(css, ".dark")

const themeKeys = new Set(["radius", "font-sans", "font-mono"])
const theme = {}
const light = {}
for (const [k, v] of Object.entries(root)) {
  if (themeKeys.has(k)) theme[k] = v
  else light[k] = v
}

// ---- artefato de fonte para o R2 --------------------------------------
// A Circular Std (--font-sans) é servida via @font-face self-hosted. O app
// importa src/styles/fonts.css (bundled); consumidores do registry recebem
// um @import para a mesma folha hospedada no R2. Fonte única = fonts.css:
// copiamos para adila-fonts.css (raiz) como o arquivo a subir no bucket.
const FONT_CSS_URL = "https://assets.adila.co/adila-fonts.css"
const fontCss = readFileSync(join(ROOT, "src/styles/fonts.css"), "utf8")
writeFileSync(join(ROOT, "adila-fonts.css"), fontCss)

const baseItem = {
  name: "adila-theme",
  type: "registry:style",
  title: "adila.co Theme",
  description:
    "Tokens do design system adila.co (indigo adila.co, neutros ChatGPT, Circular Std / JetBrains Mono) em light e dark.",
  dependencies: ["tw-animate-css"],
  registryDependencies: ["utils"],
  // @import injetado no CSS global do consumidor (shadcn trata `@import`
  // nativamente) — carrega os @font-face da Circular Std a partir do R2.
  css: { [`@import "${FONT_CSS_URL}"`]: {} },
  cssVars: { theme, light, dark },
}

// ---- itens de componentes (registry:ui) -------------------------------
const uiItems = readdirSync(join(ROOT, UI_DIR))
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => {
    const name = f.replace(/\.tsx$/, "")
    const { deps, registryDeps } = analyze(join(ROOT, UI_DIR, f))
    const item = {
      name,
      type: "registry:ui",
      files: [{ path: `${UI_DIR}/${f}`, type: "registry:ui" }],
    }
    if (registryDeps.length) item.registryDependencies = registryDeps
    if (deps.length) item.dependencies = deps
    return item
  })

// ---- hooks (registry:hook) --------------------------------------------
const hookItems = readdirSync(join(ROOT, HOOKS_DIR))
  .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
  .map((f) => {
    const name = f.replace(/\.tsx?$/, "")
    const { deps, registryDeps } = analyze(join(ROOT, HOOKS_DIR, f))
    const item = {
      name,
      type: "registry:hook",
      files: [{ path: `${HOOKS_DIR}/${f}`, type: "registry:hook" }],
    }
    if (registryDeps.length) item.registryDependencies = registryDeps
    if (deps.length) item.dependencies = deps
    return item
  })

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "adila-ui",
  homepage: "https://ds.adila.co",
  items: [baseItem, ...hookItems, ...uiItems],
}

writeFileSync(
  join(ROOT, "registry.json"),
  JSON.stringify(registry, null, 2) + "\n",
)

console.log(
  `registry.json gerado: ${registry.items.length} itens ` +
    `(1 base, ${hookItems.length} hooks, ${uiItems.length} ui).`,
)
