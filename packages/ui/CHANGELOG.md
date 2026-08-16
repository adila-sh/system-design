# @adila-sh/ui

## 0.4.0

### Minor Changes

- c5e6ef2: Adiciona `--destructive-tint-strong` e conclui a migração para os tokens de
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

- 091cc3b: Adiciona tokens de tinta: `--{primary,destructive,success,warning}-tint` e os
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

### Patch Changes

- 5f76cae: Ajusta `--destructive`, `--success` e `--muted-foreground` no tema claro para
  atingir o mínimo AA de texto (4.5:1).

  Só a luminosidade muda; matiz e croma seguem idênticos, então a identidade da
  paleta é preservada — o vermelho e o verde ficam mais profundos, não diferentes.

  - `--destructive`: L 0.5915 → 0.49
  - `--success`: L 0.5385 → 0.50
  - `--muted-foreground`: L 0.551 → 0.545

  Corrige 12 combinações que estavam abaixo do mínimo em Button, Badge, Alert,
  Status, DeploymentStatus e ApiRequestMethod. O foreground branco sobre o
  preenchimento sólido continua passando, porque as cores ficaram mais escuras.

  O tema escuro **não** muda: lá não existe luminosidade que satisfaça ao mesmo
  tempo o texto colorido sobre a própria tinta e o branco sobre o preenchimento
  sólido. Resolver aquele lado exige decisão de design, não ajuste de token.

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
