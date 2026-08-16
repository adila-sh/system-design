---
"@adila-sh/ui": patch
---

Deduz `nativeButton` quando um gatilho é renderizado como link.

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
