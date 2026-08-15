---
"@adila-sh/ui": minor
---

Adiciona tokens de tinta: `--{primary,destructive,success,warning}-tint` e os
respectivos `-tint-foreground`, expostos ao Tailwind como `bg-*-tint` e
`text-*-tint-foreground`.

Existem porque o par `bg-x/10 text-x` é insolúvel no tema escuro: ali a tinta é a
própria cor sobre um fundo escuro, então o texto precisa ser mais claro que a
cor, enquanto o branco sobre o preenchimento sólido precisa que ela seja escura.
Uma luminosidade só não atende às duas restrições. Separando "cor de
preenchimento" de "cor de texto sobre tinta", cada uma atende à sua.

`Status`, `DeploymentStatus` e `ApiRequestMethod` passam a usar os novos tokens.
No tema claro nada muda visualmente — a superfície é o mesmo `color-mix` a 10%
que o utilitário já aplicava, e o texto continua sendo a cor base. No tema
escuro o texto fica mais claro, saindo de 3.5–4.1:1 para 5.1–5.2:1.

É `minor` porque adiciona tokens ao contrato público do CSS. Nada existente foi
removido nem renomeado.
