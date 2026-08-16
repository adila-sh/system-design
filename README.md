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
bun add @adila-sh/ui
cd ../..
bun run --cwd apps/docs gen:docs     # cria a doc-base + atualiza meta.json
```

## Status de testes nas docs

Cada página de componente mostra um selo com o resultado da suíte daquele
componente (`14 testes passando`, `3 de 14 testes falhando` ou `Sem testes
automatizados`). Os dados vêm de `apps/docs/src/lib/test-status.json`, que é
versionado e regerado com:

```bash
bun run test:status   # roda o Vitest com reporter JSON e regenera o manifesto
```

A contagem sai do relatório do Vitest, não de uma varredura do fonte, porque
boa parte dos testes é declarada dentro de laços. Rode o comando depois de
adicionar ou remover testes, senão o selo fica desatualizado.

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
