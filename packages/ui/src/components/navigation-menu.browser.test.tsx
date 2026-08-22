import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import { descreverContrasteDosTextos } from "../../test/textos";

function ExemploNavegacao({ aoAbrir }: { aoAbrir?: () => void } = {}) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="produtos">
          <NavigationMenuTrigger onClick={aoAbrir}>
            Produtos
          </NavigationMenuTrigger>
          <NavigationMenuIndicator />
          <NavigationMenuContent>
            <NavigationMenuLink href="/analytics">Analytics</NavigationMenuLink>
            <NavigationMenuLink href="/automacoes" active>
              Automações
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/precos">Preços</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

descreverContrasteDosTextos({
  nome: "NavigationMenu",
  montar: () => <ExemploNavegacao />,
  abaixoDoMinimo: new Map<string, number>(),
});

describe("NavigationMenu", () => {
  test("expõe navegação, lista, gatilho e link direto", async () => {
    const tela = await render(<ExemploNavegacao />);

    expect(tela.getByRole("navigation")).toBeTruthy();
    expect(tela.getByRole("list")).toBeTruthy();
    expect(tela.getByRole("button", { name: "Produtos" })).toBeTruthy();
    expect(
      tela.getByRole("link", { name: "Preços" }).element().getAttribute("href"),
    ).toBe("/precos");
  });

  test("abre o painel e revela os links de produto", async () => {
    const tela = await render(<ExemploNavegacao />);
    const gatilho = tela.getByRole("button", { name: "Produtos" });

    await gatilho.click();

    await expect
      .element(tela.getByRole("link", { name: "Analytics" }))
      .toBeVisible();
    expect(gatilho.element().getAttribute("aria-expanded")).toBe("true");
    expect(
      document.querySelector('[data-slot="navigation-menu-content"]'),
    ).not.toBeNull();
  });

  test("marca o destino ativo e preserva os hrefs no portal", async () => {
    const tela = await render(<ExemploNavegacao />);
    await tela.getByRole("button", { name: "Produtos" }).click();

    const ativo = tela.getByRole("link", { name: "Automações" }).element();
    expect(ativo.getAttribute("href")).toBe("/automacoes");
    expect(ativo.getAttribute("data-active")).not.toBeNull();
  });

  test("encaminha eventos do gatilho", async () => {
    const aoAbrir = vi.fn();
    const tela = await render(<ExemploNavegacao aoAbrir={aoAbrir} />);

    await tela.getByRole("button", { name: "Produtos" }).click();
    expect(aoAbrir).toHaveBeenCalledOnce();
  });
});
