import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { AsciiHeatmap } from "./ascii-heatmap";
import {
  descreverContrasteDosTextos,
  soDecoracaoAscii,
  soGlifos,
} from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// As células formam uma rampa de intensidade: os passos mais fracos são baixos
// por definição e a informação equivalente está no resumo acessível. Aqui a
// catraca de texto se aplica ao rótulo visível, não a cada célula gráfica.
descreverContrasteDosTextos({
  nome: "AsciiHeatmap",
  montar: () => (
    <AsciiHeatmap
      values={[
        [0, 2, 5, 9],
        [3, 7, 1, 8],
      ]}
      label="Atividade semanal"
    />
  ),
  comoGrafico: soGlifos,
  ignorar: (rotulo) => soDecoracaoAscii(rotulo) || soGlifos(rotulo),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("AsciiHeatmap acessível", () => {
  test("resume dimensões e extremos considerando apenas valores finitos", async () => {
    const tela = await render(
      <AsciiHeatmap
        values={[
          [Number.NaN, 2],
          [8, Number.POSITIVE_INFINITY],
        ]}
        label="Carga"
      />,
    );
    const raiz = tela.container.querySelector('[data-slot="ascii-heatmap"]');

    expect(raiz?.getAttribute("role")).toBe("img");
    expect(raiz?.getAttribute("aria-label")).toBe(
      "Carga: 2 linhas, mínimo 2, máximo 8",
    );
    expect(raiz?.querySelectorAll('[aria-hidden="true"] span')).toHaveLength(4);
  });
});
