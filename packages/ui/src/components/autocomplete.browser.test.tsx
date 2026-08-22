import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Autocomplete } from "./autocomplete";
import {
  MINIMO,
  contrasteDe,
  contrasteDoPlaceholder,
} from "../../test/contrast";

const CIDADES = [
  { value: "sao-paulo", label: "São Paulo" },
  { value: "rio", label: "Rio de Janeiro" },
  { value: "recife", label: "Recife" },
];

describe("Autocomplete", () => {
  test("expõe campo pesquisável com texto e placeholder legíveis", async () => {
    const tela = await render(
      <Autocomplete
        options={CIDADES}
        defaultValue="Recife"
        placeholder="Digite uma cidade"
      />,
    );
    const campo = tela.getByRole("combobox").element();

    expect((campo as HTMLInputElement).value).toBe("Recife");
    expect(campo.getAttribute("placeholder")).toBe("Digite uma cidade");
    expect(contrasteDe(campo)).toBeGreaterThanOrEqual(MINIMO.texto);
    expect(contrasteDoPlaceholder(campo)).toBeGreaterThanOrEqual(MINIMO.texto);
  });

  test("abre sugestões ao clicar e seleciona uma opção", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <Autocomplete options={CIDADES} onValueChange={aoMudar} />,
    );
    const campo = tela.getByRole("combobox");

    await campo.click();
    await expect.element(tela.getByRole("listbox")).toBeVisible();
    await tela.getByRole("option", { name: "Rio de Janeiro" }).click();

    expect((campo.element() as HTMLInputElement).value).toBe("Rio de Janeiro");
    expect(aoMudar).toHaveBeenLastCalledWith("Rio de Janeiro");
  });

  test("filtra sugestões e mantém texto livre", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <Autocomplete options={CIDADES} onValueChange={aoMudar} />,
    );
    const campo = tela.getByRole("combobox");

    await campo.fill("Rec");

    await expect
      .element(tela.getByRole("option", { name: "Recife" }))
      .toBeVisible();
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);
    expect(aoMudar).toHaveBeenLastCalledWith("Rec");
  });

  test("mostra estado vazio e mensagem de carregamento", async () => {
    const tela = await render(
      <Autocomplete
        options={CIDADES}
        loading
        emptyMessage="Cidade não encontrada"
      />,
    );
    const campo = tela.getByRole("combobox");

    await campo.fill("zzzz");

    await expect.element(tela.getByText("Buscando...")).toBeVisible();
    await expect.element(tela.getByText("Cidade não encontrada")).toBeVisible();
    expect(
      tela.container
        .querySelector('[data-slot="autocomplete"] svg')
        ?.classList.contains("animate-spin"),
    ).toBe(true);
  });

  test("desabilita o campo e impede a abertura", async () => {
    const tela = await render(<Autocomplete options={CIDADES} disabled />);
    const campo = tela.getByRole("combobox");

    await expect.element(campo).toBeDisabled();
    (campo.element() as HTMLElement).click();
    expect(
      document.querySelector('[data-slot="autocomplete-content"]'),
    ).toBeNull();
  });
});
