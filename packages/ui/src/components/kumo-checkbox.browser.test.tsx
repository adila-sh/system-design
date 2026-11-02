import {
  contrasteDe,
  contrasteDoPreenchimento,
  MINIMO,
} from "../../test/contrast";
import { afterEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { KumoCheckbox } from "./kumo-checkbox";

test("associa o rótulo e comunica a seleção por teclado", async () => {
  const change = vi.fn();
  const tela = await render(
    <KumoCheckbox label="Receber novidades" onCheckedChange={change} />,
  );
  const controle = tela.getByRole("checkbox", { name: "Receber novidades" });
  controle.element().focus();
  await userEvent.keyboard(" ");
  await expect.element(controle).toHaveAttribute("aria-checked", "true");
  expect(change).toHaveBeenCalled();
});
test("expõe o estado misto", async () => {
  const tela = await render(
    <KumoCheckbox aria-label="Selecionar todos" indeterminate />,
  );
  await expect
    .element(tela.getByRole("checkbox", { name: "Selecionar todos" }))
    .toHaveAttribute("aria-checked", "mixed");
});

afterEach(() => document.documentElement.classList.remove("dark"));
test.each(["light", "dark"])(
  "mantém seleção e indicador perceptíveis no tema %s",
  async (tema) => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(
      <KumoCheckbox aria-label="Selecionado" checked />,
    );
    const controle = tela
      .getByRole("checkbox", { name: "Selecionado" })
      .element();
    expect(contrasteDoPreenchimento(controle)).toBeGreaterThanOrEqual(
      MINIMO.naoTexto,
    );
    expect(
      contrasteDe(controle.querySelector("svg") as Element),
    ).toBeGreaterThanOrEqual(MINIMO.naoTexto);
  },
);
