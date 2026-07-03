# LAI UI Registry

Design system LAI em um **app único**: documentação **Fumadocs** + **registry
shadcn HTTP** sobre **Base UI**. Stack: **TanStack Start** (Vite) + React +
TypeScript + Tailwind v4.

Outros projetos consomem os componentes com a CLI do shadcn:

```bash
# tema (tokens LAI: verde LAI, neutros ChatGPT, Inter/JetBrains Mono)
npx shadcn@latest add https://<host>/r/lai-theme.json

# componentes individuais
npx shadcn@latest add https://<host>/r/button.json
npx shadcn@latest add https://<host>/r/dialog.json
```

## Arquitetura

Um único app TanStack Start serve **as três coisas**:

- **Docs Fumadocs** (`/docs`) — MDX por componente, busca, preview ao vivo.
- **Registry** (`/r/*.json`) — arquivos estáticos servidos com CORS.
- **Landing** (`/`) — home do design system.

O tema é unificado: `fumadocs-ui/css/shadcn.css` mapeia `--color-fd-*` para os
tokens shadcn, então **o Fumadocs e os componentes usam a mesma paleta LAI**.

## Como funciona o registry

- `src/styles/lai-tokens.css` — **fonte canônica** dos tokens (light/dark, OKLCH).
- `src/components/ui/` — os primitives Base UI publicados (fonte única; os docs
  importam exatamente estes arquivos para o preview ao vivo).
- `scripts/gen-registry.mjs` — gera `registry.json` varrendo os componentes
  (deps npm + registryDependencies) e extraindo os tokens de `lai-tokens.css`.
- `shadcn build` — transforma `registry.json` em `public/r/*.json`.
- TanStack Start serve `public/` (com CORS em `/r/**` via `routeRules`).

```
lai-tokens.css ─┐
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
npm run registry                     # regenera o registry
```

Documente-o criando `content/docs/components/<nome>.mdx` (use `<Preview>` para o
preview ao vivo).

## Deploy (Railway)

`railway.json` usa Nixpacks: `npm run build` no build, `npm run start` no
runtime. O nitro gera um node server (`.output/server`) que respeita `PORT`. Um
`Dockerfile` multi-stage também está incluído como alternativa.

> **Nota técnica:** o prerender fica desligado e há um passo `fix-tslib` no
> build. O plugin do TanStack pré-bundla `@radix-ui` (via Fumadocs/cmdk)
> importando `tslib` de um jeito que o trace do nitro copia incompleto;
> `scripts/fix-tslib.mjs` copia o `tslib` completo para o `.output`.

## Tokens

Convertidos do **LAI UI Design Standard** para OKLCH. Acento primário
`#10A37F` (verde LAI); paleta neutra estilo ChatGPT; light + dark obrigatórios.
Para rebrandizar, edite `src/styles/lai-tokens.css` e rode `npm run registry`.
