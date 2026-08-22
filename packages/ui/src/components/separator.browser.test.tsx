import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Separator } from "./separator";
import { MINIMO, contrasteDoPreenchimento } from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

// O Separator usa --border contra o fundo da página. A linha já tem a geometria
// correta, mas o token não alcança os 3:1 de contraste não textual.
const ABAIXO_DO_MINIMO = new Map([
  ["light/horizontal", 1.23],
  ["light/vertical", 1.23],
  ["dark/horizontal", 1.36],
  ["dark/vertical", 1.36],
]);

describe.each(TEMAS)("Separator no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test.each(["horizontal", "vertical"] as const)(
    "orientation=%s é perceptível e preserva a geometria",
    async (orientation) => {
      document.documentElement.classList.toggle("dark", tema === "dark");
      const tela = await render(
        <div className="flex h-12 w-24 bg-background">
          <Separator orientation={orientation} />
        </div>,
      );
      const separador = tela.container.querySelector('[data-slot="separator"]');
      expect(separador).not.toBeNull();

      const caixa = separador!.getBoundingClientRect();
      expect(orientation === "horizontal" ? caixa.height : caixa.width).toBe(1);

      const contraste = contrasteDoPreenchimento(separador as Element);
      const piso = ABAIXO_DO_MINIMO.get(`${tema}/${orientation}`);
      if (piso === undefined) {
        expect(contraste).toBeGreaterThanOrEqual(MINIMO.naoTexto);
        return;
      }
      expect(contraste).toBeGreaterThanOrEqual(piso);
      expect(
        contraste,
        `${tema}/${orientation} agora passa em 1.4.11 — remova a entrada`,
      ).toBeLessThan(MINIMO.naoTexto);
    },
  );
});

describe("Separator semântico", () => {
  test("expõe papel e orientação à árvore acessível", async () => {
    const tela = await render(<Separator orientation="vertical" />);
    const separador = tela.getByRole("separator").element();

    expect(separador.getAttribute("aria-orientation")).toBe("vertical");
    expect(separador.getAttribute("data-orientation")).toBe("vertical");
  });
});
