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

      expect(contrasteDaBorda(el as Element)).toBeGreaterThanOrEqual(
        MINIMO.naoTexto,
      );
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
