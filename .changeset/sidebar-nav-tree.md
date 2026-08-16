---
"@adila-sh/ui": minor
---

Traz o desenho de navegação em árvore para a `Sidebar`, como variante.

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
