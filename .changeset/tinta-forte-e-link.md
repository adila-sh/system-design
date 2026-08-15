---
"@adila-sh/ui": minor
---

Adiciona `--destructive-tint-strong` e conclui a migração para os tokens de
tinta em `Button`, `Badge` e `Alert`.

Esses três ficaram de fora da primeira leva porque usam superfícies diferentes
das dos badges de status: preenchimento a 20% em vez de 10%, texto sobre
`--card`, e o `link`, que é texto colorido direto sobre o fundo da página, sem
tinta nenhuma. As medições mostraram que o `--x-tint-foreground` já criado
atende às três situações, então só o nível de 20% precisou de token novo.

No tema escuro, `Button` e `Badge` destructive vão de 3.65 para 4.64, os dois
`link` de 3.79 para 5.46, e o `Alert` de 3.79 (título) e 3.30 (descrição) para
4.72. A descrição perde o alpha de 90% que a derrubava; a hierarquia com o
título continua sustentada pelo `text-sm` e pelo `font-medium`.

No tema claro nada muda visualmente — verificado pixel a pixel.

Com isso, **todas** as combinações medidas pela suíte atingem o mínimo AA de
texto nos dois temas.
