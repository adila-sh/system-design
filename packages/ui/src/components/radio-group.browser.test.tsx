import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { MINIMO, contrasteDoPreenchimento } from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

describe.each(TEMAS)("RadioGroup no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("o item marcado e seu indicador permanecem perceptíveis", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(
      <RadioGroup defaultValue="mensal" aria-label="Periodicidade">
        <RadioGroupItem value="mensal" aria-label="Mensal" />
      </RadioGroup>,
    );
    const item = tela.getByRole("radio", { name: "Mensal" }).element();
    const indicador = item.querySelector(
      '[data-slot="radio-group-indicator"] span',
    );

    expect(item.getAttribute("aria-checked")).toBe("true");
    expect(contrasteDoPreenchimento(item)).toBeGreaterThanOrEqual(
      MINIMO.naoTexto,
    );
    expect(
      contrasteDoPreenchimento(indicador as Element),
    ).toBeGreaterThanOrEqual(MINIMO.naoTexto);
  });
});

describe("RadioGroup interativo", () => {
  test("move a seleção para o item acionado", async () => {
    const tela = await render(
      <RadioGroup defaultValue="mensal" aria-label="Periodicidade">
        <RadioGroupItem value="mensal" aria-label="Mensal" />
        <RadioGroupItem value="anual" aria-label="Anual" />
      </RadioGroup>,
    );
    const mensal = tela.getByRole("radio", { name: "Mensal" });
    const anual = tela.getByRole("radio", { name: "Anual" });

    await anual.click();

    expect(mensal.element().getAttribute("aria-checked")).toBe("false");
    expect(anual.element().getAttribute("aria-checked")).toBe("true");
  });
});
