import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Badge } from "./badge";
import { TEMAS } from "../../test/variantes";

/**
 * O Badge destructive tinha dois níveis de tinta, mas escolhidos por TEMA em
 * vez de por estado: base normal no claro, base forte no escuro, hover sempre
 * forte. No escuro isso colapsava — base e hover na mesma cor, e passar o mouse
 * não mudava nada.
 *
 * Nenhum teste pegava porque contraste se mede no estado parado, e no claro o
 * hover funcionava. Aqui a afirmação é sobre a relação entre os dois estados,
 * não sobre a cor de cada um.
 *
 * Comparar com uma referência renderizada em vez de ler --destructive-tint-strong
 * da raiz é de propósito: a custom property guarda um color-mix, e o que
 * interessa é a cor que o navegador realmente pinta.
 */
function corDeFundo(elemento: Element) {
  return getComputedStyle(elemento).backgroundColor;
}

describe.each(TEMAS)("Badge destructive no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("o hover pinta uma cor diferente da base", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");

    const tela = await render(
      <>
        <Badge variant="destructive">3 falhas</Badge>
        <span data-slot="referencia" className="bg-destructive-tint-strong" />
      </>,
    );

    const base = tela.container.querySelector('[data-slot="badge"]');
    const nivelDeHover = tela.container.querySelector(
      '[data-slot="referencia"]',
    );

    expect(base, "Badge não renderizou").not.toBeNull();
    expect(
      corDeFundo(base!),
      `no tema ${tema} a base do Badge já é a cor do hover — passar o mouse não muda nada`,
    ).not.toBe(corDeFundo(nivelDeHover!));
  });
});
