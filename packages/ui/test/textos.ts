import type { ReactElement } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  MINIMO,
  contrasteDe,
  estaDesabilitado,
  minimoDoTexto,
} from "./contrast";
import { TEMAS, type AbaixoDoMinimo } from "./variantes";

type Opcoes = {
  /** Nome do componente, usado na descrição do bloco. */
  nome: string;
  montar: () => ReactElement;
  /**
   * Seletor da raiz a medir, procurado no `document`. Necessário para menus,
   * selects e diálogos: o conteúdo aberto vai para um portal FORA do container
   * do render, então medir o container encontraria só o gatilho.
   * Omitido, mede o próprio container.
   */
  raiz?: string;
  /**
   * Decide, por alvo, se ele vale como GRÁFICO — mínimo de 3:1 da WCAG 1.4.11 —
   * em vez de texto, que pede 4.5:1.
   *
   * É por alvo, e não por componente, porque nos ASCII os dois convivem no mesmo
   * bloco: `▇`, `⣿` e `░▒▓` desenham uma série e valem como gráfico, enquanto o
   * rótulo e os números ao lado são texto de verdade e seguem em 4.5. Uma chave
   * única para o componente inteiro afrouxaria também o texto.
   */
  comoGrafico?: (rotulo: string) => boolean;
  /**
   * Rótulos a ignorar. Serve para o que é decoração ou fundo: a moldura de um
   * medidor e a parte vazia de uma barra não carregam informação — quem informa
   * é a extensão do preenchimento, que é medida.
   */
  ignorar?: (rotulo: string) => boolean;
  /**
   * Chaves `tema/rótulo` já abaixo do mínimo, com o valor medido como piso.
   * O rótulo é o que o teste imprime na falha — normalmente o próprio texto.
   */
  abaixoDoMinimo?: AbaixoDoMinimo;
  /**
   * Piso único para TODOS os alvos desabilitados do bloco, por tema.
   *
   * Existe porque um componente pode ter dezenas de alvos inativos com o mesmo
   * valor — os dias bloqueados de um calendário, por exemplo. Listar cada um em
   * `abaixoDoMinimo` seria quarenta entradas dizendo a mesma coisa.
   */
  pisoDesabilitado?: Partial<Record<(typeof TEMAS)[number], number>>;
};

/**
 * Moldura de caixa e braille em branco: são o contorno e o trilho vazio dos
 * componentes ASCII. Não comunicam estado — o preenchimento é que comunica.
 */
const DECORACAO_ASCII = /^[─-╿⠀\s]+$/;

export const soDecoracaoAscii = (rotulo: string) =>
  DECORACAO_ASCII.test(rotulo);

/**
 * Rótulo sem nenhuma letra ou dígito: só glifos. É o critério para tratar o
 * alvo como gráfico — "▁▂▄▇" e "↑" desenham, "Receita" e "72%" leem.
 */
export const soGlifos = (rotulo: string) => !/[\p{L}\p{N}]/u.test(rotulo);

/**
 * Espera o portal montar E a animação de entrada terminar.
 *
 * Só esperar o elemento existir não basta desde que a medição passou a
 * considerar `opacity`: menus, popovers e tooltips entram com fade, e medir no
 * meio dele produz números baixos que parecem defeito de cor mas são só o
 * quadro errado. O critério de pronto é a opacidade acumulada chegar a 1.
 */
async function esperarRaiz(seletor: string): Promise<Element> {
  let el: Element | null = null;

  for (let tentativa = 0; tentativa < 40; tentativa++) {
    el = document.querySelector(seletor);
    if (el) break;
    await new Promise((r) => setTimeout(r, 25));
  }
  if (!el) throw new Error(`raiz "${seletor}" não apareceu — o portal abriu?`);

  const opacidadeAte = (node: Element | null) => {
    let total = 1;
    while (node) {
      total *= Number.parseFloat(getComputedStyle(node).opacity) || 1;
      node = node.parentElement;
    }
    return total;
  };

  for (let tentativa = 0; tentativa < 60; tentativa++) {
    if (opacidadeAte(el) >= 0.999) return el;
    await new Promise((r) => setTimeout(r, 25));
  }
  throw new Error(
    `raiz "${seletor}" não chegou a opacidade 1 — animação de entrada travou?`,
  );
}

type Alvo = { el: Element; rotulo: string };

/**
 * Elementos que pintam texto próprio: têm ao menos um nó de texto direto e não
 * apenas filhos. Medir o ancestral em vez da folha erraria o alvo, porque a cor
 * pode ser redefinida em qualquer nível.
 */
function alvosDeTexto(raiz: Element): Alvo[] {
  const alvos: Alvo[] = [];

  const visitar = (el: Element) => {
    const proprio = [...el.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent ?? "")
      .join("")
      .trim();

    const caixa = el.getBoundingClientRect();
    const visivel =
      caixa.width > 0 &&
      caixa.height > 0 &&
      getComputedStyle(el).visibility !== "hidden";

    if (proprio.length > 0 && visivel) {
      alvos.push({ el, rotulo: proprio.slice(0, 28) });
    }
    for (const filho of el.children) visitar(filho);
  };

  visitar(raiz);
  return alvos;
}

/**
 * Mede TODO texto visível dentro de um componente, nos dois temas, aplicando o
 * mínimo de WCAG conforme tamanho e peso da fonte.
 *
 * Complementa `descreverContrasteDeTexto`, que percorre variantes medindo um
 * seletor só: aqui a varredura é por dentro, e é o que pega defeitos em
 * sub-elementos — foi assim que a descrição do Alert apareceu, medindo pior que
 * o título por ter alpha próprio.
 */
export function descreverContrasteDosTextos({
  nome,
  montar,
  raiz,
  comoGrafico,
  ignorar,
  abaixoDoMinimo,
  pisoDesabilitado,
}: Opcoes) {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  describe.each(TEMAS)(`${nome} no tema %s`, (tema) => {
    test("todo texto visível atinge o mínimo de contraste", async () => {
      document.documentElement.classList.toggle("dark", tema === "dark");

      const tela = await render(montar());
      const onde = raiz ? await esperarRaiz(raiz) : tela.container;
      const alvos = alvosDeTexto(onde);
      expect(
        alvos.length,
        "nenhum texto encontrado para medir",
      ).toBeGreaterThan(0);

      const falhas: string[] = [];
      for (const { el, rotulo } of alvos) {
        if (ignorar?.(rotulo)) continue;

        const contraste = contrasteDe(el);
        const inativo = estaDesabilitado(el);
        const minimo = inativo
          ? MINIMO.desabilitado
          : comoGrafico?.(rotulo)
            ? MINIMO.naoTexto
            : minimoDoTexto(el);

        // O piso por bloco vale só para inativos, e só quando declarado.
        const pisoInativo = inativo ? pisoDesabilitado?.[tema] : undefined;
        const piso = abaixoDoMinimo?.get(`${tema}/${rotulo}`) ?? pisoInativo;

        if (piso !== undefined) {
          expect(
            contraste,
            `${tema}/${rotulo} regrediu`,
          ).toBeGreaterThanOrEqual(piso);
          expect(
            contraste,
            `${tema}/${rotulo} agora passa em AA — remova a entrada de abaixoDoMinimo`,
          ).toBeLessThan(minimo);
          continue;
        }

        if (contraste < minimo) {
          falhas.push(`"${rotulo}" ${contraste.toFixed(2)} < ${minimo}`);
        }
      }

      expect(falhas, falhas.join(" | ")).toHaveLength(0);
    });
  });
}
