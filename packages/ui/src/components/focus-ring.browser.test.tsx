import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Switch } from "./switch";
import { Textarea } from "./textarea";
import { Toggle } from "./toggle";

/**
 * O foco é o contrato de acessibilidade mais visível do sistema, e era o menos
 * consistente: seis espessuras de anel em uso (ring-0, 1, 2, 3, outline-1 e
 * nenhuma), metade delas sem o alpha — `ring-ring` cheio em vez de
 * `ring-ring/50`. A espessura mudava conforme o componente que o usuário
 * tabulava.
 *
 * Nada disso aparecia em teste porque cada suíte olha um componente por vez, e
 * um anel de 2px é perfeitamente plausível quando você não tem o de 3px ao
 * lado. Este teste existe para pôr os focáveis lado a lado.
 *
 * Ele NÃO foca os elementos de verdade, e isso foi uma correção: a primeira
 * versão chamava `.focus()` e lia o box-shadow computado, mas `:focus-visible`
 * depende da heurística do navegador sobre a última interação ter sido de
 * teclado. Rodando sozinho passava; dentro da suíte, depois de qualquer teste
 * que clica, o pseudo-seletor não casava e o teste falhava sem nada estar
 * errado. Aqui a afirmação é sobre o contrato — todo focável usa a MESMA
 * utilitária — mais a forma dessa utilitária, lida da folha de estilo.
 */
const FOCAVEIS = [
  ["Button", <Button key="b">Salvar</Button>],
  ["Input", <Input key="i" aria-label="Nome" />],
  ["Textarea", <Textarea key="t" aria-label="Notas" />],
  ["Checkbox", <Checkbox key="c" aria-label="Aceito" />],
  ["Switch", <Switch key="s" aria-label="Ativo" />],
  ["Toggle", <Toggle key="g" aria-label="Negrito" />],
] as const;

const FOCAVEL = "button, input, textarea, select, [tabindex]";
const UTILITARIAS = ["focus-ring", "focus-ring-inset", "focus-ring-within"];

/**
 * As regras não ficam no topo da folha: o Tailwind v4 emite tudo dentro de
 * `@layer utilities`, e o fallback de alto contraste dentro de um `@media`
 * aninhado nessa camada. Sem descer nos grupos, `cssRules` devolve só as
 * camadas e a busca não acha nada.
 */
function* todasAsRegras(): Generator<CSSRule> {
  const pilha: CSSRule[] = [];

  for (const folha of Array.from(document.styleSheets)) {
    try {
      pilha.push(...Array.from(folha.cssRules));
    } catch {
      continue; // folha de outra origem
    }
  }

  while (pilha.length > 0) {
    const regra = pilha.pop()!;
    yield regra;
    if ("cssRules" in regra) {
      pilha.push(...Array.from((regra as CSSGroupingRule).cssRules));
    }
  }
}

/** Todo cssText que mencione o seletor, em qualquer nível de aninhamento. */
function textoDasRegras(trecho: string) {
  const textos: string[] = [];
  for (const regra of todasAsRegras()) {
    if (regra.cssText.includes(trecho)) textos.push(regra.cssText);
  }
  return textos;
}

function regraDe(seletor: string) {
  for (const regra of todasAsRegras()) {
    if (regra instanceof CSSStyleRule && regra.selectorText === seletor) {
      return regra;
    }
  }
  return null;
}

describe("Anel de foco", () => {
  test("todo focável usa a mesma utilitária de foco", async () => {
    const semUtilitaria: string[] = [];

    for (const [nome, elemento] of FOCAVEIS) {
      const tela = await render(elemento);
      const alvo = tela.container.querySelector(FOCAVEL);

      if (!alvo) throw new Error(`${nome} não renderizou elemento focável`);
      if (!UTILITARIAS.some((u) => alvo.classList.contains(u))) {
        semUtilitaria.push(`${nome} (${alvo.className})`);
      }
    }

    expect(
      semUtilitaria,
      `focáveis com anel próprio em vez da utilitária:\n${semUtilitaria.join("\n")}`,
    ).toHaveLength(0);
  });

  test("a utilitária desenha 3px e pede o --ring com alpha", () => {
    const regra = regraDe(".focus-ring:focus-visible");

    expect(
      regra,
      "a utilitária focus-ring não chegou na folha de estilo",
    ).not.toBeNull();
    expect(regra!.style.getPropertyValue("--tw-ring-shadow")).toContain("3px");

    // A cor sai em duas declarações: a de baixo é o --ring cheio, e o
    // color-mix a 50% vem num @supports por cima. Afirmar sobre a regra base
    // sozinha diria que o anel é opaco, o que é verdade só onde color-mix não
    // existe. O que interessa é que a versão com alpha exista.
    const comAlpha = textoDasRegras(".focus-ring:focus-visible").some(
      (texto) =>
        texto.includes("--tw-ring-color") && texto.includes("color-mix"),
    );

    expect(comAlpha, "o anel de foco não tem versão com alpha").toBe(true);
  });

  /*
   * Não há aqui um teste do fallback de forced-colors, e é de propósito.
   * Escrevi um, e ele passava por acidente: `cssText` de uma regra de grupo
   * traz tudo que está aninhado dentro, então procurar "forced-colors" numa
   * regra que menciona `focus-ring` casava com o `@layer utilities` inteiro —
   * incluindo uma regra do recharts que nada tem a ver. Quebrar a media query
   * de propósito não fazia o teste falhar.
   *
   * O fallback existe e está conferido no CSS compilado:
   *   @media (forced-colors:active){.focus-ring:focus-visible{outline:2px solid}}
   * Guardá-lo pede inspecionar o dist/style.css, que é outro tipo de teste.
   */
});
