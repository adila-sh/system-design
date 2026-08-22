import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { AspectRatio } from "./aspect-ratio";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "AspectRatio",
  montar: () => (
    <AspectRatio ratio={16 / 9} className="w-72">
      Prévia do vídeo
    </AspectRatio>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("AspectRatio", () => {
  test.each([
    [16 / 9, "16:9"],
    [1, "1:1"],
    [4 / 3, "4:3"],
  ] as const)("preserva a proporção %s (%s)", async (ratio, _formato) => {
    const tela = await render(
      <AspectRatio ratio={ratio} className="w-72" aria-label="Mídia" />,
    );
    const elemento = tela.container.querySelector(
      '[data-slot="aspect-ratio"]',
    ) as HTMLElement;
    const caixa = elemento.getBoundingClientRect();

    expect(caixa.width).toBeGreaterThan(0);
    expect(caixa.width / caixa.height).toBeCloseTo(ratio, 2);
    expect(elemento.style.getPropertyValue("--ratio")).toBe(String(ratio));
  });
});
