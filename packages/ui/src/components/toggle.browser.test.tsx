import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Toggle } from "./toggle";
import { MINIMO, contrasteDe } from "../../test/contrast";
import { TEMAS, descreverContrasteDeTexto } from "../../test/variantes";

const VARIANTES = ["default", "outline"] as const;

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "Toggle",
  variantes: VARIANTES,
  montar: (variant) => <Toggle variant={variant}>Negrito</Toggle>,
  seletor: '[data-slot="toggle"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

// O estado ligado é o que traz superfície própria (aria-pressed:bg-muted): o
// texto deixa de estar sobre o fundo da página e passa a estar sobre o muted.
// É a transição onde o contraste muda sem a classe de cor do texto mudar.
describe.each(TEMAS)("Toggle ligado no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test.each(VARIANTES)("variant=%s permanece legível", async (variant) => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(
      <Toggle variant={variant} defaultPressed>
        Negrito
      </Toggle>,
    );

    const alvo = tela.container.querySelector('[data-slot="toggle"]');
    expect(alvo?.getAttribute("aria-pressed")).toBe("true");
    expect(contrasteDe(alvo as Element)).toBeGreaterThanOrEqual(MINIMO.texto);
  });
});
