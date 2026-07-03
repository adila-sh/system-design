# LAI UI Registry

Design system LAI distribuído como **registry shadcn HTTP**, sobre **Base UI**.
Vite + React + TypeScript + Tailwind v4.

Outros projetos consomem os componentes com a CLI do shadcn:

```bash
# tema (tokens LAI: verde LAI, neutros ChatGPT, Inter/JetBrains Mono)
npx shadcn@latest add https://<host>/r/lai-theme.json

# componentes individuais
npx shadcn@latest add https://<host>/r/button.json
npx shadcn@latest add https://<host>/r/dialog.json
```

## Como funciona

- `src/index.css` — **fonte canônica** dos tokens (light/dark, OKLCH).
- `src/components/ui/` — os primitives Base UI publicados (fonte única; a
  showcase importa exatamente estes arquivos).
- `scripts/gen-registry.mjs` — gera `registry.json` varrendo os componentes
  (deps npm + registryDependencies) e extraindo os tokens do `index.css`.
- `npx shadcn build` — transforma `registry.json` em `public/r/*.json`.
- `serve dist --cors` — serve os JSON por HTTP com CORS.

```
registry.json  ──gen-registry──►  registry.json  ──shadcn build──►  public/r/*.json  ──serve──►  HTTP
     ▲                                                                    │
 index.css (tokens) ─────────────────────────────────────────────────────┘
```

## Scripts

| Comando | Ação |
|---------|------|
| `npm run dev` | Showcase em desenvolvimento (Vite). |
| `npm run registry` | Regenera `registry.json` e builda `public/r/*.json`. |
| `npm run build` | `registry` + typecheck + `vite build` → `dist/`. |
| `npm run start` | Serve `dist/` com CORS (produção). |
| `npm run smoke` | Valida os JSON do registry + testa HTTP/CORS. |

## Adicionar um componente ao registry

```bash
npx shadcn@latest add <componente>   # entra em src/components/ui/
npm run registry                     # regenera o registry
```

## Deploy (Railway)

`railway.json` usa Nixpacks: `npm run build` no build, `npm run start` no runtime.
Um `Dockerfile` multi-stage também está incluído como alternativa. O Railway
injeta `PORT`; o start command já o respeita.

## Tokens

Convertidos do **LAI UI Design Standard** para OKLCH. Acento primário
`#10A37F` (verde LAI); paleta neutra estilo ChatGPT; light + dark obrigatórios.
Para rebrandizar, edite `src/index.css` e rode `npm run registry`.
