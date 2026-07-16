# Pixel Blast na home + logo e favicon — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar à home do `ds.adila.co` um hero full-bleed com o fundo animado Pixel Blast e a fonte Adila Pixel como acento, publicar o Pixel Blast como item do registry, e usar os novos logos na navbar e no favicon.

**Architecture:** O `PixelBlast` é portado do `identity/front` para `src/components/ui/`, o que o faz entrar no registry automaticamente (o `registry.json` é gerado, não editado). A home mantém o `HomeLayout` do fumadocs mas troca o miolo por um hero `min-h-svh` com o canvas ao fundo. Navbar e favicon consomem os PNGs 1024×1024 já commitados em `public/`.

**Tech Stack:** React 19, TanStack Router/Start, Tailwind v4, fumadocs-ui, WebGL cru (sem three.js), ImageMagick (`convert`) para os ícones.

**Spec:** `docs/superpowers/specs/2026-07-16-pixel-blast-hero-design.md`

## Global Constraints

- **Nunca editar `registry.json` à mão** — é gerado por `scripts/gen-registry.mjs`, que varre `src/components/ui/`. Edição manual é sobrescrita no próximo `npm run registry`.
- **Nunca editar `content/docs/components/meta.json` à mão** — é sempre regenerado por `scripts/gen-docs.mjs`. Já MDX existente é preservado (o script pula arquivos que já existem).
- **Zero dependências npm novas.** O `PixelBlast` é WebGL cru; se algum passo pedir `three`, `postprocessing` ou similar, o passo está errado.
- **Idioma:** comentários de código e prosa de docs em pt-BR, seguindo o resto do repo.
- **Não tocar** em `public/icon-512.png` nem na variável `ogImage` de `src/routes/__root.tsx` — OG image está fora de escopo.
- **Branch:** `feat/pixel-blast-hero` (já criada, com o spec commitado).
- **Não há framework de teste unitário neste projeto** (sem vitest/jest, zero arquivos `.test.*`). Não introduza um. As portas de qualidade são: `npm run typecheck`, `npm run lint`, `npm run registry`, `npm run smoke`, e verificação visual no browser.

### Comandos de verificação

| Comando | O que faz |
|---|---|
| `npm run typecheck` | `fumadocs-mdx && tsc --noEmit` |
| `npm run lint` | `oxlint` |
| `npm run registry` | gera `registry.json`, os MDX faltantes e `public/r/*.json` |
| `npm run smoke` | valida estrutura dos JSONs do registry + serve por HTTP com CORS |
| `npm run dev` | Vite dev server (porta 3001 em sessões anteriores) |

---

### Task 1: PixelBlast como item do registry

**Files:**
- Create: `src/components/ui/pixel-blast.tsx` (porta de `/home/sousa/work/adila/identity/front/src/components/auth/pixel-blast.tsx`)
- Create: `content/docs/components/pixel-blast.mdx`
- Generated (não editar à mão): `registry.json`, `content/docs/components/meta.json`, `public/r/pixel-blast.json`

**Interfaces:**
- Consumes: `cn` de `@/lib/utils` (assinatura `cn(...inputs: ClassValue[]): string`) — byte-idêntico ao do projeto de origem, então o import não muda.
- Produces: `export function PixelBlast({ className }: { className?: string })` — usado pela Task 2. Renderiza um `<div>` com `bg-primary` de fallback e um `<canvas absolute inset-0>` dentro. Quando `className` é omitido, o default é `"fixed inset-0 -z-10"`.

- [ ] **Step 1: Verificar que o item ainda não existe no registry (red)**

```bash
cd /home/sousa/work/adila/system-design
npm run registry >/dev/null 2>&1
ls public/r/pixel-blast.json
```

Expected: FAIL — `ls: cannot access 'public/r/pixel-blast.json': No such file or directory`

- [ ] **Step 2: Copiar o componente para `src/components/ui/`**

```bash
cp /home/sousa/work/adila/identity/front/src/components/auth/pixel-blast.tsx \
   /home/sousa/work/adila/system-design/src/components/ui/pixel-blast.tsx
```

Nenhuma edição de imports é necessária: o único import de projeto é `import { cn } from "@/lib/utils"`, e o `cn` é idêntico nos dois repos.

- [ ] **Step 3: Adicionar a diretiva `"use client"`**

O componente usa `useEffect`/`useRef`, então precisa da diretiva na linha 1 (convenção dos 18 componentes interativos do DS). Edite `src/components/ui/pixel-blast.tsx` para que as primeiras linhas fiquem exatamente:

```tsx
"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
```

- [ ] **Step 4: Gerar o registry e verificar que o item apareceu (green)**

```bash
npm run registry
cat public/r/pixel-blast.json
```

Expected: PASS — o arquivo existe. O JSON deve conter `"name": "pixel-blast"`, `"type": "registry:ui"` e `"registryDependencies": ["utils"]`.

Verifique também que **não** há `"dependencies"` npm (o único import externo é `react`, que o `gen-registry.mjs` ignora via `IGNORE_DEPS`):

```bash
grep '"dependencies"' public/r/pixel-blast.json || echo "OK: sem deps npm"
```

Expected: `OK: sem deps npm`

- [ ] **Step 5: Rodar o smoke test do registry**

```bash
npm run build && npm run smoke
```

Expected: PASS, sem falhas (`✗`) na saída.

- [ ] **Step 6: Escrever a doc curada**

O `gen-docs.mjs` do Step 4 pode ter criado um `pixel-blast.mdx` genérico. **Sobrescreva** com o conteúdo abaixo (o script preserva arquivos existentes, então a partir daqui esta versão fica estável).

O `<Preview>` (`src/components/component-preview.tsx`) é um flex container com `min-h-40` — o `PixelBlast` é um fundo absoluto e precisa de um wrapper com altura e contenção próprias, senão colapsa.

Create `content/docs/components/pixel-blast.mdx`:

````mdx
---
title: Pixel Blast
description: Fundo animado em WebGL — grid de pixels na cor primary, com ruído, brilho no cursor e ondas ao clique.
---

import { PixelBlast } from '@/components/ui/pixel-blast';

<Preview>
  <div className="relative h-64 w-full overflow-hidden rounded-lg">
    <PixelBlast className="absolute inset-0" />
  </div>
</Preview>

Clique no preview: cada clique dispara uma onda e, a cada cinco, o formato dos
pixels avança (quadrado → círculo → losango).

## Instalação

```bash
npx shadcn@latest add https://ds.adila.co/r/pixel-blast.json
```

## Uso

Como fundo de uma seção — o container precisa de `position: relative` e o
`PixelBlast` se posiciona sobre ele:

```tsx
import { PixelBlast } from '@/components/ui/pixel-blast';

export function Hero() {
  return (
    <section className="relative isolate min-h-svh overflow-hidden">
      <PixelBlast className="absolute inset-0 -z-10" />
      <h1 className="text-white">Design System</h1>
    </section>
  );
}
```

Sem `className`, o default é `fixed inset-0 -z-10` — cobre a viewport inteira.

## Props

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `className` | `string` | `"fixed inset-0 -z-10"` | Classes do container. Substitui o default por completo. |

## Comportamento

- **Cor:** lê o token `--primary` do tema e re-lê quando o tema muda — acompanha light e dark sem configuração.
- **Sem dependências:** WebGL cru, sem three.js.
- **Degradação:** sem suporte a WebGL, o canvas é escondido e o fundo `bg-primary` assume.
- **Movimento reduzido:** respeita `prefers-reduced-motion`, atenuando a animação.
- **Performance:** o loop pausa quando o canvas sai da viewport e retoma sem salto.
- **Interação:** os listeners de ponteiro são registrados em `window`, então cliques em qualquer ponto da página disparam ondas — não apenas os cliques sobre o canvas.
````

- [ ] **Step 7: Verificar que o MDX entrou na navegação**

```bash
npm run registry
grep '"pixel-blast"' content/docs/components/meta.json
```

Expected: a linha `    "pixel-blast",` aparece (o `gen-docs.mjs` regenera o `meta.json` em ordem alfabética).

Confirme que a doc curada não foi sobrescrita:

```bash
grep "Fundo animado em WebGL" content/docs/components/pixel-blast.mdx
```

Expected: a linha do `description` aparece.

- [ ] **Step 8: Typecheck e lint**

```bash
npm run typecheck && npm run lint
```

Expected: ambos sem erros.

- [ ] **Step 9: Verificar o preview no browser**

Suba o dev server (`npm run dev`) e abra `/docs/components/pixel-blast`.

Expected: o preview mostra o grid de pixels animado em indigo, sem erros no console. Clicar dispara ondas. Alternar o tema (light/dark) mantém o fundo na cor primary.

- [ ] **Step 10: Commit**

```bash
git add src/components/ui/pixel-blast.tsx content/docs/components/pixel-blast.mdx \
        content/docs/components/meta.json registry.json public/r
git commit -m "feat: adiciona PixelBlast ao registry"
```

---

### Task 2: Home como hero full-bleed

**Files:**
- Modify: `src/routes/index.tsx` (arquivo inteiro, 55 linhas → hero)

**Interfaces:**
- Consumes: `PixelBlast` da Task 1 — `import { PixelBlast } from "@/components/ui/pixel-blast"`.
- Produces: nada consumido por tasks posteriores.

**Contexto:** a fonte Adila Pixel já está carregada (`src/styles/fonts.css`) e o token `--font-pixel` já existe (`src/styles/adila-tokens.css:64`), então a classe `font-pixel` funciona sem nenhuma mudança de CSS.

- [ ] **Step 1: Reescrever a home**

Os elementos atuais não sobrevivem ao fundo indigo: o `Badge variant="secondary"` é cinza claro sobre azul, o `text-primary` do h1 some sobre o próprio primary, e `text-fd-muted-foreground` / `bg-fd-muted` não têm contraste. Cada um é substituído pelo equivalente da LP.

Substitua **todo** o conteúdo de `src/routes/index.tsx` por:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { Button } from "@/components/ui/button";
import { PixelBlast } from "@/components/ui/pixel-blast";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      {/* Hero — fundo animado "Pixel Blast", o mesmo motivo da LP do adila.co. */}
      <section className="relative isolate flex min-h-svh flex-1 items-center justify-center overflow-hidden px-4">
        <PixelBlast className="absolute inset-0 -z-10" />
        <div className="flex flex-col items-center gap-6 text-center text-white">
          <span className="font-pixel text-sm uppercase tracking-[0.2em] text-white/80">
            shadcn · Base UI · Tailwind v4
          </span>
          <h1 className="max-w-2xl text-balance text-4xl font-light tracking-tight sm:text-5xl">
            Design System <span className="font-pixel">adila.co</span>
          </h1>
          <p className="max-w-xl text-balance text-white/80">
            Registry de componentes consumível por qualquer projeto via CLI do
            shadcn. Tema indigo adila.co, light &amp; dark, 60+ primitives Base
            UI.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              className="bg-white text-primary hover:bg-white/90"
              render={
                <Link to="/docs/$" params={{ _splat: "" }}>
                  Ver documentação
                </Link>
              }
            />
            <Button
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              render={<Link to="/showcase">Ver showcase</Link>}
            />
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
              render={
                <a
                  href="https://github.com/adila-sh/system-design"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              }
            />
          </div>
          <code className="mt-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-sm text-white backdrop-blur-sm">
            npx shadcn@latest add https://ds.adila.co/r/adila-theme.json
          </code>
        </div>
      </section>
    </HomeLayout>
  );
}
```

Note que `Badge` deixa de ser importado — o eyebrow o substitui.

- [ ] **Step 2: Typecheck e lint**

```bash
npm run typecheck && npm run lint
```

Expected: ambos sem erros. O lint pega o import de `Badge` caso tenha sobrado.

- [ ] **Step 3: Verificar a home no browser**

Suba o dev server e abra `/`.

Expected: hero de altura de viewport, fundo de pixels indigo animado, texto branco legível, "adila.co" em Adila Pixel (largura fixa, aspecto pixelado — visivelmente diferente do "Design System" ao lado). Zero erros no console.

- [ ] **Step 4: Verificar os riscos anotados no spec**

Três coisas para olhar com atenção, todas registradas como risco no spec:

1. **Navbar do fumadocs sobre o hero** — ela tem fundo/blur próprio e pode criar uma faixa visível no topo. Se ficar ruim, reporte antes de tentar consertar; a correção (puxar o hero para trás da navbar) muda o layout e merece uma decisão.
2. **Ripple nos botões** — clicar nos botões também dispara onda, porque os listeners são globais. É esperado; confirme que não atrapalha a navegação (o link deve funcionar normalmente).
3. **Contraste** — confira `hover` e `focus` dos botões outline e ghost sobre as partes mais claras do fundo animado.

- [ ] **Step 5: Verificar light e dark**

Alterne o tema pelo toggle da navbar.

Expected: nos dois temas o fundo acompanha a cor primary e o texto branco continua legível. O hero é intencionalmente indigo nos dois — o `--primary` é o mesmo token em light e dark.

- [ ] **Step 6: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: home vira hero full-bleed com Pixel Blast"
```

---

### Task 3: Logo na navbar

**Files:**
- Modify: `src/lib/layout.shared.tsx` (16 linhas)

**Interfaces:**
- Consumes: `appName` de `@/lib/shared` (valor: `"DS | Adila.co"`), `/logo-light.png` e `/logo-dark.png` de `public/`.
- Produces: `baseOptions(): BaseLayoutProps` — assinatura inalterada, já consumida por `src/routes/index.tsx` e pelas rotas de docs.

- [ ] **Step 1: Trocar o título de texto por logo + texto**

`nav.title` aceita `ReactNode`, e o arquivo já é `.tsx`. Cada logo traz o próprio fundo (são tiles opacos 1024×1024, sem canal alfa útil), então a troca por tema é por **visibilidade**, não por filtro.

Substitua todo o conteúdo de `src/lib/layout.shared.tsx` por:

```tsx
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // Cada logo já embute o próprio fundo, então alternamos por visibilidade
      // em vez de filtro. Decorativo ao lado do texto → alt vazio.
      title: (
        <>
          <img
            src="/logo-light.png"
            alt=""
            width={20}
            height={20}
            className="rounded-[4px] dark:hidden"
          />
          <img
            src="/logo-dark.png"
            alt=""
            width={20}
            height={20}
            className="hidden rounded-[4px] dark:block"
          />
          {appName}
        </>
      ),
    },
    links: [
      {
        text: "Showcase",
        url: "/showcase",
        active: "url",
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
```

- [ ] **Step 2: Typecheck e lint**

```bash
npm run typecheck && npm run lint
```

Expected: ambos sem erros. Se o `tsc` reclamar que `nav.title` não aceita `ReactNode`, pare e reporte — significa que o tipo do fumadocs mudou e o design precisa de ajuste.

- [ ] **Step 3: Verificar no browser**

Abra `/` e `/docs`.

Expected: logo 20×20 arredondado à esquerda de "DS | Adila.co", alinhado ao texto, nas duas rotas. Alternar o tema troca o logo (fundo azul no light, preto no dark). Sem layout shift ao carregar (o `width`/`height` explícitos reservam o espaço).

- [ ] **Step 4: Commit**

```bash
git add src/lib/layout.shared.tsx
git commit -m "feat: logo na navbar, alternando por tema"
```

---

### Task 4: Favicon dual light/dark

**Files:**
- Create: `public/favicon-16-light.png`, `public/favicon-32-light.png`, `public/favicon-16-dark.png`, `public/favicon-32-dark.png`
- Modify (sobrescreve os existentes): `public/favicon.ico`, `public/apple-touch-icon.png`
- Modify: `src/routes/__root.tsx:61-78` (bloco de `links`)
- Não tocar: `public/icon-512.png`, `public/favicon-16x16.png`, `public/favicon-32x32.png` (os dois últimos ficam órfãos após esta task — ver Step 5)

**Interfaces:**
- Consumes: `public/logo-light.png` e `public/logo-dark.png` (1024×1024, RGBA opaco).
- Produces: nada consumido por tasks posteriores.

- [ ] **Step 1: Gerar os ícones**

Downscale direto, sem crop — mantém o asset fiel ao desenhado. `-strip` remove metadata desnecessária.

```bash
cd /home/sousa/work/adila/system-design/public
convert logo-light.png -resize 32x32 -strip favicon-32-light.png
convert logo-light.png -resize 16x16 -strip favicon-16-light.png
convert logo-dark.png  -resize 32x32 -strip favicon-32-dark.png
convert logo-dark.png  -resize 16x16 -strip favicon-16-dark.png
convert logo-light.png -resize 180x180 -strip apple-touch-icon.png
convert logo-light.png -define icon:auto-resize=48,32,16 favicon.ico
```

- [ ] **Step 2: Verificar as dimensões geradas**

```bash
cd /home/sousa/work/adila/system-design/public
identify favicon-32-light.png favicon-16-light.png favicon-32-dark.png \
         favicon-16-dark.png apple-touch-icon.png favicon.ico
```

Expected:
- `favicon-32-{light,dark}.png` → `32x32`
- `favicon-16-{light,dark}.png` → `16x16`
- `apple-touch-icon.png` → `180x180`
- `favicon.ico` → três frames: `48x48`, `32x32`, `16x16`

- [ ] **Step 3: Conferir os ícones visualmente**

O "DS" precisa continuar legível depois do downscale. Amplie sem interpolação para inspecionar:

```bash
cd /tmp/claude-1000/-home-sousa-work-adila-system-design/b86b315c-be63-48af-ba13-e34bc7dc87e9/scratchpad
P=/home/sousa/work/adila/system-design/public
convert $P/favicon-32-light.png -scale 400% check-light.png
convert $P/favicon-32-dark.png  -scale 400% check-dark.png
convert check-light.png check-dark.png +append check-favicons.png
```

Abra `check-favicons.png`. Expected: "DS" branco distinguível nos dois, sobre fundo azul (esquerda) e preto (direita).

- [ ] **Step 4: Declarar os links com media query**

Em `src/routes/__root.tsx`, substitua o bloco de ícones (linhas 61-78, do `{ rel: "icon", href: "/favicon.ico", sizes: "48x48" },` até o fechamento do `apple-touch-icon`) por:

```tsx
      // Favicon dual: Safari/Firefox trocam com o tema do SO; Chrome ignora
      // `media` em rel=icon e cai no .ico (fundo azul) — degradação aceitável.
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      // Fallback universal — precisa vir depois dos com `media`.
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
```

Deixe o resto do array (`canonical`, `preconnect`, `preload` das fontes, `stylesheet`) intacto.

- [ ] **Step 5: Remover os ícones órfãos**

`favicon-16x16.png` e `favicon-32x32.png` não são mais referenciados por ninguém depois do Step 4.

```bash
cd /home/sousa/work/adila/system-design
grep -rn "favicon-32x32\|favicon-16x16" src/ public/r/ 2>/dev/null || echo "OK: sem referências"
```

Expected: `OK: sem referências`. Só então:

```bash
git rm public/favicon-16x16.png public/favicon-32x32.png
```

- [ ] **Step 6: Typecheck**

```bash
npm run typecheck
```

Expected: sem erros. Se o `tsc` reclamar que `media` não existe no tipo dos links do TanStack Router, **pare e reporte** — o design assume que `media` é aceito (é atributo válido de `<link>`), e o contorno mexeria em como o head é renderizado.

- [ ] **Step 7: Verificar o HTML renderizado**

Suba o dev server e inspecione o `<head>` da home.

Expected: os quatro `<link rel="icon">` com `media` aparecem antes do `.ico`, e o `.ico` vem por último. A aba do browser mostra o ícone "DS" (no Chrome, o do `.ico`, de fundo azul).

- [ ] **Step 8: Commit**

```bash
git add public/favicon-16-light.png public/favicon-32-light.png \
        public/favicon-16-dark.png public/favicon-32-dark.png \
        public/favicon.ico public/apple-touch-icon.png \
        public/logo-light.png public/logo-dark.png \
        src/routes/__root.tsx
git commit -m "feat: favicon dual light/dark a partir dos novos logos"
```

Note que `logo-light.png` e `logo-dark.png` ainda estavam untracked — este commit os inclui.

---

## Verificação final

- [ ] `npm run typecheck && npm run lint` — limpos
- [ ] `npm run build && npm run smoke` — registry servível, `pixel-blast.json` válido
- [ ] Home (`/`): hero animado, sem erros de console, light e dark
- [ ] Docs (`/docs/components/pixel-blast`): preview funciona, página na navegação lateral
- [ ] Navbar: logo troca com o tema, nas rotas `/` e `/docs`
- [ ] Aba do browser: favicon "DS" visível
- [ ] `git status` limpo, sem arquivos `.playwright-mcp/` ou screenshots de debug commitados

## Notas para quem executa

- **`src/components/ui/.playwright-mcp/`** tem YAMLs de sessões antigas, untracked. Não commite; se atrapalhar, é lixo e pode ser apagado.
- **Texto da navbar:** `appName` é `"DS | Adila.co"`, e o logo ao lado também é um "DS" — fica levemente redundante. Mantivemos `appName` porque encurtar não foi pedido e ele é a fonte de verdade compartilhada com o `siteTitle`. Se o usuário quiser "adila.co", é uma linha.
