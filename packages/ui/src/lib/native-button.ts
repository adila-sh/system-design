import { isValidElement } from "react";

/**
 * Gatilhos do Base UI (`Button`, `DrawerClose`, `CollapsibleTrigger`, ...) assumem
 * `nativeButton: true`: mesmo quando você troca o elemento pelo `render`, eles
 * seguem contando com as semânticas nativas do `<button>`. Trocar por um link
 * quebra isso — o elemento perde o acionamento por Espaço, a participação em
 * formulários e o `disabled` real — e o Base UI reclama no console em dev.
 *
 * A saída documentada é passar `nativeButton={false}`, mas isso é fácil de
 * esquecer, e cada produto que consome o design system esquece de novo. Então a
 * dedução mora aqui, uma vez, e todos herdam.
 *
 * A dedução é deliberadamente estreita: só reconhece o que comprovadamente é um
 * link. O teste ingênuo — "o `render` não é `<button>`, logo não é botão" —
 * erraria em `render={<Button variant="outline" />}`, que o próprio design
 * system usa no rodapé do `Dialog`: um componente que renderiza um `<button>` de
 * verdade. Como não dá para saber estaticamente o que um componente renderiza,
 * a pergunta muda de "que elemento é este?" para "isto navega?".
 */
function pareceLink(render: unknown): boolean {
  if (!isValidElement(render)) return false;
  if (render.type === "a") return true;

  // `href` cobre `<a>` e os Link de Next e Remix; `to` cobre TanStack Router e
  // React Router. Um componente que recebe qualquer um dos dois navega, seja lá
  // o que renderize por dentro.
  const props = render.props as Record<string, unknown> | null;
  if (!props) return false;
  return props.href !== undefined || props.to !== undefined;
}

/**
 * Resolve o `nativeButton` de um gatilho a partir do seu `render`.
 *
 * Devolve `undefined` quando não há o que deduzir, para o default do Base UI
 * continuar valendo — o que mantém o comportamento atual em tudo que não seja
 * um link. Um valor explícito sempre vence a dedução.
 */
export function resolveNativeButton(
  render: unknown,
  nativeButton: boolean | undefined,
): boolean | undefined {
  if (nativeButton !== undefined) return nativeButton;
  return pareceLink(render) ? false : undefined;
}
