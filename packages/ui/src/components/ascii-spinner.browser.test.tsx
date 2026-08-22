import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { AsciiSpinner } from "./ascii-spinner";
import { descreverContrasteDosTextos, soGlifos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O quadro braille é a forma do indicador e vale como gráfico; o status ao lado
// é texto comum e precisa manter 4.5:1.
descreverContrasteDosTextos({
  nome: "AsciiSpinner",
  montar: () => <AsciiSpinner label="Processando arquivos" />,
  comoGrafico: soGlifos,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("AsciiSpinner acessível", () => {
  test("anuncia o rótulo como status sem expor o quadro animado", async () => {
    const tela = await render(<AsciiSpinner label="Salvando alterações" />);
    const raiz = tela.container.querySelector('[data-slot="ascii-spinner"]');
    const quadro = raiz?.querySelector('[aria-hidden="true"]');

    expect(raiz?.getAttribute("role")).toBe("status");
    expect(raiz?.getAttribute("aria-live")).toBe("polite");
    expect(quadro).not.toBeNull();
    expect(quadro?.textContent).toMatch(/^(?:⠋|⠙|⠹|⠸|⠼|⠴|⠦|⠧|⠇|⠏)$/);
    expect(raiz?.textContent).toContain("Salvando alterações");
  });
});
