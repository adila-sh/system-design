import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select";
import { descreverContrasteDeTexto } from "../../test/variantes";

const TAMANHOS = ["default", "sm"] as const;
const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "NativeSelect",
  variantes: TAMANHOS,
  prop: "size",
  montar: (size) => (
    <NativeSelect size={size} defaultValue="pro" aria-label="Plano">
      <NativeSelectOption value="free">Free</NativeSelectOption>
      <NativeSelectOption value="pro">Pro</NativeSelectOption>
    </NativeSelect>
  ),
  seletor: '[data-slot="native-select"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("NativeSelect", () => {
  test("mantém a semântica nativa de grupos e opções", async () => {
    const tela = await render(
      <NativeSelect aria-label="Plano" defaultValue="pro">
        <NativeSelectOptGroup label="Planos individuais">
          <NativeSelectOption value="free">Free</NativeSelectOption>
          <NativeSelectOption value="pro">Pro</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOption value="enterprise">Enterprise</NativeSelectOption>
      </NativeSelect>,
    );

    const select = tela.getByRole("combobox", { name: "Plano" }).element();
    expect(select).toBeInstanceOf(HTMLSelectElement);
    expect((select as HTMLSelectElement).value).toBe("pro");
    expect(select.querySelector("optgroup")?.label).toBe("Planos individuais");
    expect(select.querySelectorAll("option")).toHaveLength(3);
  });

  test("propaga a seleção alterada", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <NativeSelect aria-label="Plano" onChange={aoMudar}>
        <NativeSelectOption value="free">Free</NativeSelectOption>
        <NativeSelectOption value="pro">Pro</NativeSelectOption>
      </NativeSelect>,
    );

    await tela.getByRole("combobox", { name: "Plano" }).selectOptions("pro");

    expect(aoMudar).toHaveBeenCalledTimes(1);
    expect(
      (
        tela
          .getByRole("combobox", { name: "Plano" })
          .element() as HTMLSelectElement
      ).value,
    ).toBe("pro");
  });
});
