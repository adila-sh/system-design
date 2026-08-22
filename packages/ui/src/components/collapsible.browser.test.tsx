import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Collapsible expandido",
  montar: () => (
    <Collapsible defaultOpen>
      <CollapsibleTrigger>Detalhes da cobrança</CollapsibleTrigger>
      <CollapsibleContent>
        O vencimento ocorre no último dia útil do mês.
      </CollapsibleContent>
    </Collapsible>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Collapsible", () => {
  test("associa o gatilho ao painel e alterna o estado expandido", async () => {
    const tela = await render(
      <Collapsible>
        <CollapsibleTrigger>Ver detalhes</CollapsibleTrigger>
        <CollapsibleContent>Conteúdo adicional</CollapsibleContent>
      </Collapsible>,
    );

    const gatilho = tela.getByRole("button", { name: "Ver detalhes" });
    expect(gatilho.element().getAttribute("aria-expanded")).toBe("false");

    await gatilho.click();

    expect(gatilho.element().getAttribute("aria-expanded")).toBe("true");
    const painelId = gatilho.element().getAttribute("aria-controls");
    expect(painelId).toBeTruthy();
    expect(document.getElementById(painelId!)).not.toBeNull();
    await expect.element(tela.getByText("Conteúdo adicional")).toBeVisible();
  });
});
