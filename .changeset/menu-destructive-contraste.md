---
"@adila-sh/ui": patch
---

Corrige o contraste do item `destructive` do `DropdownMenu` no tema escuro.

O item usava `text-destructive` sobre a superfície do popover, que é mais clara
que o fundo da página, e media 3.99:1. Passa a usar
`--destructive-tint-foreground`, o mesmo token já adotado nos demais
componentes, e o estado de foco passa a usar as tintas opacas em vez de
`bg-destructive/10` e `/20`.
