# Distribuir o DS como pacote npm no GitHub Packages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar `adila-ui-registry` (app único TanStack Start + Fumadocs + registry shadcn) para um monorepo bun com `apps/docs` (site de documentação, privado) e `packages/ui` (`@adila-sh/ui`, publicado automaticamente no GitHub Packages via Changesets), removendo o registry HTTP shadcn.

**Architecture:** Workspaces bun (`apps/*`, `packages/*`) na raiz. `packages/ui` contém os componentes Base UI, tokens CSS e o `cn()` helper; builda com `tsup` (JS/d.ts) + `@tailwindcss/cli` (CSS pré-compilado, sem exigir Tailwind do consumidor). `apps/docs` consome `@adila-sh/ui` via `workspace:*` para preview ao vivo e para as próprias páginas do site. Changesets + GitHub Actions cuidam de versionamento e publish.

**Tech Stack:** Bun (workspaces + runtime), TypeScript, tsup, `@tailwindcss/cli` v4, React 19, Base UI, TanStack Start, Fumadocs, Changesets, GitHub Actions, GitHub Packages (`npm.pkg.github.com`).

## Global Constraints

- Escopo do pacote publicado: `@adila-sh/ui` (bate com a org GitHub `adila-sh`, exigência do GitHub Packages).
- Registro de publish: `https://npm.pkg.github.com` (não npmjs.com).
- Nenhuma configuração de Tailwind é exigida do consumidor final de `@adila-sh/ui` — CSS sai pré-compilado em `dist/style.css`.
- Fontes (Adila Std/Code/Pixel) continuam self-hosted no R2 via `@import` remoto em `dist/style.css` — nunca duplicar `.woff2` dentro do pacote npm.
- O registry HTTP shadcn (`/r/*.json`, `npx shadcn add ...`) é **removido**, não mantido em paralelo.
- `apps/docs` continua existindo (docs Fumadocs + landing) e é **privado** (nunca publicado).
- Gerenciador de pacotes: **bun** (`bun.lock` é o lockfile canônico; `package-lock.json` está obsoleto e não deve ser tocado neste plano).
- Versionamento do pacote publicado é feito exclusivamente via Changesets (sem bump manual de versão).

---

### Task 1: Configurar bun workspaces e mover o app para `apps/docs`

**Files:**
- Create: `apps/docs/` (destino de quase todo o conteúdo atual do repo)
- Modify: `package.json` (raiz) → vira manifesto do workspace
- Modify: `.gitignore`, `.oxlintrc.json`
- Delete (via move): conteúdo movido não sobra na raiz

**Interfaces:**
- Produces: `apps/docs/` com o app TanStack Start + Fumadocs funcionando exatamente como antes (nenhuma mudança de comportamento nesta task — só de localização).
- Produces: raiz com `"workspaces": ["apps/*", "packages/*"]` em `package.json`.

- [ ] **Step 1: Criar a pasta `apps/docs` e mover todo o conteúdo do app para dentro dela**

```bash
mkdir -p apps/docs
git mv src apps/docs/src
git mv content apps/docs/content
git mv public apps/docs/public
git mv scripts apps/docs/scripts
git mv source.config.ts apps/docs/source.config.ts
git mv vite.config.ts apps/docs/vite.config.ts
git mv tsconfig.json apps/docs/tsconfig.json
git mv components.json apps/docs/components.json
git mv .source apps/docs/.source 2>/dev/null || true
```

> `docs/` (specs/plans do superpowers) **não** é movido — é uma pasta diferente de `content/docs` (Fumadocs) e continua na raiz do repositório.

- [ ] **Step 2: Remover o `registry.json` obsoleto (será regenerado, agora inexistente, na Task 7) e o artefato de fonte gerado**

```bash
rm -f registry.json adila-fonts.css
```

- [ ] **Step 3: Criar `apps/docs/package.json`**

```json
{
  "name": "@adila-sh/docs",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build && node scripts/fix-tslib.mjs",
    "start": "node .output/server/index.mjs",
    "smoke": "node scripts/smoke-test.mjs",
    "typecheck": "fumadocs-mdx && tsc --noEmit",
    "gen:docs": "node scripts/gen-docs.mjs"
  },
  "dependencies": {
    "@adila-sh/ui": "workspace:*",
    "@base-ui/react": "^1.6.0",
    "@phosphor-icons/react": "2.1.10",
    "@pierre/diffs": "^1.2.12",
    "@shadcn/react": "^0.2.1",
    "@tailwindcss/vite": "^4.3.2",
    "@tanstack/react-router": "^1.170.17",
    "@tanstack/react-start": "^1.168.27",
    "@tanstack/react-table": "^8.21.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "cnfast": "^0.0.8",
    "date-fns": "^4.4.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.42.2",
    "fumadocs-core": "^16.11.3",
    "fumadocs-ui": "^16.11.3",
    "input-otp": "^1.4.2",
    "lucide-react": "^1.24.0",
    "next-themes": "^0.4.6",
    "react": "^19.2.7",
    "react-day-picker": "^10.0.1",
    "react-dom": "^19.2.7",
    "react-resizable-panels": "^4.12.1",
    "recharts": "^3.9.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0",
    "tailwindcss": "^4.3.2",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@tanstack/react-router-devtools": "^1.167.0",
    "@types/bun": "^1.3.14",
    "@types/mdx": "^2.0.14",
    "@types/node": "^26.1.1",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.3",
    "fumadocs-mdx": "^15.1.0",
    "nitro": "^3.0.260610-beta",
    "shadcn": "^4.13.0",
    "typescript": "~7.0.2",
    "vite": "^8.1.4"
  }
}
```

> **Correção pós-revisão (2026-08-07):** esta lista de dependências é
> **deliberadamente igual à do `package.json` original**, incluindo pacotes
> que só são usados pelos primitives em `src/components/ui/*` (`@base-ui/react`,
> `cmdk`, `sonner`, `date-fns`, `embla-carousel-react`, `input-otp`,
> `react-day-picker`, `react-resizable-panels`, `@pierre/diffs`,
> `@shadcn/react`, `class-variance-authority`) e o `shadcn` (CLI) usado por
> `components.json`. Nesta task esses arquivos **ainda não saíram** de
> `apps/docs/src/components/ui` (isso só acontece na Task 2) — remover essas
> dependências agora quebraria o `typecheck`/build num clone limpo. A Task 2
> é quem remove as agora-mortas dessa lista, no momento exato em que move os
> arquivos que as usavam. `check-dropdown-menu-labels.mjs` e o script
> `registry` somem daqui — o primeiro migra para `packages/ui` na Task 2 (é lá
> que os primitives `dropdown-menu.tsx`/`menubar.tsx` vão morar); o segundo
> (junto com `shadcn` CLI) será removido de vez na Task 7.

- [ ] **Step 4: Ajustar `apps/docs/tsconfig.json`** (mesmo conteúdo de antes, path continua relativo ao novo `apps/docs`, nada muda de fato):

```json
{
  "include": ["**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "types": ["vite/client"],
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "target": "ES2022",
    "allowJs": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./src/*"],
      "collections/*": ["./.source/*"]
    },
    "noEmit": true
  }
}
```

- [ ] **Step 5: Reescrever o `package.json` da raiz como manifesto de workspace**

```json
{
  "name": "adila-ui-monorepo",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "bun run --cwd apps/docs dev",
    "build": "bun run --cwd packages/ui build && bun run --cwd apps/docs build",
    "start": "bun run --cwd apps/docs start",
    "typecheck": "bun run --cwd packages/ui typecheck && bun run --cwd apps/docs typecheck",
    "smoke": "bun run --cwd apps/docs smoke",
    "format": "oxfmt --write .",
    "format:check": "oxfmt --check .",
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx,mjs,cjs}": [
      "oxfmt --write",
      "oxlint --fix"
    ]
  },
  "overrides": {
    "react": "19.2.7",
    "react-dom": "19.2.7"
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^17.0.8",
    "oxfmt": "^0.58.0",
    "oxlint": "^1.73.0"
  }
}
```

- [ ] **Step 6: Atualizar `.gitignore`**

```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# TanStack Start / Fumadocs / Nitro (apps/docs)
apps/docs/.source
apps/docs/.output
apps/docs/.nitro
apps/docs/.tanstack
apps/docs/.vercel
apps/docs/.cache
apps/docs/src/routeTree.gen.ts

# defensivo: nunca versionar um .source gerado na raiz por engano (ex: rodar
# um comando fumadocs-mdx/typecheck sem --cwd apps/docs)
/.source

# build do pacote (packages/ui)
packages/ui/dist
```

- [ ] **Step 6.1: Confirmar que não sobrou nenhum `.source` gerado na raiz do repo**

```bash
git ls-files .source
```

Expected: nenhuma saída (vazio). Se listar arquivos, é um artefato gerado por
engano (algum comando fumadocs-mdx rodado sem `--cwd apps/docs`) — remova com
`git rm -r .source` antes de continuar.

- [ ] **Step 7: Atualizar `.oxlintrc.json`** (raiz) para os novos caminhos:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "unicorn", "oxc"],
  "categories": {
    "correctness": "error"
  },
  "rules": {
    "react/only-export-components": "off"
  },
  "env": {
    "builtin": true,
    "browser": true,
    "es2024": true
  },
  "ignorePatterns": [
    "dist",
    "**/.output",
    "**/.nitro",
    "node_modules",
    "apps/docs/src/routeTree.gen.ts"
  ]
}
```

- [ ] **Step 8: Instalar e verificar que o app builda igual a antes**

```bash
bun install
bun run --cwd apps/docs typecheck
bun run --cwd apps/docs dev &
sleep 3
curl -sf http://localhost:3000/docs > /dev/null && echo "OK: /docs respondeu 200"
kill %1
```

Expected: `typecheck` passa sem erros (o registry/gen-registry ainda não foi tocado, então `apps/docs`'s `src/components/ui` ainda existe fisicamente aqui — só movida de lugar); `/docs` responde 200.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: mover app para apps/docs, introduzir workspaces bun"
```

---

### Task 2: Extrair componentes e tokens do DS para `packages/ui`

**Files:**
- Create: `packages/ui/src/components/*.tsx` (movidos de `apps/docs/src/components/ui/*.tsx`)
- Create: `packages/ui/src/lib/utils.ts` (movido de `apps/docs/src/lib/utils.ts`)
- Create: `packages/ui/src/hooks/use-mobile.ts` (movido de `apps/docs/src/hooks/use-mobile.ts`)
- Create: `packages/ui/src/styles/adila-tokens.css` (movido de `apps/docs/src/styles/adila-tokens.css`)
- Create: `packages/ui/components.json`, `packages/ui/scripts/check-dropdown-menu-labels.mjs`
- Modify: `apps/docs/components.json` (removido — `shadcn add` local passa a rodar dentro de `packages/ui`)

**Interfaces:**
- Consumes: nada de tasks anteriores além da árvore movida na Task 1.
- Produces: `packages/ui/src/components/*.tsx` com imports internos intactos (`@/components/ui/x` → `@/components/x`, `@/lib/utils` e `@/hooks/use-mobile` continuam resolvendo via alias `@/*` própria do pacote — ver Step 3). Isso é o que a Task 3 (build JS) consome.

- [ ] **Step 1: Mover os componentes, tokens, lib e hook para `packages/ui`**

```bash
mkdir -p packages/ui/src/components packages/ui/src/styles packages/ui/src/hooks packages/ui/src/lib packages/ui/scripts

git mv apps/docs/src/components/ui packages/ui/src/components-tmp
rmdir packages/ui/src/components 2>/dev/null || true
git mv packages/ui/src/components-tmp packages/ui/src/components

git mv apps/docs/src/styles/adila-tokens.css packages/ui/src/styles/adila-tokens.css
git mv apps/docs/src/lib/utils.ts packages/ui/src/lib/utils.ts
git mv apps/docs/src/hooks/use-mobile.ts packages/ui/src/hooks/use-mobile.ts

# a pasta .playwright-mcp ficou dentro de ui/ por engano em sessão anterior — remove
rm -rf packages/ui/src/components/.playwright-mcp
```

> Dentro de `packages/ui/src/components/*.tsx` os imports internos continuam como
> `from "@/components/x"` (sub-componentes que hoje importam `@/components/ui/y`
> precisam do `/ui` removido — ver Step 2), `from "@/lib/utils"` e
> `from "@/hooks/use-mobile"`. Nenhum desses precisa virar caminho relativo: o
> alias `@/*` do pacote (Step 5) resolve para `packages/ui/src/*`.

- [ ] **Step 2: Corrigir os imports internos que referenciavam `@/components/ui/*` (agora é só `@/components/*`, sem o `/ui`)**

```bash
grep -rl '@/components/ui/' packages/ui/src | xargs sed -i 's#@/components/ui/#@/components/#g'
```

Verifique que não sobrou nenhuma ocorrência:

```bash
grep -rl '@/components/ui/' packages/ui/src && echo "AINDA HÁ REFERÊNCIAS — corrigir" || echo "OK: nenhuma referência a @/components/ui/ restante"
```

- [ ] **Step 3: Mover o check de composição do DropdownMenu para `packages/ui`, ajustado para o novo layout**

```bash
git mv apps/docs/scripts/check-dropdown-menu-labels.mjs packages/ui/scripts/check-dropdown-menu-labels.mjs
```

Edite `packages/ui/scripts/check-dropdown-menu-labels.mjs`: troque `SRC_DIR` para `join(ROOT, "src")` e `PRIMITIVE_FILES` para:

```js
const PRIMITIVE_FILES = new Set([
  "src/components/dropdown-menu.tsx",
  "src/components/menubar.tsx",
]);
```

(o restante do script já usa caminhos relativos ao `ROOT` do processo, então não precisa de mais nada).

- [ ] **Step 4: Criar `packages/ui/components.json`** (para continuar usando `npx shadcn@latest add <componente>` ao adicionar novos primitives, agora direto em `packages/ui`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "phosphor"
}
```

- [ ] **Step 5: Criar `packages/ui/tsconfig.json`**

```json
{
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "target": "ES2022",
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "noEmit": true
  }
}
```

- [ ] **Step 6: Remover `apps/docs/components.json`** (não faz mais sentido lá — os primitives não vivem mais em `apps/docs`)

```bash
git rm apps/docs/components.json
```

- [ ] **Step 7: Remover de `apps/docs/package.json` as dependências que só existiam por causa dos arquivos movidos no Step 1** (a Task 1 propositalmente manteve a lista de dependências original intacta — ver nota "Correção pós-revisão" na Task 1 — porque até agora esses arquivos ainda estavam fisicamente em `apps/docs`; agora que saíram, remova do objeto `dependencies` de `apps/docs/package.json`:)

```
@base-ui/react
@pierre/diffs
@shadcn/react
class-variance-authority
cmdk
date-fns
embla-carousel-react
input-otp
react-day-picker
react-resizable-panels
sonner
```

> Mantenha `clsx`, `cnfast`, `tailwind-merge` em `apps/docs/package.json` —
> `apps/docs/src/lib/cn.ts` (não movido, é código morto fora de escopo deste
> plano) ainda importa `cnfast`, e o `tsc --noEmit` resolve esse import
> mesmo sem nenhum outro arquivo chamar `cn.ts`. `shadcn` (CLI, em
> `devDependencies`) e o restante das dependências de `apps/docs` continuam
> como estão — só saem na Task 7.

- [ ] **Step 8: Verificação estrutural de `packages/ui`** (o `typecheck` do pacote ainda vai falhar aqui — faltam `package.json`/deps/tsup, que entram na Task 3):

```bash
test -f packages/ui/src/components/button.tsx && echo "OK: button.tsx presente em packages/ui"
test -f packages/ui/src/lib/utils.ts && echo "OK: utils.ts presente em packages/ui"
grep -c '@/components/ui/' packages/ui/src -r || echo "OK: 0 ocorrências de /ui/ nos imports internos"
bun install
```

> **`apps/docs` typecheck fica quebrado a partir deste commit, de propósito,
> até a Task 6.** `src/routes/*.tsx` (3 arquivos), `content/docs/components/*.mdx`
> (103 arquivos) e `src/components/*.tsx` fora de `ui/` (5 arquivos) continuam
> fazendo `from "@/components/ui/<nome>"`, e esses arquivos só deixaram de
> existir em `apps/docs/src/components/ui` neste Step 1 — `tsc --noEmit` vai
> reportar "Cannot find module" para essas ~111 referências. Isso é esperado
> e intencional: a Task 6 é quem migra esses imports para `@adila-sh/ui`.
> Não rode `bun run --cwd apps/docs typecheck` esperando verde nesta task —
> só `bun run --cwd packages/ui typecheck` (Task 3 em diante) e as checagens
> estruturais acima precisam passar aqui.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: extrair componentes e tokens do DS para packages/ui"
```

---

### Task 3: Build JS do pacote com tsup (barrel automático + entry point)

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsup.config.ts`
- Create: `packages/ui/scripts/gen-barrel.mjs`
- Create (gerado, não commitado): `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `packages/ui/src/components/*.tsx` (Task 2).
- Produces: `packages/ui/dist/index.js`, `dist/index.cjs`, `dist/index.d.ts` — consumidos pela Task 5 (smoke test) e pela Task 6 (`apps/docs` importa `@adila-sh/ui`).

- [ ] **Step 1: Criar `packages/ui/package.json`**

```json
{
  "name": "@adila-sh/ui",
  "version": "0.0.0",
  "type": "module",
  "license": "UNLICENSED",
  "sideEffects": false,
  "files": ["dist"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./style.css": "./dist/style.css"
  },
  "scripts": {
    "gen:barrel": "node scripts/gen-barrel.mjs",
    "check:dropdown-menu": "node scripts/check-dropdown-menu-labels.mjs",
    "build:js": "bun run gen:barrel && tsup",
    "build:css": "tailwindcss -i src/styles/index.css -o dist/style.css --minify && node scripts/append-font-import.mjs",
    "build": "bun run check:dropdown-menu && bun run build:js && bun run build:css",
    "prepublishOnly": "bun run build",
    "dev": "bun run gen:barrel && tsup --watch",
    "typecheck": "bun run check:dropdown-menu && tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "dependencies": {
    "@base-ui/react": "^1.6.0",
    "@phosphor-icons/react": "2.1.10",
    "@pierre/diffs": "^1.2.12",
    "@shadcn/react": "^0.2.1",
    "@tanstack/react-table": "^8.21.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.4.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.42.2",
    "input-otp": "^1.4.2",
    "next-themes": "^0.4.6",
    "react-day-picker": "^10.0.1",
    "react-resizable-panels": "^4.12.1",
    "recharts": "^3.9.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4.3.3",
    "@types/node": "^26.1.1",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "tailwindcss": "^4.3.2",
    "tsup": "^8.5.1",
    "tw-animate-css": "^1.4.0",
    "typescript": "~7.0.2"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

- [ ] **Step 2: Criar `packages/ui/scripts/gen-barrel.mjs`** — gera `src/index.ts` a partir dos arquivos existentes em `src/components` (fonte única, sem listar os 100+ nomes na mão):

```js
// Gera src/index.ts re-exportando todo componente em src/components.
// Fonte única de verdade: os próprios arquivos do pacote.
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const COMPONENTS_DIR = join(ROOT, "src/components");
const OUT_FILE = join(ROOT, "src/index.ts");

const names = readdirSync(COMPONENTS_DIR)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))
  .sort();

const lines = names.map((name) => `export * from "./components/${name}";`);
writeFileSync(OUT_FILE, `${lines.join("\n")}\n`);

console.log(`gen-barrel: src/index.ts gerado com ${names.length} módulos.`);
```

> **Risco conhecido:** `export *` propaga colisão se dois componentes exportarem
> o mesmo identificador. Se o build (Step 5) falhar com "Multiple exports with
> the same name", troque a linha do arquivo culpado neste script/gerado para
> `export * as <Nome> from "./components/<nome>";` (namespace import) só para
> esse componente.

- [ ] **Step 3: Criar `packages/ui/scripts/append-font-import.mjs`** — evita depender de como o Tailwind CLI trataria um `@import` remoto; adiciona a linha depois do build, garantindo `@import` no topo do CSS (exigência da spec CSS):

```js
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT_FILE = join(ROOT, "dist/style.css");
const FONT_IMPORT = '@import "https://assets.adila.co/adila-fonts.css";\n';

const css = readFileSync(OUT_FILE, "utf8");
writeFileSync(OUT_FILE, FONT_IMPORT + css);

console.log("append-font-import: @import de adila-fonts.css adicionado ao topo do dist/style.css.");
```

- [ ] **Step 4: Criar `packages/ui/tsup.config.ts`**

```ts
import path from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(import.meta.dirname, "src"),
    };
  },
});
```

> `tsup.config.ts` roda como ESM (o `package.json` do pacote tem
> `"type": "module"`) — `__dirname` não existe nesse contexto; use
> `import.meta.dirname` (mesmo padrão já usado em `apps/docs/vite.config.ts`).

- [ ] **Step 5: Instalar dependências do pacote e buildar o JS**

```bash
bun install
bun run --cwd packages/ui build:js
```

Expected: `packages/ui/src/index.ts` é gerado; `packages/ui/dist/index.js`, `dist/index.cjs` e `dist/index.d.ts` existem. Se falhar com colisão de exports, aplique o fallback do Step 2.

- [ ] **Step 6: Verificar o typecheck do pacote**

```bash
bun run --cwd packages/ui typecheck
```

Expected: passa sem erros (os imports `@/components/x`, `@/lib/utils`, `@/hooks/use-mobile` resolvem via `paths` do `tsconfig.json` da Task 2).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: build JS de packages/ui com tsup + barrel automático"
```

---

### Task 4: Build CSS pré-compilado do pacote com `@tailwindcss/cli`

**Files:**
- Create: `packages/ui/src/styles/index.css`

**Interfaces:**
- Consumes: `packages/ui/src/styles/adila-tokens.css` (Task 2), estrutura de `src/components` (Task 2) para o `@source`.
- Produces: `packages/ui/dist/style.css` — consumido pela Task 5 (smoke) e pela Task 6 (`apps/docs` importa `@adila-sh/ui/style.css`).

- [ ] **Step 1: Criar `packages/ui/src/styles/index.css`**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "./adila-tokens.css";

/* garante que o Tailwind resolva as classes usadas dentro dos componentes */
@source "../components";
```

- [ ] **Step 2: Buildar o CSS**

```bash
bun run --cwd packages/ui build:css
```

Expected: `packages/ui/dist/style.css` existe, começa com a linha
`@import "https://assets.adila.co/adila-fonts.css";` e contém as variáveis
`--primary`, `--background` etc. (tokens) tanto em `:root` quanto em `.dark`.

- [ ] **Step 3: Verificar visualmente que os tokens de light e dark realmente diferem** (mesma checagem que o antigo `smoke-test.mjs` fazia para o registry, adaptada ao novo artefato):

```bash
node -e '
const css = require("node:fs").readFileSync("packages/ui/dist/style.css", "utf8");
const root = css.match(/:root\s*\{([^}]*)\}/)?.[1] ?? "";
const dark = css.match(/\.dark\s*\{([^}]*)\}/)?.[1] ?? "";
const bg = (block) => block.match(/--background:\s*([^;]+);/)?.[1]?.trim();
const rootBg = bg(root);
const darkBg = bg(dark);
if (!rootBg || !darkBg) throw new Error("tokens --background ausentes");
if (rootBg === darkBg) throw new Error("light e dark têm o mesmo --background");
console.log("OK: light !== dark (" + rootBg + " vs " + darkBg + ")");
'
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: build CSS pré-compilado de packages/ui via @tailwindcss/cli"
```

---

### Task 5: Testar o pacote localmente antes de plugar no resto do monorepo

**Files:**
- Create: `/tmp/adila-ui-smoke/` (projeto de teste descartável, fora do repo)

**Interfaces:**
- Consumes: `packages/ui/dist/*` (Tasks 3 e 4).
- Produces: confirmação de que `import { Button } from '@adila-sh/ui'` + `import '@adila-sh/ui/style.css'` funciona como um consumidor externo veria, antes de propagar a mudança para `apps/docs` (Task 6).

- [ ] **Step 1: Criar um projeto Vite+React descartável fora do repo e linkar o pacote local**

```bash
mkdir -p /tmp/adila-ui-smoke
cd /tmp/adila-ui-smoke
bun create vite . --template react-ts
bun install
bun add /home/sousa/work/adila/system-design/packages/ui
```

- [ ] **Step 2: Editar `/tmp/adila-ui-smoke/src/App.tsx`**

```tsx
import '@adila-sh/ui/style.css';
import { Button } from '@adila-sh/ui';

export default function App() {
  return <Button>Funciona</Button>;
}
```

- [ ] **Step 3: Rodar o dev server e confirmar visualmente**

```bash
cd /tmp/adila-ui-smoke
bun run dev
```

Expected: abre em `localhost:5173`, renderiza um botão estilizado com os tokens
adila.co (indigo, cantos arredondados), sem nenhum erro de "Tailwind classes
não encontradas" no console — prova que o CSS pré-compilado é suficiente.

- [ ] **Step 4: Limpar o projeto de teste**

```bash
rm -rf /tmp/adila-ui-smoke
cd /home/sousa/work/adila/system-design
```

> Nenhum commit nesta task — é só verificação, não produz artefato no repo.

---

### Task 6: Migrar `apps/docs` para consumir `@adila-sh/ui`

**Files:**
- Modify: `apps/docs/src/routes/**/*.tsx` (3 arquivos com `@/components/ui/*`)
- Modify: `apps/docs/src/components/*.tsx` (5 arquivos fora de `ui/`: `command-menu.tsx`, `new-transaction-drawer.tsx`, `showcase-pages.tsx`, `not-found.tsx`, `data-table.tsx`)
- Modify: `apps/docs/content/docs/components/*.mdx` (103 arquivos, import da preview)
- Modify: `apps/docs/src/styles/app.css`
- Modify: `apps/docs/vite.config.ts`

**Interfaces:**
- Consumes: `@adila-sh/ui` buildado (Tasks 3 e 4), resolvido via `workspace:*` (bun symlink).
- Produces: `apps/docs` sem nenhuma referência a `@/components/ui/*` — tudo migrado para `@adila-sh/ui`.

- [ ] **Step 1: Trocar toda referência a `@/components/ui/<nome>` por `@adila-sh/ui`** (o barrel exporta tudo, então não importa mais de qual arquivo original vinha):

```bash
grep -rlZ '@/components/ui/[a-z0-9-]*' \
  apps/docs/src/routes apps/docs/src/components apps/docs/content \
  | xargs -0 sed -i -E "s#(['\"])@/components/ui/[a-z0-9-]+\1#\1@adila-sh/ui\1#g"
```

- [ ] **Step 2: Confirmar que não sobrou nenhuma referência**

```bash
grep -rl '@/components/ui/' apps/docs/src apps/docs/content \
  && echo "AINDA HÁ REFERÊNCIAS — corrigir" \
  || echo "OK: nenhuma referência a @/components/ui/ restante em apps/docs"
```

- [ ] **Step 3: Reescrever `apps/docs/src/styles/app.css`**

```css
@import "tailwindcss";
/* shadcn.css mapeia --color-fd-* para os tokens shadcn (--primary, ...),
   unificando o tema Fumadocs com o design system adila.co. */
@import "fumadocs-ui/css/shadcn.css";
@import "fumadocs-ui/css/preset.css";
@import "tw-animate-css";
@import "@adila-sh/ui/style.css";

html {
  scrollbar-gutter: stable;
}

html > body[data-scroll-locked] {
  margin-right: 0px !important;
  --removed-body-scroll-bar-size: 0px !important;
}

/* Scrollbar fino e discreto — adapta a light/dark via tokens.
   O thumb usa border transparente + background-clip para parecer fino
   dentro de uma track mais larga (mais fácil de acertar com o mouse). */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background: transparent;
}
```

> Removidos: `@import "./fonts.css"` e `@import "./adila-tokens.css"` (agora
> embutidos em `@adila-sh/ui/style.css`) e `@source '../components'` (os
> primitives não vivem mais dentro de `apps/docs`, então não há mais nada ali
> pro Tailwind escanear; o restante do `@source` automático do Tailwind v4
> continua cobrindo os arquivos próprios de `apps/docs`).
>
Confirme que `fonts.css` não é mais referenciado por nenhum outro arquivo e remova-o:

```bash
grep -rl "fonts.css" apps/docs/src apps/docs/content 2>/dev/null \
  && echo "fonts.css ainda referenciado — não remover" \
  || git rm apps/docs/src/styles/fonts.css
```

- [ ] **Step 4: Ajustar `apps/docs/vite.config.ts`** para rodar o `tsup --watch` de `packages/ui` em paralelo durante o dev (preview ao vivo com HMR ao editar um componente do DS). Não existe um plugin Vite nativo pra "rodar processo externo"; a forma simples e explícita é documentar o comando de dev combinado no `README.md` da raiz (Task 8) em vez de acoplar isso ao `vite.config.ts` — **não altere `vite.config.ts` nesta task além de nada**; ele já resolve `@adila-sh/ui` normalmente via `node_modules` (symlink do workspace bun), sem precisar de alias extra.

- [ ] **Step 5: Rodar o app em dev e confirmar visualmente**

```bash
bun run --cwd packages/ui dev &
bun run --cwd apps/docs dev &
sleep 5
curl -sf http://localhost:3000/docs/components/button > /dev/null && echo "OK: página do Button responde 200"
kill %1 %2
```

- [ ] **Step 6: Typecheck completo**

```bash
bun run typecheck
```

Expected: passa sem erros em `packages/ui` e `apps/docs`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: apps/docs passa a consumir @adila-sh/ui"
```

---

### Task 7: Remover o registry shadcn

**Files:**
- Delete: `apps/docs/scripts/gen-registry.mjs`
- Delete: `apps/docs/scripts/smoke-test.mjs` (testava especificamente `/r/*.json` — sem substituto direto; a Task 5 já cobre o smoke test do pacote)
- Modify: `apps/docs/scripts/gen-docs.mjs` (lê `packages/ui/src/components` em vez de `registry.json`)
- Modify: `apps/docs/vite.config.ts` (remove a regra CORS de `/r/**`)
- Modify: `apps/docs/package.json` (remove script `smoke`)
- Delete: dependência `shadcn` (CLI) — não é mais usada em nenhum lugar do monorepo

**Interfaces:**
- Consumes: `packages/ui/src/components` (Task 2) como nova fonte de verdade para `gen-docs.mjs`.
- Produces: nenhum artefato HTTP de registry; `content/docs/components/meta.json` continua sendo gerado a partir dos componentes reais do pacote.

- [ ] **Step 1: Remover os scripts obsoletos**

```bash
git rm apps/docs/scripts/gen-registry.mjs apps/docs/scripts/smoke-test.mjs
```

- [ ] **Step 2: Reescrever `apps/docs/scripts/gen-docs.mjs`** para ler direto de `packages/ui/src/components` (sem depender de `registry.json`, que não existe mais):

```js
// Gera páginas-base de documentação (MDX) para cada componente do pacote
// @adila-sh/ui. Cria content/docs/components/<name>.mdx se ainda não existir
// (não sobrescreve docs curadas escritas à mão); sempre regenera o meta.json.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const UI_DIR = join(ROOT, "../../packages/ui/src/components")
const DOCS_DIR = join(ROOT, "content/docs/components")

/** Extrai os nomes exportados de um componente. */
function exportsOf(file) {
  const src = readFileSync(join(UI_DIR, file), "utf8")
  const names = new Set()
  for (const m of src.matchAll(/export\s+(?:function|const)\s+([A-Za-z0-9_]+)/g))
    names.add(m[1])
  for (const block of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of block[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim()
      if (name && /^[A-Z]/.test(name)) names.add(name)
    }
  }
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
  const importLine = exps.length
    ? `import { ${exps.join(", ")} } from '@adila-sh/ui';`
    : `import '@adila-sh/ui';`

  const body = `---
title: ${titleOf(name)}
description: Componente ${name} do design system adila.co, sobre Base UI.
---

## Instalação

\`\`\`bash
bun add @adila-sh/ui
\`\`\`

## Uso

\`\`\`tsx
${importLine}
\`\`\`
`

  writeFileSync(out, body)
  created++
}

writeFileSync(
  join(DOCS_DIR, "meta.json"),
  JSON.stringify({ title: "Componentes", pages: allNames }, null, 2) + "\n",
)

console.log(
  `gen-docs: ${created} páginas-base criadas, ${allNames.length} no meta.json.`,
)
```

> A seção "Dependências" / "Componentes relacionados" que o script antigo
> derivava do `registry.json` (`dependencies`/`registryDependencies`) some do
> stub gerado — essa informação não tem mais uma fonte estruturada equivalente
> sem o registry. Docs curadas à mão que já tinham essas seções continuam
> intactas (o script só gera stub pra quem não existe ainda).

- [ ] **Step 3: Remover a regra CORS de `/r/**` em `apps/docs/vite.config.ts`**

```ts
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    mdx(),
    tailwindcss(),
    // Prerender desligado: o plugin do TanStack pré-bundla @radix-ui (via
    // Fumadocs/cmdk) em _libs importando `tslib` de forma que o trace do
    // nitro copia incompleto. SSR sob demanda no runtime serve os docs;
    // scripts/fix-tslib.mjs garante o tslib completo no .output.
    tanstackStart({
      prerender: {
        enabled: false,
      },
    }),
    react(),
    // Railway: servidor Node standalone (respeita process.env.PORT).
    nitro({
      preset: 'node-server',
    }),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: 'tslib/tslib.es6.js',
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
});
```

- [ ] **Step 4: Remover o script `smoke` de `apps/docs/package.json`** (dependia do `/r/**`, que não existe mais):

Edite `apps/docs/package.json`, removendo a linha `"smoke": "node scripts/smoke-test.mjs",`. Remova também `"smoke": "bun run --cwd apps/docs smoke"` do `package.json` da raiz.

- [ ] **Step 5: Confirmar que `shadcn` (CLI) não é mais dependência de ninguém**

```bash
grep -rl '"shadcn":' apps/docs/package.json packages/ui/package.json package.json 2>/dev/null \
  && echo "AINDA REFERENCIADO" || echo "OK: shadcn (CLI) removido do monorepo"
```

- [ ] **Step 6: Rodar `gen:docs` e confirmar que o `meta.json` bate com os 103 componentes reais**

```bash
bun run --cwd apps/docs gen:docs
cat apps/docs/content/docs/components/meta.json | node -e 'const d=JSON.parse(require("fs").readFileSync(0));console.log(d.pages.length + " componentes no meta.json")'
```

Expected: `103 componentes no meta.json` (ou o número atual de arquivos em `packages/ui/src/components`).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remover o registry HTTP shadcn"
```

---

### Task 8: Atualizar README, Dockerfile e `railway.json` para o monorepo

**Files:**
- Modify: `README.md` (raiz)
- Modify: `Dockerfile` (raiz)
- Modify: `railway.json` (raiz) — sem mudanças de conteúdo, só confirma que ainda aponta pro `Dockerfile` certo

**Interfaces:**
- Consumes: toda a estrutura final das Tasks 1–7.
- Produces: instruções corretas para (a) times consumindo `@adila-sh/ui` e (b) deploy do `apps/docs` no Railway a partir da raiz do monorepo.

- [ ] **Step 1: Reescrever `README.md`**

```markdown
# adila.co Design System

Design system adila.co publicado como pacote npm (`@adila-sh/ui`) no GitHub
Packages, com um app de documentação (`apps/docs`, Fumadocs + TanStack Start)
mantido no mesmo monorepo.

## Instalar o pacote

```bash
# .npmrc do projeto consumidor
echo '@adila-sh:registry=https://npm.pkg.github.com' >> .npmrc
echo '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' >> .npmrc

bun add @adila-sh/ui
```

```tsx
import '@adila-sh/ui/style.css';
import { Button } from '@adila-sh/ui';
```

Nenhuma configuração de Tailwind é necessária — o CSS já vem pré-compilado
(tokens adila.co: indigo, neutros ChatGPT, Adila Std / Adila Code / Adila
Pixel, light + dark).

## Estrutura do monorepo

```
apps/docs/    # site de documentação (Fumadocs) + landing — privado, não publicado
packages/ui/  # @adila-sh/ui — pacote publicado no GitHub Packages
```

## Desenvolvimento

```bash
bun install
bun run --cwd packages/ui dev &   # tsup --watch, pra HMR ao editar um componente
bun run --cwd apps/docs dev       # site de docs em localhost:3000
```

## Adicionar um componente ao DS

```bash
cd packages/ui
npx shadcn@latest add <componente>   # entra em src/components
cd ../..
bun run --cwd apps/docs gen:docs     # cria a doc-base + atualiza meta.json
```

## Build e publish

- `bun run --cwd packages/ui build` — builda JS (tsup) + CSS pré-compilado
  (`@tailwindcss/cli`) em `packages/ui/dist`.
- Versionamento via Changesets: `bunx changeset add` descreve a mudança;
  merge na `main` dispara o workflow `.github/workflows/release.yml`, que
  abre um PR de versão e, quando esse PR é merged, publica automaticamente
  `@adila-sh/ui` no GitHub Packages.

## Deploy (Railway) do app de docs

`railway.json` usa Nixpacks/Dockerfile a partir da raiz do monorepo:
`bun install` (raiz) → `bun run --cwd packages/ui build && bun run --cwd
apps/docs build` → `node apps/docs/.output/server/index.mjs`.

> **Nota técnica:** o prerender do `apps/docs` fica desligado e há um passo
> `fix-tslib` no build. O plugin do TanStack pré-bundla `@radix-ui` (via
> Fumadocs/cmdk) importando `tslib` de um jeito que o trace do nitro copia
> incompleto; `apps/docs/scripts/fix-tslib.mjs` copia o `tslib` completo para
> o `.output`.

## Tokens e fontes

Fonte canônica dos tokens: `packages/ui/src/styles/adila-tokens.css`. Fontes
Adila Std/Code/Pixel self-hosted no R2
(`https://assets.adila.co/adila-fonts.css`), importadas automaticamente no
topo de `packages/ui/dist/style.css`.
```

- [ ] **Step 2: Reescrever o `Dockerfile`**

```dockerfile
# --- build stage (bun) ---
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/docs/package.json apps/docs/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN bun install --frozen-lockfile
COPY . .
RUN bun run --cwd packages/ui build
RUN bun run --cwd apps/docs build

# --- runtime stage (node) ---
# o output do nitro (node-server) roda em node; imagem enxuta pro runtime.
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/docs/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

- [ ] **Step 3: Confirmar que `railway.json` não precisa mudar** (já aponta pro `Dockerfile` da raiz e pro `startCommand` que o Dockerfile acima ainda satisfaz):

```bash
cat railway.json
```

Expected: `dockerfilePath: "Dockerfile"` e `startCommand: "node .output/server/index.mjs"` — ambos continuam válidos porque o runtime stage do Dockerfile copia `.output` pra raiz da imagem, igual antes.

- [ ] **Step 4: Testar o build Docker localmente**

```bash
docker build -t adila-ds-docs .
docker run --rm -p 3000:3000 adila-ds-docs &
sleep 3
curl -sf http://localhost:3000/docs > /dev/null && echo "OK: imagem Docker serve /docs"
kill %1
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: atualizar README, Dockerfile pro monorepo"
```

---

### Task 9: Configurar Changesets

**Files:**
- Create: `.changeset/config.json`
- Create: `.changeset/README.md` (gerado pelo `changeset init`)
- Create: `.changeset/<nome-aleatório>.md` (primeiro changeset, registrando a mudança desta migração)

**Interfaces:**
- Consumes: `packages/ui/package.json` com `"version": "0.0.0"` (Task 3) — Changesets vai gerenciar essa versão a partir de agora.
- Produces: `.changeset/config.json` configurado para ignorar `apps/docs` — consumido pelo workflow da Task 10.

- [ ] **Step 1: Instalar e inicializar o Changesets na raiz**

```bash
# rode a partir da raiz do repo — `bun add` sem --cwd instala no package.json
# do diretório atual, que aqui é o manifesto de workspace
bun add -D @changesets/cli
bunx changeset init
```

- [ ] **Step 2: Editar `.changeset/config.json`** para ignorar `apps/docs` (nunca deve ser versionado/publicado):

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@adila-sh/docs"]
}
```

> `"access": "restricted"` é o correto para GitHub Packages (não é um
> registro público estilo npmjs.com — todo pacote ali exige autenticação,
> então não existe "public" no sentido do npm).

- [ ] **Step 3: Criar o primeiro changeset, documentando a migração**

```bash
bunx changeset add
```

Responda ao prompt interativo: selecione `@adila-sh/ui`, bump `minor` (é uma
mudança de distribuição visível para quem consome o pacote, ainda que seja a
primeira versão real), com a mensagem:

```
Publica @adila-sh/ui pela primeira vez no GitHub Packages — substitui o
registry HTTP shadcn por um pacote npm compilado (JS + CSS pré-compilado).
```

- [ ] **Step 4: Verificar que o changeset foi criado**

```bash
ls .changeset/*.md | grep -v README.md
```

Expected: um arquivo `.md` novo, diferente de `.changeset/README.md`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: configurar Changesets para packages/ui"
```

---

### Task 10: Workflow do GitHub Actions para publish automático

**Files:**
- Create: `.github/workflows/release.yml`
- Create: `.npmrc` (raiz)

**Interfaces:**
- Consumes: `.changeset/config.json` (Task 9), `packages/ui/package.json` com `publishConfig.registry` (Task 3).
- Produces: pipeline de CI que, a cada push em `main` com changesets pendentes, abre um PR de versão; quando esse PR é merged, publica `@adila-sh/ui` no GitHub Packages.

- [ ] **Step 1: Criar `.npmrc` na raiz** (usado tanto pelo workflow quanto por qualquer dev publicando manualmente como fallback):

```ini
@adila-sh:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

- [ ] **Step 2: Criar `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

permissions:
  contents: write
  pull-requests: write
  packages: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: 'https://npm.pkg.github.com'
          scope: '@adila-sh'

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build @adila-sh/ui
        run: bun run --cwd packages/ui build

      - name: Create Release PR or publish
        uses: changesets/action@v1
        with:
          publish: bunx changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 3: Validar o YAML localmente** (sintaxe, sem precisar rodar em CI de verdade):

```bash
python3 -c "import yaml, sys; yaml.safe_load(open('.github/workflows/release.yml')); print('OK: YAML válido')"
```

(Se `pyyaml` não estiver disponível, alternativa: `bunx js-yaml .github/workflows/release.yml > /dev/null && echo "OK: YAML válido"`.)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "ci: workflow de release automático (changesets + GitHub Packages)"
```

- [ ] **Step 5: Push e verificação real em CI**

```bash
git push origin main
```

Depois do push, confirme no GitHub (aba Actions) que o workflow `Release`
rodou e abriu um PR "Version Packages". Faça merge desse PR manualmente
uma única vez para confirmar que o publish real funciona (verifique em
`https://github.com/orgs/adila-sh/packages` que `@adila-sh/ui` apareceu).

> Esta é a única etapa do plano com efeito em um sistema compartilhado fora
> do repositório local (push pra `main` + primeiro publish real no GitHub
> Packages da org). Confirme com o time antes de rodar o Step 5.

---

## Self-Review

**Cobertura do spec:**
- Estrutura workspaces (`apps/docs` + `packages/ui`) → Tasks 1–2. ✓
- Build JS (tsup) → Task 3. ✓
- Build CSS pré-compilado, sem Tailwind no consumidor → Task 4. ✓
- Fontes via `@import` remoto, sem duplicar `.woff2` → Task 3 Step 3 (`append-font-import.mjs`). ✓
- `apps/docs` consumindo `@adila-sh/ui`, preview ao vivo via `tsup --watch` → Task 6. ✓
- Remoção do registry shadcn (`gen-registry.mjs`, `registry.json`, `/r/**`, CORS, dep `shadcn`) → Task 7. ✓
- README com instruções `bun add @adila-sh/ui` → Task 8. ✓
- Changesets configurado, ignorando `apps/docs` → Task 9. ✓
- GitHub Actions publicando no GitHub Packages via `GITHUB_TOKEN` → Task 10. ✓
- Riscos do spec (migração de imports, CSS sem tree-shaking, bun workspaces + Railway, auth do GitHub Packages) → tratados nas Tasks 1, 4 (Step 3 confirma tokens), 6 (Step 1 é o codemod de imports) e 8 (Dockerfile monorepo). ✓

Nenhum gap encontrado.
