import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { CurrencyInput } from "./currency-input";
import { descreverContrasteDeTexto } from "../../test/variantes";

const MOEDAS = ["BRL"] as const;
const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "CurrencyInput",
  variantes: MOEDAS,
  prop: "moeda",
  montar: () => (
    <CurrencyInput
      defaultValue={149.9}
      inputProps={{ "aria-label": "Valor" }}
    />
  ),
  seletor: '[data-slot="number-field-input"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("CurrencyInput", () => {
  test("formata BRL com locale brasileiro por padrão", async () => {
    const tela = await render(
      <CurrencyInput
        defaultValue={149.9}
        inputProps={{ "aria-label": "Valor em reais" }}
      />,
    );
    const campo = tela
      .getByRole("textbox", { name: "Valor em reais" })
      .element();

    expect((campo as HTMLInputElement).value).toContain("R$");
    expect((campo as HTMLInputElement).value).toContain("149,90");
    expect(campo.getAttribute("inputmode")).toBe("decimal");
    expect(
      tela.container.querySelector('[data-slot="currency-input"]'),
    ).not.toBeNull();
  });

  test("oculta controles por padrão", async () => {
    const tela = await render(
      <CurrencyInput inputProps={{ "aria-label": "Valor" }} />,
    );

    expect(
      tela.container.querySelector('[data-slot="number-field-increment"]'),
    ).toBeNull();
    expect(
      tela.container.querySelector('[data-slot="number-field-decrement"]'),
    ).toBeNull();
  });

  test("formata outra moeda e propaga valor numérico pelos controles", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <CurrencyInput
        defaultValue={25}
        currency="USD"
        locale="en-US"
        step={1}
        showControls
        onValueChange={aoMudar}
        inputProps={{ "aria-label": "Valor em dólares" }}
      />,
    );
    const campo = tela
      .getByRole("textbox", { name: "Valor em dólares" })
      .element();

    expect((campo as HTMLInputElement).value).toBe("$25.00");
    await tela.getByRole("button", { name: "Incrementar" }).click();
    expect((campo as HTMLInputElement).value).toBe("$26.00");
    expect(aoMudar).toHaveBeenCalledWith(26, expect.anything());
  });
});
