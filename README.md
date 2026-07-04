# adila.co UI Registry

Design system adila.co em um **app único**: documentação **Fumadocs** + **registry
shadcn HTTP** sobre **Base UI**. Stack: **TanStack Start** (Vite) + React +
TypeScript + Tailwind v4.

Outros projetos consomem os componentes com a CLI do shadcn:

```bash
# tema (tokens adila.co: indigo adila.co, neutros ChatGPT, Circular Std / JetBrains Mono)
npx shadcn@latest add https://ds.adila.co/r/adila-theme.json

# componentes individuais
npx shadcn@latest add https://ds.adila.co/r/button.json
npx shadcn@latest add https://ds.adila.co/r/dialog.json
```

## Arquitetura

Um único app TanStack Start serve **as três coisas**:

- **Docs Fumadocs** (`/docs`) — MDX por componente, busca, preview ao vivo.
- **Registry** (`/r/*.json`) — arquivos estáticos servidos com CORS.
- **Landing** (`/`) — home do design system.

O tema é unificado: `fumadocs-ui/css/shadcn.css` mapeia `--color-fd-*` para os
tokens shadcn, então **o Fumadocs e os componentes usam a mesma paleta adila.co**.

## Como funciona o registry

- `src/styles/adila-tokens.css` — **fonte canônica** dos tokens (light/dark, OKLCH).
- `src/components/ui/` — os primitives Base UI publicados (fonte única; os docs
  importam exatamente estes arquivos para o preview ao vivo).
- `scripts/gen-registry.mjs` — gera `registry.json` varrendo os componentes
  (deps npm + registryDependencies) e extraindo os tokens de `adila-tokens.css`.
- `shadcn build` — transforma `registry.json` em `public/r/*.json`.
- TanStack Start serve `public/` (com CORS em `/r/**` via `routeRules`).

```
adila-tokens.css ─┐
                ├─gen-registry─► registry.json ─shadcn build─► public/r/*.json ─(TanStack)─► HTTP
components/ui/ ─┘
```

## Scripts

| Comando | Ação |
|---------|------|
| `npm run dev` | App em desenvolvimento (docs + registry). |
| `npm run registry` | Regenera `registry.json` e builda `public/r/*.json`. |
| `npm run build` | `registry` + `vite build` (+ fix-tslib) → `.output/`. |
| `npm run start` | Sobe o node server de produção (`.output/server`). |
| `npm run typecheck` | `fumadocs-mdx` + `tsc --noEmit`. |
| `npm run smoke` | Valida os JSON do registry + testa HTTP/CORS. |

## Adicionar um componente ao registry

```bash
npx shadcn@latest add <componente>   # entra em src/components/ui/
npm run registry                     # regenera registry + doc-base + meta.json
```

`scripts/gen-docs.mjs` cria uma página-base em `content/docs/components/<nome>.mdx`
(instalação + uso + dependências) para todo componente que ainda não tem doc, e
regenera o `meta.json` da sidebar. Para um **preview ao vivo**, edite o MDX
importando o componente e usando `<Preview>`:

```mdx
import { Button } from '@/components/ui/button';

<Preview>
  <Button>Primary</Button>
</Preview>
```

Docs escritas à mão são preservadas (o gerador só cria as que faltam).

## Deploy (Railway)

`railway.json` usa Nixpacks: `npm run build` no build, `npm run start` no
runtime. O nitro gera um node server (`.output/server`) que respeita `PORT`. Um
`Dockerfile` multi-stage também está incluído como alternativa.

> **Nota técnica:** o prerender fica desligado e há um passo `fix-tslib` no
> build. O plugin do TanStack pré-bundla `@radix-ui` (via Fumadocs/cmdk)
> importando `tslib` de um jeito que o trace do nitro copia incompleto;
> `scripts/fix-tslib.mjs` copia o `tslib` completo para o `.output`.

## Tokens

Convertidos do **adila.co UI Design Standard** para OKLCH. Acento primário
`#3A4BE5` (indigo adila.co); paleta neutra estilo ChatGPT; light + dark obrigatórios.
Para rebrandizar, edite `src/styles/adila-tokens.css` e rode `npm run registry`.

## Fonte (Circular Std)

A `--font-sans` é a **Circular Std**, servida via `@font-face` self-hosted no
R2 (`https://assets.adila.co/fonts/woff2/CircularStd-*.woff2`).

- **App:** importa `src/styles/fonts.css` (bundled); preload das críticas
  (Book/Medium) em `src/routes/__root.tsx`.
- **Consumidores do registry:** o item `adila-theme` injeta
  `@import "https://assets.adila.co/adila-fonts.css"` no CSS global via o campo
  `css` — a fonte carrega sozinha ao rodar `shadcn add adila-theme`.

`gen-registry` copia `src/styles/fonts.css` → `adila-fonts.css` (raiz, gerado).
**Subir esse arquivo na raiz do bucket R2** para que fique disponível em
`https://assets.adila.co/adila-fonts.css`.
