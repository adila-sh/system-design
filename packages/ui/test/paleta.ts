/**
 * Verificação da paleta categórica dos gráficos.
 *
 * Contraste contra o fundo não basta aqui: num gráfico o leitor precisa
 * distinguir uma SÉRIE DA OUTRA, e é isso que quebra para quem tem daltonismo —
 * duas cores com ótimo contraste contra o branco podem colapsar entre si sob
 * deuteranopia. Este módulo mede a separação entre séries adjacentes com a
 * visão simulada.
 *
 * Método: ΔE em OKLab (×100) entre as cores depois de passar pela simulação de
 * protanopia e deuteranopia, tomando o pior dos dois. As matrizes são as
 * publicadas para simulação em espaço LMS.
 */

import { toRGBA } from "./contrast";

/** Alvo de separação entre séries adjacentes, em ΔE OKLab ×100. */
export const SEPARACAO_ALVO = 8;

/** Croma mínimo: abaixo disso a série lê como cinza, ou seja, como "sem dado". */
export const CROMA_MINIMO = 0.03;

type Triplo = [number, number, number];

const MATRIZ_CVD: Record<"protan" | "deutan", number[][]> = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
};

const paraLinear = (v: number) => {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

function paraOklab([r, g, b]: Triplo): Triplo {
  const [lr, lg, lb] = [paraLinear(r), paraLinear(g), paraLinear(b)];
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function simular(rgb: Triplo, tipo: "protan" | "deutan"): Triplo {
  const m = MATRIZ_CVD[tipo];
  const lin = rgb.map(paraLinear);
  const fora = m.map(
    (linha) => linha[0] * lin[0] + linha[1] * lin[1] + linha[2] * lin[2],
  );
  return fora.map((v) => {
    const c = Math.max(0, Math.min(1, v));
    const s = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
    return s * 255;
  }) as Triplo;
}

const rgbDe = (css: string): Triplo => {
  const [r, g, b] = toRGBA(css);
  return [r, g, b];
};

/** Croma OKLCH de uma cor — a distância do eixo neutro. */
export function croma(css: string): number {
  const [, a, b] = paraOklab(rgbDe(css));
  return Math.hypot(a, b);
}

/** Luminosidade OKLCH (o L do OKLab). */
export function luminosidade(css: string): number {
  return paraOklab(rgbDe(css))[0];
}

/**
 * Separação entre duas cores sob visão simulada, em ΔE OKLab ×100. Toma o pior
 * caso entre protanopia e deuteranopia, que é o critério que importa: basta uma
 * das duas colapsar para o gráfico ficar ilegível para aquele leitor.
 */
export function separacaoCvd(corA: string, corB: string): number {
  const distancias = (["protan", "deutan"] as const).map((tipo) => {
    const a = paraOklab(simular(rgbDe(corA), tipo));
    const b = paraOklab(simular(rgbDe(corB), tipo));
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) * 100;
  });
  return Math.min(...distancias);
}
