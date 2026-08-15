---
"@adila-sh/ui": patch
---

Alinha a variante `dark:` com a troca de tema por classe.

O pacote não declarava `@custom-variant dark`, então o Tailwind v4 compilava
toda utilitária `dark:` dentro de `@media (prefers-color-scheme: dark)` — mas os
tokens trocam pela classe `.dark`. Os dois mecanismos discordavam: num sistema
em modo claro, ativar o tema escuro trocava as cores dos tokens e deixava as
`dark:` inativas; num sistema em modo escuro, as `dark:` se aplicavam mesmo com
o tema claro.

Tratado como correção: nenhuma API muda e nada precisa ser reescrito por quem
consome o pacote. Ainda assim, a aparência do tema escuro muda em 27 dos 104
componentes, porque as utilitárias `dark:` passam a valer de fato — quem já
compensava o defeito com CSS próprio deve revisar.
