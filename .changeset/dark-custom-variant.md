---
"@adila-sh/ui": minor
---

Alinha a variante `dark:` com a troca de tema por classe.

O pacote não declarava `@custom-variant dark`, então o Tailwind v4 compilava
toda utilitária `dark:` dentro de `@media (prefers-color-scheme: dark)` — mas os
tokens trocam pela classe `.dark`. Os dois mecanismos discordavam: num sistema
em modo claro, ativar o tema escuro trocava as cores dos tokens e deixava as
`dark:` inativas; num sistema em modo escuro, as `dark:` se aplicavam mesmo com
o tema claro.

É `minor` e não `patch` porque as utilitárias `dark:` passam a valer de fato — a
aparência muda em todo componente que as usa (27 dos 104). Quem consome o pacote
e já compensava o defeito com CSS próprio deve revisar o tema escuro.
