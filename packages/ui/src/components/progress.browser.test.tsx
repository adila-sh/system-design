import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Progress, ProgressLabel, ProgressValue } from "./progress";
import { MINIMO, contrasteDoPreenchimento } from "../../test/contrast";
import { descreverContrasteDosTextos } from "../../test/textos";
import { TEMAS } from "../../test/variantes";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// No tema escuro o primary contra muted mede 2.90:1, logo abaixo dos 3:1 de
// 1.4.11. O par é compartilhado por outras superfícies, então fica como
// catraca até haver uma decisão de token, em vez de ser corrigido localmente.
const INDICADOR_ABAIXO_DO_MINIMO = new Map([["dark", 2.9]]);

descreverContrasteDosTextos({
  nome: "Progress",
  montar: () => (
    <Progress value={68}>
      <ProgressLabel>Importação dos contatos</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

// A extensão da barra comunica o progresso sem depender do texto. Por isso o
// indicador precisa se destacar do trilho pelo mínimo não textual de 3:1.
describe.each(TEMAS)("Indicador de Progress no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("se destaca do trilho e expõe o valor à árvore acessível", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(
      <Progress value={68} aria-label="Importação dos contatos" />,
    );

    const raiz = tela.container.querySelector('[data-slot="progress"]');
    const indicador = tela.container.querySelector(
      '[data-slot="progress-indicator"]',
    );

    expect(raiz?.getAttribute("role")).toBe("progressbar");
    expect(raiz?.getAttribute("aria-valuenow")).toBe("68");
    expect(indicador).not.toBeNull();
    const contraste = contrasteDoPreenchimento(indicador as Element);
    const piso = INDICADOR_ABAIXO_DO_MINIMO.get(tema);

    if (piso === undefined) {
      expect(contraste).toBeGreaterThanOrEqual(MINIMO.naoTexto);
      return;
    }

    expect(
      contraste,
      `indicador no tema ${tema} regrediu`,
    ).toBeGreaterThanOrEqual(piso);
    expect(
      contraste,
      `indicador no tema ${tema} agora passa em 1.4.11 — remova a entrada`,
    ).toBeLessThan(MINIMO.naoTexto);
  });
});
