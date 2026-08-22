import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Label } from "./label";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Label",
  montar: () => <Label htmlFor="email-cobranca">E-mail de cobrança</Label>,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Label", () => {
  test("associa o texto ao controle indicado por htmlFor", async () => {
    const tela = await render(
      <div>
        <Label htmlFor="email-contato">E-mail de contato</Label>
        <input id="email-contato" />
      </div>,
    );

    const label = tela.container.querySelector('[data-slot="label"]');
    const input = tela.container.querySelector("input");

    expect(label).toBeInstanceOf(HTMLLabelElement);
    expect((label as HTMLLabelElement).control).toBe(input);
  });
});
