import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { MultiSelect } from "./multi-select";
import { descreverContrasteDosTextos } from "../../test/textos";

const OPCOES = [
  { value: "deploy", label: "Deploy" },
  { value: "billing", label: "Cobrança" },
  { value: "logs", label: "Logs" },
  { value: "members", label: "Membros", disabled: true },
];
const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "MultiSelect",
  montar: () => (
    <MultiSelect options={OPCOES} defaultValue={[OPCOES[0], OPCOES[2]]} />
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("MultiSelect", () => {
  test("renderiza valores iniciais como chips e abre opções", async () => {
    const tela = await render(
      <MultiSelect
        options={OPCOES}
        defaultValue={[OPCOES[0], OPCOES[2]]}
        placeholder="Selecionar permissões"
      />,
    );
    const campo = tela.getByRole("combobox", { name: "Selecionar permissões" });

    expect(
      tela.container.querySelectorAll('[data-slot="combobox-chip"]'),
    ).toHaveLength(2);
    await expect.element(tela.getByText("Deploy")).toBeVisible();
    await expect.element(tela.getByText("Logs")).toBeVisible();
    await campo.click();
    await expect.element(tela.getByRole("listbox")).toBeVisible();
  });

  test("adiciona opções sem substituir seleções existentes", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <MultiSelect
        options={OPCOES}
        defaultValue={[OPCOES[0]]}
        onValueChange={aoMudar}
        placeholder="Permissões"
      />,
    );

    await tela.getByRole("combobox", { name: "Permissões" }).click();
    await tela.getByRole("option", { name: "Cobrança" }).click();

    expect(aoMudar).toHaveBeenCalledWith([OPCOES[0], OPCOES[1]]);
    expect(
      Array.from(
        tela.container.querySelectorAll('[data-slot="combobox-chip"]'),
        (chip) => chip.textContent,
      ),
    ).toContain("Cobrança");
  });

  test("filtra opções e preserva item desabilitado", async () => {
    const tela = await render(
      <MultiSelect options={OPCOES} placeholder="Permissões" />,
    );
    const campo = tela.getByRole("combobox", { name: "Permissões" });

    await campo.fill("Mem");

    const membros = tela.getByRole("option", { name: "Membros" });
    await expect.element(membros).toBeVisible();
    await expect.element(membros).toHaveAttribute("aria-disabled", "true");
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);
  });

  test("desabilita o campo inteiro", async () => {
    const tela = await render(
      <MultiSelect options={OPCOES} disabled placeholder="Permissões" />,
    );

    await expect
      .element(tela.getByRole("combobox", { name: "Permissões" }))
      .toBeDisabled();
  });

  test("adiciona a opção destacada usando apenas o teclado", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <MultiSelect
        options={OPCOES}
        onValueChange={aoMudar}
        placeholder="Permissões"
      />,
    );
    const campo = tela.getByRole("combobox", { name: "Permissões" });

    campo.element().focus();
    await userEvent.keyboard("{ArrowDown}");

    await expect.element(tela.getByRole("listbox")).toBeVisible();
    const destacada = document.querySelector(
      '[role="option"][data-highlighted]',
    );
    expect(destacada).not.toBeNull();
    const rotulo = destacada!.textContent?.trim();

    await userEvent.keyboard("{Enter}");

    expect(
      Array.from(
        tela.container.querySelectorAll('[data-slot="combobox-chip"]'),
        (chip) => chip.textContent?.trim(),
      ),
    ).toContain(rotulo);
    expect(aoMudar).toHaveBeenCalledOnce();
  });
});
