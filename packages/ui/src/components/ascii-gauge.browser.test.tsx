import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { AsciiGauge } from "./ascii-gauge";
import {
  descreverContrasteDosTextos,
  soDecoracaoAscii,
  soGlifos,
} from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O preenchimento em braille comunica a medida como gráfico (3:1); o rótulo e
// a porcentagem continuam sendo texto (4.5:1). Moldura e trilho são decoração.
descreverContrasteDosTextos({
  nome: "AsciiGauge",
  montar: () => <AsciiGauge value={72} max={100} label="Uso de CPU" />,
  comoGrafico: soGlifos,
  ignorar: soDecoracaoAscii,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("AsciiGauge acessível", () => {
  test("limita o valor exposto e respeita o alias legado de colunas", async () => {
    const tela = await render(
      <AsciiGauge value={120} max={80} columns={12} cols={4} label="Memória" />,
    );
    const raiz = tela.container.querySelector('[data-slot="ascii-gauge"]');

    expect(raiz?.getAttribute("role")).toBe("meter");
    expect(raiz?.getAttribute("aria-label")).toBe("Memória");
    expect(raiz?.getAttribute("aria-valuemin")).toBe("0");
    expect(raiz?.getAttribute("aria-valuemax")).toBe("80");
    expect(raiz?.getAttribute("aria-valuenow")).toBe("80");
    expect(raiz?.textContent).toContain("100%");
    expect(raiz?.textContent).toContain("╭──────╮");
  });
});
