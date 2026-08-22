import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "./number-field";
import { descreverContrasteDeTexto } from "../../test/variantes";

const ESTADOS = ["default"] as const;
const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploNumero({
  onValueChange,
}: {
  onValueChange?: (value: number | null) => void;
}) {
  return (
    <NumberField defaultValue={3} min={1} max={5} onValueChange={onValueChange}>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Quantidade" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}

descreverContrasteDeTexto({
  nome: "NumberField",
  variantes: ESTADOS,
  prop: "estado",
  montar: () => <ExemploNumero />,
  seletor: '[data-slot="number-field-input"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("NumberField", () => {
  test("incrementa e decrementa respeitando o step", async () => {
    const aoMudar = vi.fn();
    const tela = await render(<ExemploNumero onValueChange={aoMudar} />);
    const campo = tela.getByRole("textbox", { name: "Quantidade" }).element();

    expect((campo as HTMLInputElement).value).toBe("3");
    await tela.getByRole("button", { name: "Incrementar" }).click();
    expect((campo as HTMLInputElement).value).toBe("4");
    await tela.getByRole("button", { name: "Diminuir" }).click();
    expect((campo as HTMLInputElement).value).toBe("3");
    expect(aoMudar).toHaveBeenCalledWith(4, expect.anything());
  });

  test("desabilita o incremento ao atingir o máximo", async () => {
    const tela = await render(
      <NumberField defaultValue={5} max={5}>
        <NumberFieldGroup>
          <NumberFieldInput aria-label="Limite" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>,
    );

    expect(
      (
        tela
          .getByRole("button", { name: "Incrementar" })
          .element() as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });

  test("expõe área de arraste dentro do mesmo campo", async () => {
    const tela = await render(
      <NumberField defaultValue={50}>
        <NumberFieldScrubArea>Opacidade</NumberFieldScrubArea>
        <NumberFieldGroup>
          <NumberFieldInput aria-label="Opacidade" />
        </NumberFieldGroup>
      </NumberField>,
    );

    expect(
      tela.container.querySelector('[data-slot="number-field-scrub-area"]')
        ?.textContent,
    ).toBe("Opacidade");
  });
});
