import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { KumoInput } from "./kumo-input";

test("associa o rótulo, mostra erro e preserva o estado inválido", async () => {
  const tela = await render(
    <KumoInput
      label="Pesquisa"
      error="Informe uma busca"
      icon={<span>⌕</span>}
    />,
  );
  const campo = tela.getByRole("textbox", { name: "Pesquisa" });
  await expect.element(campo).toHaveAttribute("aria-invalid", "true");
  await expect.element(tela.getByText("Informe uma busca")).toBeVisible();
});

test("limpa a busca e devolve o foco ao campo", async () => {
  const limpar = vi.fn();
  const tela = await render(
    <KumoInput label="Pesquisa" defaultValue="Adila" onClear={limpar} />,
  );
  const campo = tela.getByRole("textbox", { name: "Pesquisa" });
  await tela.getByRole("button", { name: "Limpar" }).click();
  await expect.poll(() => limpar.mock.calls.length).toBe(1);
  await expect.element(campo).toHaveFocus();
});

test.each([false, true])(
  "mantém altura de toque com ícone=%s",
  async (comIcone) => {
    const tela = await render(
      <KumoInput
        aria-label="Buscar"
        icon={comIcone ? <span>⌕</span> : undefined}
      />,
    );
    expect(
      tela
        .getByRole("textbox", { name: "Buscar" })
        .element()
        .getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
  },
);
