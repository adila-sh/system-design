import type { ReactElement } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { contrasteDe, minimoDoTexto } from "./contrast";
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
   * Chaves `tema/rótulo` já abaixo do mínimo, com o valor medido como piso.
   * O rótulo é o que o teste imprime na falha — normalmente o próprio texto.
   */
  abaixoDoMinimo?: AbaixoDoMinimo;
};

/** Espera o portal montar — a abertura tem animação e não é síncrona. */
async function esperarRaiz(seletor: string): Promise<Element> {
  for (let tentativa = 0; tentativa < 40; tentativa++) {
    const el = document.querySelector(seletor);
    if (el) return el;
    await new Promise((r) => setTimeout(r, 25));
  }
  throw new Error(`raiz "${seletor}" não apareceu — o portal abriu?`);
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
  abaixoDoMinimo,
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
        const contraste = contrasteDe(el);
        const minimo = minimoDoTexto(el);
        const piso = abaixoDoMinimo?.get(`${tema}/${rotulo}`);

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
