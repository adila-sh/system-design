import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Switch } from "./switch";
import { MINIMO, contrasteDoPreenchimento } from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

// O trilho desligado usa --input (com 80% no escuro) e quase se funde ao fundo.
// O tamanho não muda a cor, então os dois tamanhos compartilham os mesmos pisos.
const TRILHO_DESLIGADO_ABAIXO_DO_MINIMO = new Map([
  ["light/sm", 1.23],
  ["light/default", 1.23],
  ["dark/sm", 1.39],
  ["dark/default", 1.39],
]);

describe.each(TEMAS)("Switch no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test.each(["sm", "default"] as const)(
    "size=%s mantém os estados perceptíveis",
    async (size) => {
      document.documentElement.classList.toggle("dark", tema === "dark");
      const tela = await render(
        <div>
          <Switch size={size} aria-label="Notificações desligadas" />
          <Switch
            size={size}
            defaultChecked
            aria-label="Notificações ligadas"
          />
        </div>,
      );
      const switches = tela.container.querySelectorAll('[data-slot="switch"]');
      const desligado = switches[0];
      const ligado = switches[1];
      const polegar = ligado?.querySelector('[data-slot="switch-thumb"]');

      const contrasteDesligado = contrasteDoPreenchimento(desligado);
      const piso = TRILHO_DESLIGADO_ABAIXO_DO_MINIMO.get(`${tema}/${size}`);
      if (piso === undefined) {
        expect(contrasteDesligado).toBeGreaterThanOrEqual(MINIMO.naoTexto);
      } else {
        expect(contrasteDesligado).toBeGreaterThanOrEqual(piso);
        expect(
          contrasteDesligado,
          `${tema}/${size} agora passa em 1.4.11 — remova a entrada`,
        ).toBeLessThan(MINIMO.naoTexto);
      }

      expect(contrasteDoPreenchimento(ligado)).toBeGreaterThanOrEqual(
        MINIMO.naoTexto,
      );
      expect(
        contrasteDoPreenchimento(polegar as Element),
      ).toBeGreaterThanOrEqual(MINIMO.naoTexto);
    },
  );
});

describe("Switch interativo", () => {
  test("alterna aria-checked ao ser acionado", async () => {
    const tela = await render(<Switch aria-label="Notificações" />);
    const controle = tela.getByRole("switch", { name: "Notificações" });

    expect(controle.element().getAttribute("aria-checked")).toBe("false");
    await controle.click();
    expect(controle.element().getAttribute("aria-checked")).toBe("true");
  });
});
