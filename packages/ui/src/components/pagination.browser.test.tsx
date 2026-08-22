import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploPaginacao() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#anterior" text="Anterior" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#pagina-1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#pagina-2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#proxima" text="Próxima" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

descreverContrasteDosTextos({
  nome: "Pagination",
  montar: () => <ExemploPaginacao />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Pagination", () => {
  test("identifica a navegação e a página atual", async () => {
    const tela = await render(<ExemploPaginacao />);
    const paginas = tela.container.querySelectorAll(
      '[data-slot="pagination-link"]',
    );

    expect(
      tela.getByRole("navigation", { name: "pagination" }).element(),
    ).toBeTruthy();
    expect(paginas).toHaveLength(4);
    expect(paginas[2]?.getAttribute("aria-current")).toBe("page");
    expect(paginas[1]?.hasAttribute("aria-current")).toBe(false);
    expect(paginas[2]?.getAttribute("href")).toBe("#pagina-2");
  });

  test("oferece nomes acessíveis para os controles anterior e próximo", async () => {
    const tela = await render(<ExemploPaginacao />);
    const anterior = tela.container.querySelector('a[href="#anterior"]');
    const proxima = tela.container.querySelector('a[href="#proxima"]');

    expect(anterior?.getAttribute("aria-label")).toBe("Go to previous page");
    expect(proxima?.getAttribute("aria-label")).toBe("Go to next page");
    expect(
      tela.container
        .querySelector('[data-slot="pagination-ellipsis"]')
        ?.getAttribute("aria-hidden"),
    ).toBe("true");
  });
});
