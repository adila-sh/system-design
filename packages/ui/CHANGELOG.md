# @adila-sh/ui

## 0.5.0

### Minor Changes

- 6b3f3a8: Traz o desenho de navegação em árvore para a `Sidebar`, como variante.

  O padrão nasceu no `payment/front` e foi recriado à mão no `monitor/front`:
  trilho vertical com conectores por item, o caminho ativo acendendo em
  `foreground`, caret girando meia volta e um realce em gradiente no item ativo.
  Recriar a cada repo é o que esta mudança encerra.

  Entra como variante do que já existe, em vez de uma família nova:

  - `SidebarMenuSub` ganha `variant`. O padrão `line` mantém a régua contínua
    atual; `tree` troca por trilho com pontas recuadas e dá a cada
    `SidebarMenuSubItem` um conector horizontal.
  - `SidebarMenuButton` e `SidebarMenuSubButton` ganham `activeIndicator`. O
    padrão do primeiro segue `bar`, a barra deslizante; `gradient` troca pelo
    realce que preenche o botão; `none` deixa só cor e peso.

  Nenhum default muda, então quem já usa não vê diferença.

  O item não recebe `isActive` nem `isLast`: o conector lê o estado do DOM, por
  `has-data-active` e `last`. Além de encurtar a chamada, é o que permite servir
  ao caso de fora da `Sidebar` — um menu dentro de `Drawer` ou `Sheet` não pode
  usar estes componentes, porque `useSidebar` lança fora do `SidebarProvider`.
  Para esse caso o pacote passa a exportar as mesmas classes cruas —
  `navTreeRail`, `navTreeItem`, `NavActiveGlow` e `NavCaret` — de modo que a
  navegação do mobile fica idêntica à do desktop sem duplicar o desenho.

  Como quase tudo aqui é pseudo-elemento, os testes medem o que o navegador
  pintou, e não as classes no HTML: uma variante que o Tailwind não gerasse
  deixaria a classe no atributo e a linha invisível na tela.

## 0.4.1

### Patch Changes

- 119acf9: Corrige três defeitos de cor encontrados ao cobrir os componentes ASCII.

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

- 1c74466: Nada muda em runtime: este changeset existe só para registrar que a suíte de
  contraste passou a cobrir os campos de formulário, incluindo o placeholder — que
  é pseudo-elemento e escapava da varredura de textos.

  Ficou registrado, sem correção, que a borda de `--input` mede 1.23:1 no tema
  claro e 1.56:1 no escuro contra o mínimo de 3:1 da WCAG 1.4.11. Corrigir passa
  por escurecer o token, o que muda a borda de todo campo do sistema.

- 6934796: Corrige o contraste do item `destructive` do `DropdownMenu` no tema escuro.

  O item usava `text-destructive` sobre a superfície do popover, que é mais clara
  que o fundo da página, e media 3.99:1. Passa a usar
  `--destructive-tint-foreground`, o mesmo token já adotado nos demais
  componentes, e o estado de foco passa a usar as tintas opacas em vez de
  `bg-destructive/10` e `/20`.

- ff8e0e2: Deduz `nativeButton` quando um gatilho é renderizado como link.

  Os gatilhos do Base UI assumem `nativeButton: true`: mesmo trocando o elemento
  pelo `render`, seguem contando com as semânticas nativas do `<button>`. Com
  `render={<Link />}` a premissa quebra — o resultado era uma âncora com
  `type="button"`, atributo que não existe em `<a>`, sem o tratamento de teclado
  que o Base UI reserva ao modo não-nativo, e um `console.error` em dev a cada
  ocorrência.

  A saída documentada é passar `nativeButton={false}`, mas isso é fácil de
  esquecer e cada produto que consome o design system esquecia de novo. A dedução
  passa a morar em `resolveNativeButton`, e `Button`, `AccordionTrigger`,
  `CollapsibleTrigger`, `DialogTrigger`, `DialogClose`, `DrawerTrigger`,
  `DrawerClose`, `SheetTrigger`, `SheetClose`, `DropdownMenuTrigger`,
  `PopoverTrigger`, `TabsTrigger`, `Toggle` e `NavigationMenuTrigger` a herdam.

  A dedução é deliberadamente estreita: só reconhece o que comprovadamente
  navega — a tag `a`, ou um componente que recebe `href` ou `to`. O teste ingênuo
  de "o `render` não é `<button>`, logo não é botão" erraria em
  `render={<Button variant="outline" />}`, que o próprio design system usa no
  rodapé do `Dialog`. Fora esse caso a função devolve `undefined` e o default do
  Base UI continua valendo, então nada muda no que já funcionava.

  **Contrapartida:** no modo não-nativo o Base UI aplica `role="button"` ao
  elemento, de modo que um link com aparência de botão passa a ser anunciado como
  botão — e ganha o acionamento por Espaço que ele não tinha. É o contrato
  pretendido pela biblioteca, coerente com a aparência do controle. Quem preferir
  semântica de link num caso específico passa `role="link"`, que vence por vir das
  props externas.

- 94dc6bb: Corrige o contraste de `--destructive` e `--success` usados como texto direto
  sobre o fundo da página, sem tinta atrás.

  Nos valores de preenchimento eles ficavam em 4.36 e 4.33 no tema claro, logo
  abaixo do mínimo AA. Em vez de escurecer os tokens base outra vez — o que
  arrastaria também o preenchimento sólido —, quem desce é o
  `--{destructive,success}-tint-foreground`, que existe justamente para guardar "a
  cor legível como texto".

  `StatTrend` e `FieldError` passam a apontar para esses tokens. A mudança visual é
  imperceptível: a maior diferença medida foi de 16 em 765 num único pixel.

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
