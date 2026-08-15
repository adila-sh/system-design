# @adila-sh/ui

## 0.3.0

### Minor Changes

- d2059c2: DatePicker aceita `id` e `showToday`.

  `id` é repassado ao botão do gatilho, permitindo que um `<Label htmlFor>` rotule
  o campo — antes quem consumia precisava recorrer a `aria-labelledby` num wrapper.

  `showToday` acrescenta um atalho para a data de hoje no rodapé do calendário,
  desabilitado quando hoje cai fora de `fromDate`/`toDate`.

### Patch Changes

- 8d66660: Alinha a variante `dark:` com a troca de tema por classe.

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

## 0.2.3

### Patch Changes

- 1e5171c: Atualiza os botões para o formato totalmente pill, incluindo os tamanhos compactos e os botões de ícone.

## 0.2.2

### Patch Changes

- 096501b: Alinha os estilos globais e a documentação de uso da sidebar recolhível e da bottom bar ao padrão do `/pay/front`.

## 0.1.0

### Minor Changes

- 69b3af6: Publica @adila-sh/ui pela primeira vez no GitHub Packages — substitui o
  registry HTTP shadcn por um pacote npm compilado (JS + CSS pré-compilado).
