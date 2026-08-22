import { afterEach, describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { Slider } from "./slider";
import {
  MINIMO,
  contrasteDaBorda,
  contrasteDoPreenchimento,
} from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

// O indicador usa primary sobre muted, o mesmo par do Progress. No escuro ele
// mede 2.90:1, ligeiramente abaixo do mínimo não textual.
const INDICADOR_ABAIXO_DO_MINIMO = new Map([["dark", 2.9]]);

describe.each(TEMAS)("Slider no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("indicador e polegar permanecem perceptíveis", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(
      <Slider defaultValue={[60]} aria-label="Volume" className="w-40" />,
    );
    const indicador = tela.container.querySelector(
      '[data-slot="slider-range"]',
    );
    const polegar = tela.container.querySelector('[data-slot="slider-thumb"]');
    const contraste = contrasteDoPreenchimento(indicador as Element);
    const piso = INDICADOR_ABAIXO_DO_MINIMO.get(tema);

    if (piso === undefined) {
      expect(contraste).toBeGreaterThanOrEqual(MINIMO.naoTexto);
    } else {
      expect(contraste).toBeGreaterThanOrEqual(piso);
      expect(
        contraste,
        `indicador no tema ${tema} agora passa em 1.4.11 — remova a entrada`,
      ).toBeLessThan(MINIMO.naoTexto);
    }
    expect(contrasteDaBorda(polegar as Element)).toBeGreaterThanOrEqual(
      MINIMO.naoTexto,
    );
  });
});

describe("Slider interativo", () => {
  test("expõe o valor e responde ao teclado", async () => {
    const tela = await render(
      <Slider defaultValue={[40]} step={5} aria-label="Volume" />,
    );
    const controle = tela.getByRole("slider", { name: "Volume" });

    expect(controle.element().getAttribute("aria-valuenow")).toBe("40");
    controle.element().focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(controle.element().getAttribute("aria-valuenow")).toBe("45");
  });

  test.each(["horizontal", "vertical"] as const)(
    "orientation=%s aplica a geometria correta",
    async (orientation) => {
      const tela = await render(
        <div className="h-40 w-40">
          <Slider
            orientation={orientation}
            defaultValue={[50]}
            aria-label="Posição"
          />
        </div>,
      );
      const raiz = tela.container.querySelector('[data-slot="slider"]')!;
      const trilho = tela.container.querySelector(
        '[data-slot="slider-track"]',
      )!;
      const caixa = trilho.getBoundingClientRect();

      expect(raiz.getAttribute("data-orientation")).toBe(orientation);
      expect(orientation === "horizontal" ? caixa.height : caixa.width).toBe(4);
    },
  );
});
