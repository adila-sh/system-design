import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "./sidebar";

/**
 * O desenho em árvore é quase todo pseudo-elemento, então asserção de classe
 * não prova nada: uma variante que o Tailwind não gerou deixa a classe no HTML
 * e a linha invisível na tela. Aqui medimos o que o navegador pintou.
 */
function montar(
  variant: "line" | "tree",
  ativo: "primeiro" | "ultimo" = "ultimo",
) {
  return (
    <SidebarProvider>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton activeIndicator="gradient" isActive>
            Integrações
          </SidebarMenuButton>
          <SidebarMenuSub variant={variant}>
            <SidebarMenuSubItem data-teste="primeiro">
              <SidebarMenuSubButton isActive={ativo === "primeiro"}>
                GitHub App
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem data-teste="ultimo">
              <SidebarMenuSubButton isActive={ativo === "ultimo"}>
                MCP
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarProvider>
  );
}

function pseudo(raiz: Element, seletor: string, qual: "::before" | "::after") {
  const alvo = raiz.querySelector(seletor);
  if (!alvo) throw new Error(`não achei ${seletor}`);
  return getComputedStyle(alvo, qual);
}

describe("SidebarMenuSub variant=tree", () => {
  test("desenha o trilho na lista e o conector em cada item", async () => {
    const tela = await render(montar("tree"));
    const raiz = tela.container;

    // O trilho vive no ::before da própria lista.
    const trilho = pseudo(raiz, '[data-slot="sidebar-menu-sub"]', "::before");
    expect(trilho.content).not.toBe("none");
    expect(parseFloat(trilho.width)).toBeGreaterThan(0);

    const conector = pseudo(raiz, '[data-teste="primeiro"]', "::before");
    expect(conector.content).not.toBe("none");
    expect(parseFloat(conector.width)).toBeGreaterThan(0);
  });

  test("o item ativo acende o conector, o inativo não", async () => {
    const tela = await render(montar("tree", "ultimo"));
    const raiz = tela.container;

    const inativo = pseudo(raiz, '[data-teste="primeiro"]', "::before");
    const ativo = pseudo(raiz, '[data-teste="ultimo"]', "::before");

    expect(ativo.backgroundColor).not.toBe(inativo.backgroundColor);
  });

  test("o segmento vertical só tem cor no item ativo", async () => {
    const tela = await render(montar("tree", "ultimo"));
    const raiz = tela.container;

    const inativo = pseudo(raiz, '[data-teste="primeiro"]', "::after");
    const ativo = pseudo(raiz, '[data-teste="ultimo"]', "::after");

    // Transparente resolve para rgba(..., 0) — o alfa é o que distingue.
    expect(inativo.backgroundColor).toMatch(/, ?0\)$/);
    expect(ativo.backgroundColor).not.toMatch(/, ?0\)$/);
  });

  /**
   * A regra `last:has-data-active:after:bottom-1/2` é a que impede a linha de
   * vazar para baixo do último item. Se o Tailwind não gerar essa combinação de
   * variantes, o segmento vai até embaixo e o teste pega.
   */
  test("no último item o segmento morre na metade da altura", async () => {
    const tela = await render(montar("tree", "ultimo"));
    const item = tela.container.querySelector('[data-teste="ultimo"]');
    if (!item) throw new Error("não achei o último item");

    const altura = item.getBoundingClientRect().height;
    const segmento = getComputedStyle(item, "::after");

    expect(altura).toBeGreaterThan(0);
    expect(parseFloat(segmento.bottom)).toBeCloseTo(altura / 2, 0);
  });

  test("a variante line segue com a régua e sem conector", async () => {
    const tela = await render(montar("line"));
    const raiz = tela.container;

    const lista = raiz.querySelector('[data-slot="sidebar-menu-sub"]');
    expect(getComputedStyle(lista!).borderLeftWidth).not.toBe("0px");

    expect(pseudo(raiz, '[data-teste="primeiro"]', "::before").content).toBe(
      "none",
    );
  });
});

describe("activeIndicator", () => {
  test("gradient troca a barra pelo realce", async () => {
    const tela = await render(montar("tree"));
    const raiz = tela.container;

    expect(raiz.querySelector('[data-slot="nav-active-glow"]')).not.toBeNull();
    expect(
      raiz.querySelector('[data-slot="sidebar-active-indicator"]'),
    ).toBeNull();
  });

  test("o realce fica atrás do conteúdo, não por cima", async () => {
    const tela = await render(montar("tree"));
    const glow = tela.container.querySelector('[data-slot="nav-active-glow"]');

    const estilo = getComputedStyle(glow!);
    expect(estilo.zIndex).toBe("-10");
    // Sem isolate no botão, o -10 escaparia o contexto e sumiria atrás do fundo.
    expect(getComputedStyle(glow!.parentElement!).isolation).toBe("isolate");
  });

  test("bar segue sendo o padrão de quem não pede nada", async () => {
    const tela = await render(
      <SidebarProvider>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarProvider>,
    );

    expect(
      tela.container.querySelector('[data-slot="sidebar-active-indicator"]'),
    ).not.toBeNull();
    expect(
      tela.container.querySelector('[data-slot="nav-active-glow"]'),
    ).toBeNull();
  });
});
