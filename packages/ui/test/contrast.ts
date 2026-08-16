/**
 * Medição de contraste WCAG sobre o que o navegador realmente pintou.
 *
 * Só funciona em browser mode: depende de getComputedStyle resolvendo os tokens
 * oklch pela cascata e do canvas para converter qualquer notação de cor em RGB.
 * Em jsdom, ambos falham silenciosamente.
 */

export type RGB = [number, number, number];
type RGBA = [number, number, number, number];

const AA_TEXTO = 4.5;
const AA_NAO_TEXTO = 3;
const AA_TEXTO_GRANDE = 3;

export const MINIMO = {
  texto: AA_TEXTO,
  textoGrande: AA_TEXTO_GRANDE,
  naoTexto: AA_NAO_TEXTO,
} as const;

/**
 * WCAG 1.4.3 admite 3:1 para "texto grande": 18pt (24px) em peso normal, ou
 * 14pt (18.66px) em negrito. Aplicar 4.5 a um título grande reprovaria um
 * contraste que a norma aceita, então o limite acompanha o que foi renderizado.
 */
export function minimoDoTexto(el: Element): number {
  const cs = getComputedStyle(el);
  const px = Number.parseFloat(cs.fontSize);
  const peso = Number.parseInt(cs.fontWeight, 10) || 400;
  const grande = px >= 24 || (px >= 18.66 && peso >= 700);
  return grande ? AA_TEXTO_GRANDE : AA_TEXTO;
}

let ctx: CanvasRenderingContext2D | null = null;

function contexto(): CanvasRenderingContext2D {
  if (!ctx) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const c = canvas.getContext("2d", { willReadFrequently: true });
    if (!c) throw new Error("canvas 2d indisponível — browser mode ativo?");
    ctx = c;
  }
  return ctx;
}

/** Converte qualquer cor CSS válida (oklch, color-mix, rgba…) em RGBA 0-255. */
export function toRGBA(css: string): RGBA {
  const c = contexto();
  c.clearRect(0, 0, 1, 1);
  // fillStyle inválido é ignorado e mantém o valor anterior; o preto garante
  // um estado conhecido antes de tentar a cor de verdade.
  c.fillStyle = "#000";
  c.fillStyle = css;
  c.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = c.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a / 255];
}

/** Compõe uma cor com alpha sobre um fundo opaco (source-over). */
export function sobre(frente: RGBA, fundo: RGB): RGB {
  if (frente[3] >= 1) return [frente[0], frente[1], frente[2]];
  return [0, 1, 2].map(
    (i) => frente[i] * frente[3] + fundo[i] * (1 - frente[3]),
  ) as RGB;
}

function luminancia([r, g, b]: RGB): number {
  const canal = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

export function razao(a: RGB, b: RGB): number {
  const [maior, menor] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (maior + 0.05) / (menor + 0.05);
}

/**
 * Fundo efetivo de um elemento: sobe a árvore acumulando as camadas
 * semitransparentes até encontrar a primeira opaca, depois compõe de volta.
 * É esse passo que revela defeitos como uma superfície `bg-x/50` que parece
 * clara no tema mas escurece sobre um fundo colorido.
 */
export function fundoEfetivo(el: Element): RGB {
  const camadas: RGBA[] = [];
  // Sem nenhuma superfície opaca no caminho, o que sobra é o branco do canvas
  // do navegador.
  let base: RGB = [255, 255, 255];
  let node: Element | null = el;

  while (node) {
    const bg = toRGBA(getComputedStyle(node).backgroundColor);
    if (bg[3] >= 1) {
      base = [bg[0], bg[1], bg[2]];
      break;
    }
    if (bg[3] > 0) camadas.push(bg);
    node = node.parentElement;
  }

  return camadas.reduceRight((acc, camada) => sobre(camada, acc), base);
}

/** Contraste entre o texto/ícone de um elemento e o que está pintado atrás. */
export function contrasteDe(el: Element): number {
  const fundo = fundoEfetivo(el);
  const frente = sobre(toRGBA(getComputedStyle(el).color), fundo);
  return razao(frente, fundo);
}

/** Contraste da borda de um elemento contra o fundo — WCAG 1.4.11. */
export function contrasteDaBorda(el: Element): number {
  const fundo = fundoEfetivo(el.parentElement ?? el);
  const borda = sobre(toRGBA(getComputedStyle(el).borderTopColor), fundo);
  return razao(borda, fundo);
}

/**
 * Contraste entre o preenchimento do próprio elemento e o que está atrás dele.
 *
 * É o que vale para controle sem texto — o polegar de um switch, o quadrado
 * marcado de um checkbox: medir a cor do texto ali não diz nada, porque não há
 * texto. O que precisa ser percebido é a forma contra o fundo.
 */
export function contrasteDoPreenchimento(el: Element): number {
  const atras = el.parentElement
    ? fundoEfetivo(el.parentElement)
    : ([255, 255, 255] as RGB);
  const proprio = sobre(toRGBA(getComputedStyle(el).backgroundColor), atras);
  return razao(proprio, atras);
}

/**
 * Contraste do placeholder de um campo.
 *
 * Precisa de função própria porque `::placeholder` é pseudo-elemento: não existe
 * nó de texto, então a varredura de textos passa direto por ele. É onde o
 * contraste costuma escapar, já que a cor apagada é justamente o efeito
 * pretendido.
 */
export function contrasteDoPlaceholder(el: Element): number {
  const fundo = fundoEfetivo(el);
  const cor = getComputedStyle(el, "::placeholder").color;
  return razao(sobre(toRGBA(cor), fundo), fundo);
}
