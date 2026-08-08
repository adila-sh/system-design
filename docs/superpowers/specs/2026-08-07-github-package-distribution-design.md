# Distribuir o design system como pacote npm no GitHub Packages

Data: 2026-08-07

## Contexto

Hoje o adila.co Design System é distribuído via **registry HTTP do shadcn**:
outros repositórios rodam `npx shadcn add https://ds.adila.co/r/button.json`,
o que **copia o código-fonte** do componente para dentro do consumidor. O
projeto é um único app TanStack Start que serve três coisas: docs Fumadocs
(`/docs`), registry (`/r/*.json`) e landing (`/`).

Este spec substitui o modelo de registry por um **pacote npm compilado**
(`@adila-sh/ui`), publicado no **GitHub Packages** (`npm.pkg.github.com`),
consumido como dependência normal (`import { Button } from '@adila-sh/ui'`).

## Objetivo

- Consumidores instalam `@adila-sh/ui` como dependência versionada, sem copiar
  código-fonte.
- Nenhuma configuração de Tailwind é exigida do consumidor — o pacote entrega
  um CSS já pré-compilado com todos os utilitários resolvidos.
- O site de documentação (`ds.adila.co`) continua existindo para docs e
  landing, mas deixa de servir os JSONs de registry.
- Versionamento e publish são automatizados via Changesets + GitHub Actions.

## Não-objetivos

- Não mantém compatibilidade retroativa com `npx shadcn add` — o registry HTTP
  é removido, não apenas descontinuado em paralelo.
- Não publica no npm público (npmjs.com) — GitHub Packages é aceito mesmo
  exigindo autenticação para instalar (consumidores são times internos
  adila.co com acesso à org GitHub).
- Não expande para múltiplos pacotes (`@adila-sh/tokens`, `@adila-sh/fonts`
  separados) — um único pacote `@adila-sh/ui` cobre componentes + tokens CSS +
  referência às fontes.

## Estrutura do repositório

Migração de app único para monorepo com workspaces (bun):

```
system-design/
├── apps/
│   └── docs/                  # TanStack Start + Fumadocs, "private": true
│       ├── src/routes/...
│       ├── content/docs/...
│       └── package.json       # deps do site: fumadocs-*, @tanstack/*, nitro, etc.
├── packages/
│   └── ui/                    # @adila-sh/ui — pacote publicado
│       ├── src/
│       │   ├── components/    # primitives Base UI (movidos de src/components/ui)
│       │   ├── styles/
│       │   │   ├── adila-tokens.css   # fonte canônica dos tokens (light/dark, OKLCH)
│       │   │   └── index.css          # entry Tailwind p/ CSS pré-compilado
│       │   └── index.ts       # barrel export de todos os componentes
│       └── package.json       # deps mínimas de runtime
├── package.json                # root: workspaces, changesets, scripts orquestradores
└── .github/workflows/release.yml
```

- `adila-tokens.css` passa a existir só em `packages/ui` (fonte única); o app
  de docs importa do pacote via workspace, sem cópia própria.
- `apps/docs` resolve `@adila-sh/ui` via `workspace:*` (symlink do bun). Para
  preview ao vivo com HMR durante `dev`, o pacote roda em modo watch
  (`tsup --watch`) em paralelo ao dev server do app.

## Build do pacote

- **JS**: `tsup` (esbuild) em `packages/ui`. Um entry point por componente
  (tree-shaking real) + barrel `index.ts`. Saída: ESM + CJS + `.d.ts`.
- **CSS pré-compilado**: `@tailwindcss/cli` roda sobre `src/styles/index.css`
  (`@import "tailwindcss"` + `@source` apontando para `src/components`) e
  gera `dist/style.css` com todas as classes utilitárias já resolvidas e os
  tokens OKLCH (light/dark) embutidos.
- **Fontes**: `dist/style.css` mantém
  `@import "https://assets.adila.co/adila-fonts.css"` — as famílias Adila
  Std/Code/Pixel continuam self-hosted no R2, sem duplicar `.woff2` dentro do
  pacote npm.
- Consumidor final:
  ```ts
  import '@adila-sh/ui/style.css';
  import { Button } from '@adila-sh/ui';
  ```
  Nenhuma configuração de Tailwind é necessária no lado do consumidor.

## Versionamento, CI e publish

- **Changesets** (`@changesets/cli`) configurado na raiz, aplicável apenas a
  `packages/ui` (`apps/docs` é privado e ignorado nos changesets).
- Fluxo:
  1. PR que muda `packages/ui` inclui `bunx changeset add` descrevendo o bump
     (patch/minor/major).
  2. Merge na `main` dispara `.github/workflows/release.yml`
     (`changesets/action`):
     - Changesets pendentes → abre/atualiza PR "Version Packages" com bump e
       changelog automáticos.
     - PR "Version Packages" merged → publica `@adila-sh/ui` no GitHub
       Packages usando o `GITHUB_TOKEN` do próprio Actions (permissão
       `packages: write`), sem PAT manual.
- `packages/ui/package.json`:
  ```json
  {
    "name": "@adila-sh/ui",
    "publishConfig": { "registry": "https://npm.pkg.github.com" }
  }
  ```
- Consumidores configuram `.npmrc`:
  ```
  @adila-sh:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN_OU_PAT}
  ```
  e instalam com `bun add @adila-sh/ui` (ou equivalente npm/pnpm/yarn).

## Descomissionamento do registry shadcn

Removidos:
- `scripts/gen-registry.mjs`, `registry.json` (raiz), passo `shadcn build`.
- Pasta `public/r/*.json` e a regra de CORS em `/r/**` (`routeRules`).
- Dependência `shadcn` (CLI) do app de docs.

Ajustados:
- `scripts/gen-docs.mjs` (gera stub MDX por componente) passa a ler a lista de
  componentes direto de `packages/ui/src/components`, em vez de
  `registry.json`.
- README raiz: troca os exemplos `npx shadcn add https://ds.adila.co/r/...`
  por `bun add @adila-sh/ui` + `import '@adila-sh/ui/style.css'`.

Preservado:
- Docs Fumadocs (`ds.adila.co`) continuam existindo — preview ao vivo, busca,
  landing — só deixam de expor os JSONs de registry.
- Deploy Railway do app de docs (`apps/docs`) continua igual, apontando para
  o novo caminho dentro do monorepo.

## Riscos / pontos de atenção

- **Migração de imports**: mover `src/components/ui` para
  `packages/ui/src/components` exige atualizar todos os imports internos do
  app de docs e das MDX de exemplo.
- **CSS pré-compilado sem tree-shaking**: como o CSS é gerado a partir de
  *todos* os componentes do pacote (não do uso real do consumidor), o
  `style.css` inclui classes de componentes que o consumidor talvez não use —
  aceito como trade-off (mesmo padrão de bibliotecas como MUI/Ant).
- **Bun workspaces + Railway build**: o Dockerfile/Nixpacks do deploy do app
  de docs precisa rodar a instalação a partir da raiz do monorepo (`bun install`
  na raiz) para resolver o workspace `@adila-sh/ui` corretamente.
- **GitHub Packages exige auth mesmo em pacote público**: aceito
  explicitamente — consumidores são times internos com acesso à org
  `adila-sh`.

## Testes / verificação

- `packages/ui`: build (`tsup` + `@tailwindcss/cli`) roda sem erros; `dist/`
  contém `index.js`, `index.d.ts`, `style.css`.
- Instalação de fumaça: em um projeto de teste separado, `bun add
  @adila-sh/ui` (apontando pro GitHub Packages) + import de um componente +
  `import '@adila-sh/ui/style.css'` renderiza com os tokens corretos (light e
  dark).
- `apps/docs` continua buildando e servindo `/docs` e `/` sem referências a
  `/r/*.json`.
- Workflow `release.yml` testado em um changeset dummy (dry-run ou branch de
  teste) antes de rodar contra `main` de verdade.
