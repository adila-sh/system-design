import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { BulkActionBar } from "./bulk-action-bar";
import { Button } from "./button";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "BulkActionBar",
  montar: () => (
    <BulkActionBar selectedCount={3}>
      <Button variant="ghost" size="sm">
        Arquivar
      </Button>
    </BulkActionBar>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("BulkActionBar", () => {
  test.each([0, -1])(
    "não renderiza com selectedCount=%s",
    async (selectedCount) => {
      const tela = await render(
        <BulkActionBar selectedCount={selectedCount}>Excluir</BulkActionBar>,
      );

      expect(
        tela.container.querySelector('[data-slot="bulk-action-bar"]'),
      ).toBeNull();
    },
  );

  test("expõe a contagem, ações e semântica de toolbar", async () => {
    const tela = await render(
      <BulkActionBar selectedCount={4}>
        <Button>Arquivar</Button>
      </BulkActionBar>,
    );
    const toolbar = tela
      .getByRole("toolbar", {
        name: "Ações para itens selecionados",
      })
      .element();

    expect(toolbar.textContent).toContain("4 selecionado(s)");
    expect(
      toolbar.querySelector('[data-slot="bulk-action-bar-actions"]'),
    ).not.toBeNull();
    await expect
      .element(tela.getByRole("button", { name: "Arquivar" }))
      .toBeVisible();
  });

  test("aceita rótulo customizado e limpa a seleção", async () => {
    const aoLimpar = vi.fn();
    const rotulo = vi.fn((quantidade: number) => `${quantidade} pedidos`);
    const tela = await render(
      <BulkActionBar selectedCount={2} label={rotulo} onClear={aoLimpar} />,
    );

    expect(rotulo).toHaveBeenCalledWith(2);
    await expect.element(tela.getByText("2 pedidos")).toBeVisible();
    await tela.getByRole("button", { name: "Limpar seleção" }).click();
    expect(aoLimpar).toHaveBeenCalledTimes(1);
  });
});
