import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Collapsible } from "./collapsible";
import { NavActiveGlow, NavCaret, navTreeItem, navTreeRail } from "./nav-tree";

function pseudo(raiz: Element, seletor: string, qual: "::before" | "::after") {
  const alvo = raiz.querySelector(seletor);
  if (!alvo) throw new Error(`não achei ${seletor}`);
  return getComputedStyle(alvo, qual);
}

describe("NavTree", () => {
  test("desenha trilho, conectores e segmento do item ativo", async () => {
    const tela = await render(
      <div className={navTreeRail} data-slot="trilho">
        <div className={navTreeItem} data-slot="inativo">
          <a href="#inativo">Inativo</a>
        </div>
        <div className={navTreeItem} data-slot="ativo">
          <a href="#ativo" data-active>
            Ativo
          </a>
        </div>
      </div>,
    );
    const raiz = tela.container;
    const trilho = pseudo(raiz, '[data-slot="trilho"]', "::before");
    const inativo = pseudo(raiz, '[data-slot="inativo"]', "::after");
    const ativo = pseudo(raiz, '[data-slot="ativo"]', "::after");

    expect(parseFloat(trilho.width)).toBeGreaterThan(0);
    expect(inativo.backgroundColor).not.toBe(ativo.backgroundColor);
  });

  test("o realce responde ao item ativo e fica atrás do conteúdo", async () => {
    const tela = await render(
      <span className="group relative isolate" data-active>
        Item ativo
        <NavActiveGlow />
      </span>,
    );
    const glow = tela.container.querySelector('[data-slot="nav-active-glow"]')!;
    const estilo = getComputedStyle(glow);

    expect(estilo.opacity).toBe("1");
    expect(estilo.zIndex).toBe("-10");
    expect(glow.getAttribute("aria-hidden")).toBe("true");
  });

  test("o caret gira quando o grupo está aberto", async () => {
    const tela = await render(
      <Collapsible defaultOpen className="group/collapsible">
        <NavCaret />
      </Collapsible>,
    );
    const caret = tela.container.querySelector('[data-slot="nav-caret"]')!;

    expect(caret.parentElement?.hasAttribute("data-open")).toBe(true);
    expect(getComputedStyle(caret).rotate).toBe("180deg");
  });
});
