import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  test("renderiza a geometria e a animação de carregamento", async () => {
    const tela = await render(
      <Skeleton className="h-4 w-32" aria-hidden="true" />,
    );
    const skeleton = tela.container.querySelector(
      '[data-slot="skeleton"]',
    ) as HTMLElement;
    const caixa = skeleton.getBoundingClientRect();
    const estilo = getComputedStyle(skeleton);

    expect(caixa.width).toBe(128);
    expect(caixa.height).toBe(16);
    expect(estilo.animationName).toContain("pulse");
    expect(estilo.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(skeleton.getAttribute("aria-hidden")).toBe("true");
  });
});
