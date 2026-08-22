import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./button";
import { MINIMO, contrasteDe } from "../../test/contrast";
import { TEMAS, descreverContrasteDeTexto } from "../../test/variantes";

const VARIANTES = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

/**
 * Lista vazia — e o caminho até aqui explica por que os tokens de tinta existem.
 *
 * No tema claro bastou baixar a luminosidade de --destructive e --success,
 * porque lá existe uma faixa de L que satisfaz as duas restrições ao mesmo
 * tempo: texto colorido sobre a própria tinta E foreground branco sobre o
 * preenchimento sólido.
 *
 * No escuro essa faixa é VAZIA: a tinta é a cor sobre um fundo escuro, então as
 * duas restrições puxam em sentidos opostos. A saída foi separar os papéis em
 * --x-tint (superfície) e --x-tint-foreground (texto sobre ela), cada um livre
 * para atender à própria restrição.
 *
 * O `destructive` daqui usa --destructive-tint-strong, o nível de 20% que este
 * componente sempre teve, e o `link` usa --primary-tint-foreground mesmo sem
 * tinta nenhuma atrás: sobre o fundo da página, o que importa é ser a cor de
 * acento legível como texto, que é exatamente o que esse token guarda.
 */
const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "Button",
  variantes: VARIANTES,
  montar: (variant) => <Button variant={variant}>Salvar alterações</Button>,
  seletor: "button",
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

/**
 * O botão desabilitado é o caso que mais mudou quando a medição passou a
 * considerar `opacity`.
 *
 * Antes ele media 6.33 — igual ao ativo —, porque `getComputedStyle().color`
 * ignora o `opacity` do elemento e a versão anterior desta suíte parava a busca
 * de fundo no primeiro fundo sólido, mesmo que ele próprio estivesse desbotado.
 * Com `disabled:opacity-50`, o preenchimento E o texto desbotam juntos sobre a
 * página, e a razão entre eles comprime para 1.56.
 *
 * A WCAG 1.4.3 isenta componente inativo, então isto não é violação. Fica
 * registrado como piso porque é o número real, e porque um botão desabilitado
 * que ninguém enxerga é um problema de produto mesmo sem ser de norma.
 *
 * E os dois temas se comportam de forma OPOSTA, o que só apareceu ao medir: no
 * claro o indigo desbotado some contra o branco (1.56); no escuro ele desbota
 * PARA um tom médio sobre o quase-preto, e o branco por cima continua legível
 * (4.06). Só o tema claro precisa de piso.
 */
const DESABILITADO_ABAIXO = new Map([["light", 1.56]]);

describe.each(TEMAS)("Button desabilitado no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("mantém o contraste medido do estado inativo", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(<Button disabled>Salvar alterações</Button>);

    const contraste = contrasteDe(tela.getByRole("button").element());
    const piso = DESABILITADO_ABAIXO.get(tema);

    if (piso === undefined) {
      expect(contraste).toBeGreaterThanOrEqual(MINIMO.naoTexto);
      return;
    }
    expect(contraste).toBeGreaterThanOrEqual(piso - 0.05);
    expect(
      contraste,
      `o desabilitado no tema ${tema} passou do mínimo — remova a entrada`,
    ).toBeLessThan(MINIMO.naoTexto);
  });
});

/**
 * Cada `size` de texto tem um `icon-*` de mesma altura — é o que permite pôr um
 * botão de ícone ao lado de um de texto sem degrau.
 *
 * Os dois degraus de baixo sempre bateram; `default`/`icon` e `lg`/`icon-lg`
 * não, e ficavam 8px e 12px fora. Como a regra já valia para metade da escala,
 * era bug, não decisão — e este teste é o que impede a divergência de voltar,
 * já que ela é invisível em qualquer página que não coloque os dois lado a lado.
 */
const PARES_DE_ALTURA = [
  ["xs", "icon-xs"],
  ["sm", "icon-sm"],
  ["default", "icon"],
  ["lg", "icon-lg"],
] as const;

describe("Button: altura do ícone acompanha a do texto", () => {
  test.each(PARES_DE_ALTURA)(
    "size=%s e size=%s têm a mesma altura",
    async (texto, icone) => {
      const tela = await render(
        <>
          <Button size={texto}>Salvar</Button>
          <Button size={icone} aria-label="Salvar">
            <svg />
          </Button>
        </>,
      );

      const [alturaTexto, alturaIcone] = Array.from(
        tela.container.querySelectorAll("button"),
        (botao) => botao.getBoundingClientRect().height,
      );

      expect(alturaIcone).toBe(alturaTexto);
    },
  );
});
