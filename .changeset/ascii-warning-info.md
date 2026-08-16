---
"@adila-sh/ui": patch
---

Corrige três defeitos de cor encontrados ao cobrir os componentes ASCII.

A variante `info` do `AsciiBadge` apontava para `text-info`, um token que nunca
existiu no design system. A classe não gerava regra nenhuma e a cor era
simplesmente herdada, então a variante não comunicava estado algum — e passava
despercebida justamente porque herdar o foreground dá contraste ótimo. Passa a
usar `--primary-tint-foreground`, o mesmo acento que o `Status` usa para `info`.

As demais variantes apontavam para as cores de preenchimento (`text-success`,
`text-warning`, `text-destructive`) como texto solto sobre o fundo da página;
`warning` media 2.15:1. Todas passam a usar os tokens de tinta.

`--warning-tint-foreground` no tema claro deixa de ser o preto do
`--warning-foreground` e passa a ser um âmbar escuro na mesma matiz do
`--warning`: 6.18:1 sobre a página e 5.57:1 sobre a própria tinta. Isso torna o
texto dos chips de aviso âmbar em vez de preto, alinhando com o verde do
`success` e o vermelho do `destructive`.
