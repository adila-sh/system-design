import { createElement } from "react";
import { describe, expect, test } from "vitest";
import { resolveNativeButton } from "./native-button";

/** Um Link de router: componente que recebe `to` e renderiza uma âncora. */
function Link(props: { to: string }) {
  return createElement("a", { href: props.to });
}

/** Um botão de verdade escondido atrás de um componente. */
function BotaoProprio(props: { variant?: string }) {
  return createElement("button", props);
}

describe("resolveNativeButton", () => {
  test("sem render, não deduz nada e deixa o default do Base UI valer", () => {
    expect(resolveNativeButton(undefined, undefined)).toBeUndefined();
  });

  test("deduz false para <a>", () => {
    expect(
      resolveNativeButton(createElement("a", { href: "/x" }), undefined),
    ).toBe(false);
  });

  test("deduz false para componente com `to` — o Link do TanStack e do React Router", () => {
    expect(
      resolveNativeButton(createElement(Link, { to: "/x" }), undefined),
    ).toBe(false);
  });

  test("deduz false para componente com `href` — o Link do Next e do Remix", () => {
    expect(
      resolveNativeButton(
        createElement(Link as never, { href: "/x" }),
        undefined,
      ),
    ).toBe(false);
  });

  test("não deduz para <button>", () => {
    expect(
      resolveNativeButton(createElement("button"), undefined),
    ).toBeUndefined();
  });

  /**
   * O caso que derruba o teste ingênuo de "não é <button>, logo não é botão": o
   * rodapé do Dialog no próprio design system faz `render={<Button />}`. O
   * componente não é a tag `button`, mas renderiza uma — e não navega.
   */
  test("não deduz para componente que não navega, mesmo não sendo a tag button", () => {
    expect(
      resolveNativeButton(
        createElement(BotaoProprio, { variant: "outline" }),
        undefined,
      ),
    ).toBeUndefined();
  });

  test("não deduz para render em função, que não dá para inspecionar", () => {
    expect(
      resolveNativeButton(() => createElement("a"), undefined),
    ).toBeUndefined();
  });

  test("valor explícito vence a dedução nos dois sentidos", () => {
    const link = createElement("a", { href: "/x" });
    expect(resolveNativeButton(link, true)).toBe(true);
    expect(resolveNativeButton(createElement("button"), false)).toBe(false);
  });
});
