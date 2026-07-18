# Pixel Blast na home + logo e favicon

**Data:** 2026-07-16
**Status:** Aprovado
**Autor:** adila.co Engineering

## Objetivo

Dar à home do `ds.adila.co` a mesma presença visual da landing page do
`identity/front`: um hero full-bleed com o fundo animado **Pixel Blast** e a
fonte **Adila Pixel** como acento tipográfico. No caminho, o Pixel Blast vira um
item instalável do registry, e os novos logos (`logo-light.png` / `logo-dark.png`)
passam a ser usados na navbar e no favicon.

## Escopo

Quatro entregas independentes, na ordem em que devem ser construídas:

1. `PixelBlast` portado para `src/components/ui/` (entra no registry) + página de docs
2. Home (`src/routes/index.tsx`) reescrita como hero full-bleed
3. Logo na navbar (`src/lib/layout.shared.tsx`)
4. Favicon dual light/dark a partir dos novos logos

Fora de escopo: OG image (`icon-512.png` e `ogImage` permanecem como estão);
seções novas abaixo do hero; uso do logo dentro do hero.

## 1. PixelBlast no registry

### Origem

`identity/front/src/components/auth/pixel-blast.tsx` (349 linhas). Fundo WebGL
cru: grid de pixels na cor `--primary`, campo de ruído fbm animado, brilho que
segue o cursor, ripples ao clique, e morph de forma (quadrado → círculo →
losango) a cada 5 cliques.

### Por que a porta é limpa

- **Zero dependências npm** — WebGL puro, sem three.js.
- `cn` de `@/lib/utils` é byte-idêntico nos dois projetos.
- Lê `--primary` do tema via canvas 2D (resolve `oklch()`) e re-lê quando o tema
  muda, então funciona em light e dark sem configuração.
- Já degrada bem: sem WebGL o canvas some e o `<div bg-primary>` de fallback
  assume; respeita `prefers-reduced-motion`; pausa o rAF fora da viewport via
  `IntersectionObserver`.

### Destino e mecânica do registry

Arquivo: `src/components/ui/pixel-blast.tsx`.

O diretório importa: `scripts/gen-registry.mjs` **varre `src/components/ui/` e
gera o `registry.json`**. Colocar o componente ali é o que o torna um item do
registry — `registry.json` NÃO deve ser editado à mão, pois é sobrescrito no
próximo `npm run registry`.

Resultado esperado da geração automática:

```json
{
  "name": "pixel-blast",
  "type": "registry:ui",
  "registryDependencies": ["utils"]
}
```

Sem `dependencies` npm, já que o único import externo é `react`, que o
`gen-registry.mjs` ignora (`IGNORE_DEPS`).

### Alterações na porta

- Adicionar `"use client"` na linha 1 — convenção dos componentes interativos do
  DS (18 dos 60 usam).
- Nenhuma outra mudança de código.

### API pública

Apenas `className`, idêntica ao identity:

```tsx
export function PixelBlast({ className }: { className?: string })
```

Não expor `pixelSize`, `shape` ou `color`. A cor vem do tema automaticamente, e
as demais são constantes de shader que ninguém pediu para configurar. Podem ser
promovidas a props depois, se houver demanda real.

### Docs

`scripts/gen-docs.mjs` cria `content/docs/components/pixel-blast.mdx`
automaticamente se o arquivo não existir, e **preserva docs curadas**. Vamos
escrever o MDX à mão, seguindo o formato de `badge.mdx`: frontmatter
(`title`/`description`), `<Preview>`, `## Instalação`, `## Uso`.

O `<Preview>` precisa de altura e contenção próprias, porque o componente é um
fundo absoluto: um wrapper `relative h-64 w-full overflow-hidden rounded-lg`.

O `meta.json` de components é **sempre regenerado** pelo `gen-docs.mjs`, então
`pixel-blast` entra na navegação sozinho, em ordem alfabética.

## 2. Home como hero full-bleed

`src/routes/index.tsx` mantém o `HomeLayout` do fumadocs. O miolo vira:

```
relative isolate flex min-h-svh items-center justify-center overflow-hidden
  └── <PixelBlast className="absolute inset-0 -z-10" />
  └── conteúdo, text-white
```

Os elementos atuais não sobrevivem ao fundo azul e precisam de adaptação:

| Hoje | Vira | Motivo |
|---|---|---|
| `<Badge variant="secondary">` | eyebrow `font-pixel text-sm uppercase tracking-[0.2em]` branco | cinza claro sobre azul = ilegível |
| `<h1>` com `text-primary` no "adila.co" | `font-pixel` no "adila.co", tudo branco | primary sobre primary some; espelha o `Software.` da LP |
| `<p className="text-fd-muted-foreground">` | `text-white/80` | token de texto muted não tem contraste sobre azul |
| Botão default | `bg-white text-primary hover:bg-white/90` | mesmo tratamento da LP |
| Botão outline / ghost | borda e texto brancos, hover `bg-white/10` | idem |
| `<code className="bg-fd-muted">` | `bg-white/10 border-white/20 text-white` | superfície translúcida sobre o blast |

A fonte Adila Pixel **já está carregada** (`src/styles/fonts.css`) e o token
`--font-pixel` já existe (`src/styles/adila-tokens.css`), então `font-pixel`
funciona sem nenhuma mudança de CSS.

## 3. Logo na navbar

`src/lib/layout.shared.tsx`: `nav.title` deixa de ser a string `appName` e passa
a ser JSX — `<img>` 20×20 `rounded-[4px]` seguido do texto.

Cada logo traz o próprio fundo (são tiles opacos, sem transparência), então a
troca é por visibilidade e não por filtro: `dark:hidden` no light,
`hidden dark:block` no dark. Isso segue o **toggle de tema do site**.

O `<img>` é decorativo ao lado do texto "adila.co" → `alt=""`.

## 4. Favicon dual

Gerado com ImageMagick a partir dos 1024×1024 em `public/`. Downscale direto, sem
crop — mantém o asset fiel ao que foi desenhado. O "DS" pixelado permanece
legível em 32px e 16px (verificado).

| Arquivo | Origem | Uso |
|---|---|---|
| `favicon-16-light.png`, `favicon-32-light.png` | `logo-light.png` | `media="(prefers-color-scheme: light)"` |
| `favicon-16-dark.png`, `favicon-32-dark.png` | `logo-dark.png` | `media="(prefers-color-scheme: dark)"` |
| `favicon.ico` (16/32/48 multi-size) | `logo-light.png` | fallback universal |
| `apple-touch-icon.png` (180×180) | `logo-light.png` | iOS não suporta media query em ícone |

`src/routes/__root.tsx` passa a declarar os links com `media`, mantendo o `.ico`
**por último** como fallback:

```tsx
{ rel: "icon", type: "image/png", sizes: "32x32",
  href: "/favicon-32-light.png", media: "(prefers-color-scheme: light)" },
{ rel: "icon", type: "image/png", sizes: "32x32",
  href: "/favicon-32-dark.png",  media: "(prefers-color-scheme: dark)" },
// … 16x16 idem …
{ rel: "icon", href: "/favicon.ico", sizes: "48x48" },
{ rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
```

Comportamento: Safari e Firefox trocam o ícone ao vivo com o tema do SO; Chrome
ignora `media` em `rel=icon` e cai no `.ico` (fundo azul, sempre legível). Esse
degrade é aceitável e não deixa ninguém sem ícone.

`icon-512.png` e o `ogImage` de `__root.tsx` permanecem intactos.

## Riscos a verificar no browser

1. **Navbar sobre o hero.** O `HomeLayout` do fumadocs tem navbar com fundo/blur
   próprio, que vai flutuar sobre o hero e pode criar uma faixa visível no topo
   em vez de transparência limpa. Se ficar ruim, puxar o hero para trás da
   navbar.
2. **Listeners globais.** O `PixelBlast` registra `pointerdown` em `window`, então
   clicar em qualquer lugar da home — inclusive nos botões — dispara ripple. É o
   comportamento da LP e é desejável aqui; registrado para não virar surpresa.
3. **Contraste dos botões.** Branco sobre `primary` indigo deve passar em AA, mas
   confirmar o estado `hover`/`focus` do outline e do ghost sobre o fundo animado,
   que varia de luminosidade.

## Verificação

- `npm run typecheck` e `npm run lint` limpos.
- `npm run registry` gera `pixel-blast` em `registry.json` e `public/r/pixel-blast.json`.
- Playwright: home sem erros de console, screenshot em light e dark.
- Favicon: conferir os arquivos gerados e o HTML renderizado.
