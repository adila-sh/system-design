# LAI UI Registry — Design System shadcn + Base UI

**Data:** 2026-07-03
**Status:** Aprovado
**Autor:** LAI Engineering

## Objetivo

Projeto Vite + React + TS que é a fonte de verdade de um design system LAI e
publica um **registry shadcn HTTP**. Outros projetos consomem componentes via:

```bash
npx shadcn@latest add https://<host-railway>/r/<item>.json
```

## Stack

- Vite + React 19 + TypeScript (build estático)
- shadcn CLI 4.x com **Base UI** (`init --base base`) — primitives sobre Base UI, não Radix
- Tailwind v4 + `tw-animate-css`
- Deploy: Railway (build estático + servidor com CORS)

## Mecânica do registry

- `registry.json` = fonte de verdade (item base + todos os ui items).
- `npx shadcn build` gera `public/r/*.json`.
- Servido por HTTP estático. **CORS obrigatório** (`Access-Control-Allow-Origin: *`)
  porque o `shadcn add` do consumidor faz fetch cross-origin.

## Tokens LAI — item `registry:base` (`lai-theme`)

Convertidos do LAI UI Design Standard para OKLCH, light + dark:

| Token | Claro | Escuro |
|-------|-------|--------|
| background | `#FFFFFF` | `#343541` |
| secondary/muted | `#F7F7F8` | `#444654` |
| sidebar | `#F9F9F9` | `#202123` |
| foreground | `#111827` | `#ECECF1` |
| muted-foreground | `#6B7280` | `#8E8EA0` |
| border | `#E5E7EB` | `#4E4F60` |
| primary (verde LAI) | `#10A37F` | `#10A37F` |
| primary hover | `#0D8C6D` | `#0D8C6D` |
| destructive | `#EF4444` | `#F87171` |
| warning | `#F59E0B` | `#FBBF24` |
| success | `#10B981` | `#34D399` |

- Tipografia: Inter (UI) + JetBrains Mono (código). Escala 12/14/16/20/24.
- `config`: `style` custom, `iconLibrary: lucide`, `tailwind.baseColor: neutral`.
- Item `type: registry:base`, com `cssVars` (light/dark) e `css` base layer.

## Componentes — itens `registry:ui`

Todos os primitives shadcn adaptados a Base UI (~40+), cada um item `registry:ui`
com suas `registryDependencies` e deps npm. Categorias: form controls (button,
input, textarea, label, select, checkbox, radio-group, switch, slider, form),
overlays (dialog, alert-dialog, popover, tooltip, dropdown-menu, menubar,
context-menu, hover-card, sheet), navegação/estrutura (tabs, accordion,
collapsible, card, separator, scroll-area, breadcrumb, pagination), data
(table, badge, avatar, progress, skeleton, calendar), utilitários (command,
toast/sonner, toggle, toggle-group, aspect-ratio).

**Fonte única:** os `.tsx` ficam em `src/components/ui/`; a showcase importa os
mesmos arquivos publicados.

## Estrutura

```
lai-ui-registry/
├── registry.json          # fonte: lai-theme + todos os ui items
├── components.json        # config shadcn (base: base)
├── src/
│   ├── components/ui/      # primitives Base UI (fonte publicada)
│   ├── components/showcase/# seções de preview + theme toggle
│   ├── styles/lai-tokens.css  # tokens canônicos do app
│   ├── lib/utils.ts        # cn()
│   ├── App.tsx             # página showcase
│   └── main.tsx
├── public/r/              # JSON gerado (servido por HTTP)
├── Dockerfile             # build + serve estático com CORS
└── railway.json           # deploy
```

## Showcase

Página única: galeria de todos os componentes, toggle light/dark, validação
visual do tema LAI. "Storybook leve".

## Sync de tokens (decisão)

`registry.json` (cssVars do `lai-theme`) é canônico. Um passo de build gera
`src/styles/lai-tokens.css` a partir dele — zero drift entre o que o app renderiza
e o que é publicado.

## Testes / verificação

- `shadcn build` valida contra o schema oficial.
- Smoke test: instalar um item do registry gerado num projeto temporário e
  rodar typecheck — garante que é consumível de verdade.
- Showcase renderiza sem erro (`vite build` + preview).

## Fora de escopo (YAGNI)

- Blocks LAI (login-form, sidebar ChatGPT, cockpit) — futuro.
- Charts/dataviz — futuro.
- Multi-tema/multi-marca — futuro.

---

## Revisão 2026-07-03 — App único TanStack Start + Fumadocs

O shell Vite SPA foi substituído por um **app único TanStack Start** (ainda
Vite) que serve docs Fumadocs + registry + landing. Mantidos: os 60 primitives
Base UI, os tokens LAI, o gerador de registry e o smoke test.

**Mudanças:**
- Shell: Vite SPA → **TanStack Start** (roteamento por arquivos, SSR + nitro).
- Docs: showcase Vite → **Fumadocs** (MDX por componente, busca, preview ao vivo
  via `<Preview>`).
- Tema unificado: `fumadocs-ui/css/shadcn.css` mapeia `--color-fd-*` para os
  tokens shadcn — Fumadocs e componentes usam a mesma paleta LAI.
- Tokens canônicos: `src/index.css` → `src/styles/lai-tokens.css`.
- Serving: `serve dist --cors` → node server do nitro (`node-server`), CORS em
  `/r/**` via `routeRules`.
- Deploy: Railway continua Nixpacks (`build`/`start`); `start` roda o node server.

**Workaround tslib:** o plugin do TanStack pré-bundla `@radix-ui` (via
Fumadocs/cmdk) importando `tslib`; o trace do nitro o copia incompleto (falta
`modules/`). Prerender desligado + `scripts/fix-tslib.mjs` copia o `tslib`
completo para o `.output`. Os `/r/*.json` são estáticos e não dependem disso.

**Verificação:** `npm run build` (0 erros), `npm run typecheck` (0 erros),
`npm run smoke` (registry válido + HTTP 200 + CORS), e validação no browser
(home e `/docs/components/button` renderizam com o tema LAI e previews ao vivo).
