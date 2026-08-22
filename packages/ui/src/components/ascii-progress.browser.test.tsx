import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { AsciiProgress } from "./ascii-progress";
import {
  descreverContrasteDosTextos,
  soDecoracaoAscii,
  soGlifos,
} from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// A extensão do preenchimento é informação gráfica; rótulo e porcentagem são
// texto. O braille vazio só funciona como trilho e não entra na medição.
descreverContrasteDosTextos({
  nome: "AsciiProgress",
  montar: () => <AsciiProgress value={40} max={100} label="Importando" />,
  comoGrafico: soGlifos,
  ignorar: soDecoracaoAscii,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("AsciiProgress acessível", () => {
  test("limita valores negativos e permite ocultar a porcentagem visual", async () => {
    const tela = await render(
      <AsciiProgress
        value={-12}
        max={200}
        label="Sincronização"
        showPercent={false}
      />,
    );
    const raiz = tela.container.querySelector('[data-slot="ascii-progress"]');

    expect(raiz?.getAttribute("role")).toBe("progressbar");
    expect(raiz?.getAttribute("aria-label")).toBe("Sincronização");
    expect(raiz?.getAttribute("aria-valuemin")).toBe("0");
    expect(raiz?.getAttribute("aria-valuemax")).toBe("200");
    expect(raiz?.getAttribute("aria-valuenow")).toBe("0");
    expect(raiz?.textContent).not.toContain("%");
  });
});
