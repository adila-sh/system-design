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
  /**
   * A WCAG 1.4.3 isenta explicitamente componente inativo ("Incidental: texto
   * que faz parte de um componente de interface inativo não tem requisito de
   * contraste"). Ainda assim medimos, com o piso de não-texto: isento não é
   * licença para o estado desaparecer da tela.
   */
  desabilitado: AA_NAO_TEXTO,
} as const;

/**
 * Estado inativo, em qualquer das formas que o pacote usa: o atributo nativo,
 * o ARIA e o data-attribute do Base UI.
 */
export function estaDesabilitado(el: Element): boolean {
  return !!el.closest(
    "[disabled],[aria-disabled='true'],[data-disabled],[data-disabled='true']",
  );
}

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
/**
 * Sobe a árvore compondo as camadas de fundo até a primeira REALMENTE opaca.
 *
 * "Realmente" opaca exige as duas coisas: cor sem alpha E `opacity: 1`. Um
 * elemento com `opacity: 0.5` e fundo sólido não encerra a busca — ele desbota
 * junto com tudo que está dentro, e o que aparece por baixo continua contando.
 * É o caso do botão desabilitado: fundo sólido, mas metade transparente.
 */
function fundoEfetivoCom(el: Element): { cor: RGB; ate: Element | null } {
  const camadas: RGBA[] = [];
  // Sem nenhuma superfície opaca no caminho, o que sobra é o branco do canvas
  // do navegador.
  let base: RGB = [255, 255, 255];
  let ate: Element | null = null;
  let node: Element | null = el;

  while (node) {
    const cs = getComputedStyle(node);
    const opacidade = Number.parseFloat(cs.opacity) || 1;
    const bg = toRGBA(cs.backgroundColor);
    const alpha = bg[3] * opacidade;

    if (alpha >= 1) {
      base = [bg[0], bg[1], bg[2]];
      ate = node;
      break;
    }
    if (alpha > 0) camadas.push([bg[0], bg[1], bg[2], alpha]);
    node = node.parentElement;
  }

  return {
    cor: camadas.reduceRight((acc, camada) => sobre(camada, acc), base),
    ate,
  };
}

export function fundoEfetivo(el: Element): RGB {
  return fundoEfetivoCom(el).cor;
}

/**
 * Opacidade acumulada de um elemento até o ancestral opaco, inclusive.
 *
 * `opacity` compõe o elemento inteiro sobre o que está atrás e NÃO aparece na
 * cor computada: um texto com `disabled:opacity-50` devolve a mesma `color` de
 * quando está ativo. Sem multiplicar por isto, todo estado desabilitado do
 * pacote seria medido como se estivesse em plena força.
 */
function opacidadeAcumulada(el: Element, ate: Element | null): number {
  let total = 1;
  let node: Element | null = el;
  while (node) {
    total *= Number.parseFloat(getComputedStyle(node).opacity) || 1;
    if (node === ate) break;
    node = node.parentElement;
  }
  return total;
}

/** Contraste entre o texto/ícone de um elemento e o que está pintado atrás. */
export function contrasteDe(el: Element): number {
  const { cor: fundo, ate } = fundoEfetivoCom(el);
  const cor = toRGBA(getComputedStyle(el).color);
  const alpha = cor[3] * opacidadeAcumulada(el, ate);
  return razao(sobre([cor[0], cor[1], cor[2], alpha], fundo), fundo);
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
