import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Switch } from "./switch";
import { MINIMO, contrasteDoPreenchimento } from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

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

      expect(contrasteDoPreenchimento(desligado)).toBeGreaterThanOrEqual(
        MINIMO.naoTexto,
      );

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
