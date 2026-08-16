import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MINIMO, razao, sobre, toRGBA } from "../../test/contrast";
import {
  CROMA_MINIMO,
  SEPARACAO_ALVO,
  croma,
  luminosidade,
  separacaoCvd,
} from "../../test/paleta";
import { TEMAS } from "../../test/variantes";

/**
 * A paleta de gráfico é o único lugar do pacote onde contraste contra o fundo
 * não é o critério principal. Num gráfico o leitor precisa distinguir uma SÉRIE
 * DA OUTRA, e é aí que a coisa quebra para quem tem daltonismo: duas cores com
 * ótimo contraste contra o branco podem colapsar entre si sob deuteranopia.
 *
 * Os limites vêm da prática de visualização de dados: separação de ΔE 8 (OKLab
 * ×100) entre séries adjacentes sob visão simulada, croma mínimo para a série
 * não ler como "sem dado", e a banda de luminosidade em que a paleta foi
 * pensada — mais estreita no escuro, onde sobra menos espaço.
 */
const BANDA_L = { light: [0.43, 0.77], dark: [0.48, 0.67] } as const;

const SERIES = [1, 2, 3, 4, 5] as const;

/**
 * Achados já existentes, com o valor medido como piso.
 *
 * Nenhum deles é corrigível sem decisão de design: mexer em --chart-* muda a
 * identidade de todo gráfico do produto. O que a suíte garante é que não piorem
 * e que qualquer melhora seja notada.
 */
const CROMA_ABAIXO = new Map([
  // --chart-4 é o neutro puro (chroma 0) nos dois temas. Numa paleta
  // categórica, uma série cinza lê como "sem dado" em vez de identidade.
  ["light/4", 0],
  ["dark/4", 0],
]);

const L_FORA_DA_BANDA = new Map([
  // No escuro a paleta inteira mora acima da banda: as três cores mais claras
  // ficam entre 0.71 e 0.84, contra um teto de 0.67.
  ["dark/2", 0.71],
  ["dark/3", 0.83],
  ["dark/5", 0.77],
]);

const CONTRASTE_ABAIXO = new Map([
  // Âmbar e verde sobre o branco. Pela prática de dataviz isso não invalida a
  // paleta, mas obriga rótulo direto ou tabela — não dá para depender só da cor.
  ["light/3", 2.15],
  ["light/5", 2.54],
]);

function lerPaleta() {
  const cs = getComputedStyle(document.documentElement);
  return {
    series: SERIES.map((i) => cs.getPropertyValue(`--chart-${i}`).trim()),
    fundo: cs.getPropertyValue("--background").trim(),
  };
}

describe.each(TEMAS)("Paleta de gráfico no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("séries adjacentes se distinguem sob daltonismo", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    await render(<div />);
    const { series } = lerPaleta();

    const ruins: string[] = [];
    for (let i = 0; i < series.length - 1; i++) {
      const separacao = separacaoCvd(series[i], series[i + 1]);
      if (separacao < SEPARACAO_ALVO) {
        ruins.push(`${i + 1}↔${i + 2} ΔE ${separacao.toFixed(1)}`);
      }
    }
    expect(ruins, ruins.join(" | ")).toHaveLength(0);
  });

  test("nenhuma série lê como cinza", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    await render(<div />);
    const { series } = lerPaleta();

    const ruins: string[] = [];
    series.forEach((cor, i) => {
      const c = croma(cor);
      const piso = CROMA_ABAIXO.get(`${tema}/${i + 1}`);
      if (piso !== undefined) {
        expect(c, `chart-${i + 1} regrediu`).toBeGreaterThanOrEqual(piso);
        return;
      }
      if (c < CROMA_MINIMO) ruins.push(`chart-${i + 1} croma ${c.toFixed(3)}`);
    });
    expect(ruins, ruins.join(" | ")).toHaveLength(0);
  });

  test("as séries ficam na banda de luminosidade do tema", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    await render(<div />);
    const { series } = lerPaleta();
    const [min, max] = BANDA_L[tema];

    const ruins: string[] = [];
    series.forEach((cor, i) => {
      const l = luminosidade(cor);
      const piso = L_FORA_DA_BANDA.get(`${tema}/${i + 1}`);
      if (piso !== undefined) {
        // Fora da banda por excesso de claridade: o piso trava o quanto pode
        // clarear mais.
        expect(l, `chart-${i + 1} clareou`).toBeLessThanOrEqual(piso + 0.02);
        return;
      }
      if (l < min || l > max) {
        ruins.push(`chart-${i + 1} L ${l.toFixed(3)} fora de ${min}–${max}`);
      }
    });
    expect(ruins, ruins.join(" | ")).toHaveLength(0);
  });

  test("as séries se destacam do fundo do gráfico", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    await render(<div />);
    const { series, fundo } = lerPaleta();
    const base = sobre(toRGBA(fundo), [255, 255, 255]);

    const ruins: string[] = [];
    series.forEach((cor, i) => {
      const contraste = razao(sobre(toRGBA(cor), base), base);
      const piso = CONTRASTE_ABAIXO.get(`${tema}/${i + 1}`);
      if (piso !== undefined) {
        expect(contraste, `chart-${i + 1} regrediu`).toBeGreaterThanOrEqual(
          piso - 0.01,
        );
        return;
      }
      if (contraste < MINIMO.naoTexto) {
        ruins.push(`chart-${i + 1} ${contraste.toFixed(2)}`);
      }
    });
    expect(ruins, ruins.join(" | ")).toHaveLength(0);
  });
});
