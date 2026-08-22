import { HouseIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  BottomBar,
  BottomBarButton,
  BottomBarItem,
  BottomBarLabel,
  BottomBarList,
} from "./bottom-bar";
import { descreverContrasteDosTextos } from "../../test/textos";

// O item ativo usa primary como texto pequeno e mede 3.82:1 no tema escuro.
const ABAIXO_DO_MINIMO = new Map([["dark/Início", 3.81]]);

function ExemploBottomBar({ aoBuscar }: { aoBuscar?: () => void }) {
  return (
    <BottomBar className="static md:flex">
      <BottomBarList>
        <BottomBarItem>
          <BottomBarButton render={<a href="/inicio" />} isActive>
            <HouseIcon aria-hidden="true" />
            <BottomBarLabel>Início</BottomBarLabel>
          </BottomBarButton>
        </BottomBarItem>
        <BottomBarItem>
          <BottomBarButton onClick={aoBuscar}>
            <MagnifyingGlassIcon aria-hidden="true" />
            <BottomBarLabel>Buscar</BottomBarLabel>
          </BottomBarButton>
        </BottomBarItem>
      </BottomBarList>
    </BottomBar>
  );
}

descreverContrasteDosTextos({
  nome: "BottomBar",
  montar: () => <ExemploBottomBar />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("BottomBar", () => {
  test("expõe navegação, lista e página atual", async () => {
    const tela = await render(<ExemploBottomBar />);
    const navegacao = tela.getByRole("navigation", {
      name: "Navegação principal",
    });
    const atual = tela.getByRole("link", { name: "Início" }).element();

    expect(navegacao.element().querySelectorAll("li")).toHaveLength(2);
    expect(atual.getAttribute("href")).toBe("/inicio");
    expect(atual.getAttribute("aria-current")).toBe("page");
    expect(
      (
        tela
          .getByRole("button", { name: "Buscar" })
          .element() as HTMLButtonElement
      ).type,
    ).toBe("button");
  });

  test("aciona botões sem marcar itens inativos como página atual", async () => {
    const aoBuscar = vi.fn();
    const tela = await render(<ExemploBottomBar aoBuscar={aoBuscar} />);
    const buscar = tela.getByRole("button", { name: "Buscar" });

    expect(buscar.element().hasAttribute("aria-current")).toBe(false);
    await buscar.click();
    expect(aoBuscar).toHaveBeenCalledTimes(1);
  });
});
