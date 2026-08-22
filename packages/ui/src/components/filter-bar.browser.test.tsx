import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./button";
import {
  FilterBar,
  FilterBarActions,
  FilterBarGroup,
  FilterBarResults,
} from "./filter-bar";
import { Input } from "./input";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploFilterBar({ onApply }: { onApply?: () => void }) {
  return (
    <FilterBar aria-label="Filtros de clientes">
      <FilterBarGroup>
        <Input aria-label="Buscar clientes" defaultValue="Ana" />
        <FilterBarResults>24 resultados</FilterBarResults>
      </FilterBarGroup>
      <FilterBarActions>
        <Button variant="ghost" size="sm">
          Limpar
        </Button>
        <Button size="sm" onClick={onApply}>
          Aplicar filtros
        </Button>
      </FilterBarActions>
    </FilterBar>
  );
}

descreverContrasteDosTextos({
  nome: "FilterBar",
  montar: () => <ExemploFilterBar />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("FilterBar", () => {
  test("expõe busca nomeada, grupos e resultados anunciáveis", async () => {
    const tela = await render(<ExemploFilterBar />);
    const busca = tela.getByRole("search", { name: "Filtros de clientes" });
    const resultados = tela.getByText("24 resultados").element();

    expect(
      busca.element().querySelectorAll('[data-slot="filter-bar-group"]'),
    ).toHaveLength(1);
    expect(
      busca.element().querySelectorAll('[data-slot="filter-bar-actions"]'),
    ).toHaveLength(1);
    expect(resultados.getAttribute("aria-live")).toBe("polite");
    expect(
      (
        tela
          .getByRole("textbox", { name: "Buscar clientes" })
          .element() as HTMLInputElement
      ).value,
    ).toBe("Ana");
  });

  test("propaga ações do consumidor", async () => {
    const aplicar = vi.fn();
    const tela = await render(<ExemploFilterBar onApply={aplicar} />);

    await tela.getByRole("button", { name: "Aplicar filtros" }).click();
    expect(aplicar).toHaveBeenCalledTimes(1);
  });

  test("usa layout vertical e divisor superior no viewport estreito", async () => {
    const tela = await render(<ExemploFilterBar />);
    const barra = tela.container.querySelector('[data-slot="filter-bar"]')!;
    const acoes = tela.container.querySelector(
      '[data-slot="filter-bar-actions"]',
    )!;

    expect(getComputedStyle(barra).flexDirection).toBe("column");
    expect(getComputedStyle(acoes).borderLeftWidth).toBe("0px");
    expect(getComputedStyle(acoes).borderTopWidth).toBe("1px");
  });
});
