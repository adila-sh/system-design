import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { ScrollArea } from "./scroll-area";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function Exemplo() {
  return (
    <ScrollArea className="h-20 w-40">
      <div className="h-80">Conteúdo com rolagem</div>
    </ScrollArea>
  );
}

descreverContrasteDosTextos({
  nome: "ScrollArea",
  montar: () => <Exemplo />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("ScrollArea", () => {
  test("limita o viewport e monta a barra vertical", async () => {
    const tela = await render(<Exemplo />);
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );

    const raiz = tela.container.querySelector('[data-slot="scroll-area"]')!;
    const viewport = tela.container.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement;
    const barra = tela.container.querySelector(
      '[data-slot="scroll-area-scrollbar"]',
    );

    expect(raiz.getBoundingClientRect().height).toBe(80);
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    expect(barra?.getAttribute("data-orientation")).toBe("vertical");
    expect(barra?.getBoundingClientRect().width).toBe(10);
  });
});
