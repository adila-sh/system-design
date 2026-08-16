import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Checkbox } from "./checkbox";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Switch } from "./switch";
import {
  MINIMO,
  contrasteDaBorda,
  contrasteDoPreenchimento,
} from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

/**
 * Controles sem texto: quem precisa ser percebido é a própria forma. WCAG 1.4.11
 * pede 3:1 para o limite do componente, então o alvo aqui é a BORDA no estado
 * desmarcado e o preenchimento no marcado — não há rótulo para medir.
 */
/**
 * A borda do controle desmarcado vem de `--input`, e não chega perto do mínimo
 * de 3:1 em nenhum dos temas. Não é defeito de um componente: é o token, e ele
 * desenha a borda de TODO campo do sistema — input, textarea, select, checkbox,
 * radio. Escurecê-lo é decisão de design com efeito visível em toda interface,
 * então fica registrado com o valor medido em vez de corrigido por conta.
 */
const BORDA_ABAIXO_DO_MINIMO = new Map([
  ["light", 1.23],
  ["dark", 1.56],
]);

const DESMARCADOS = [
  {
    nome: "Checkbox",
    montar: () => <Checkbox />,
    seletor: '[data-slot="checkbox"]',
  },
  {
    nome: "RadioGroupItem",
    montar: () => (
      <RadioGroup>
        <RadioGroupItem value="a" />
      </RadioGroup>
    ),
    seletor: '[data-slot="radio-group-item"]',
  },
] as const;

describe.each(TEMAS)("Controles de seleção no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test.each(DESMARCADOS)(
    "a borda do $nome desmarcado é perceptível",
    async ({ montar, seletor }) => {
      document.documentElement.classList.toggle("dark", tema === "dark");
      const tela = await render(montar());
      const el = tela.container.querySelector(seletor);
      expect(el, `nada casou ${seletor}`).not.toBeNull();

      const contraste = contrasteDaBorda(el as Element);
      const piso = BORDA_ABAIXO_DO_MINIMO.get(tema);

      if (piso === undefined) {
        expect(contraste).toBeGreaterThanOrEqual(MINIMO.naoTexto);
        return;
      }
      expect(contraste).toBeGreaterThanOrEqual(piso);
      expect(
        contraste,
        `borda no tema ${tema} agora passa em 1.4.11 — remova a entrada`,
      ).toBeLessThan(MINIMO.naoTexto);
    },
  );

  test("o Checkbox marcado se destaca do fundo da página", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(<Checkbox defaultChecked />);
    const el = tela.container.querySelector('[data-slot="checkbox"]');
    // Marcado, o quadrado ganha preenchimento próprio (--primary). O que precisa
    // ser percebido é esse preenchimento contra a página, não a cor do texto:
    // não há texto num checkbox.
    expect(contrasteDoPreenchimento(el as Element)).toBeGreaterThanOrEqual(
      MINIMO.naoTexto,
    );
  });

  test("o Switch ligado distingue o polegar do trilho", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(<Switch defaultChecked />);
    const polegar = tela.container.querySelector('[data-slot="switch-thumb"]');
    expect(polegar, "polegar não encontrado").not.toBeNull();
    // O polegar está DENTRO do trilho, então o fundo efetivo dele já é o trilho:
    // este é o par que informa o estado ligado.
    expect(contrasteDoPreenchimento(polegar as Element)).toBeGreaterThanOrEqual(
      MINIMO.naoTexto,
    );
  });
});
