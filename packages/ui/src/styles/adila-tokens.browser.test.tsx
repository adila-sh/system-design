import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { luminosidade } from "../../test/paleta";

const SUPERFICIES = ["background", "sidebar", "card", "popover"] as const;

describe("Hierarquia semântica de superfícies", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("o tema escuro forma uma escada perceptível até o plano flutuante", async () => {
    document.documentElement.classList.add("dark");
    await render(<div />);

    const estilos = getComputedStyle(document.documentElement);
    const niveis = SUPERFICIES.map((token) =>
      luminosidade(estilos.getPropertyValue(`--${token}`).trim()),
    );

    for (let i = 1; i < niveis.length; i++) {
      expect(
        niveis[i] - niveis[i - 1],
        `${SUPERFICIES[i]} não se separa de ${SUPERFICIES[i - 1]}`,
      ).toBeGreaterThanOrEqual(0.025);
    }
    expect(niveis.at(-1)! - niveis[0]).toBeGreaterThanOrEqual(0.12);
  });
});
