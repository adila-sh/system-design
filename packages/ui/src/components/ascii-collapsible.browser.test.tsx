import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { AsciiCollapsible } from "./ascii-collapsible";
import {
  descreverContrasteDosTextos,
  soDecoracaoAscii,
  soGlifos,
} from "../../test/textos";

// O chevron comunica o estado expansível, portanto é um indicador gráfico e
// pede 3:1. No tema claro, muted-foreground/60 fica em 2.34:1 contra o fundo.
const ABAIXO_DO_MINIMO = new Map([["light/›", 2.34]]);

// O primeiro item começa aberto para que a varredura alcance, no mesmo render,
// o gatilho em foreground e o conteúdo em muted-foreground. Os conectores são
// apenas a moldura visual da lista e, por isso, ficam fora da medição.
descreverContrasteDosTextos({
  nome: "AsciiCollapsible",
  montar: () => (
    <AsciiCollapsible
      label="Documentação"
      items={[
        {
          label: "Guia de início",
          content: "Instale o pacote e importe os estilos.",
          defaultOpen: true,
        },
        { label: "Referência", content: "Consulte as propriedades." },
      ]}
    />
  ),
  comoGrafico: soGlifos,
  ignorar: soDecoracaoAscii,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("AsciiCollapsible interativo", () => {
  test("expõe uma lista rotulada e alterna o item pelo gatilho", async () => {
    const tela = await render(
      <AsciiCollapsible
        label="Perguntas frequentes"
        items={[{ label: "Entrega", content: "Em até cinco dias úteis." }]}
      />,
    );

    const raiz = tela.container.querySelector(
      '[data-slot="ascii-collapsible"]',
    );
    const gatilho = tela.getByRole("button", { name: "Entrega" });

    expect(raiz?.getAttribute("role")).toBe("list");
    expect(raiz?.getAttribute("aria-label")).toBe("Perguntas frequentes");
    expect(raiz?.querySelectorAll('[role="listitem"]')).toHaveLength(1);
    expect(gatilho.element().getAttribute("aria-expanded")).toBe("false");

    await gatilho.click();

    expect(gatilho.element().getAttribute("aria-expanded")).toBe("true");
    expect(tela.container.textContent).toContain("Em até cinco dias úteis.");
  });
});
