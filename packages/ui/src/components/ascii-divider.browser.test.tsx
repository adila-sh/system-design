import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { AsciiDivider } from "./ascii-divider";
import {
  descreverContrasteDosTextos,
  soDecoracaoAscii,
} from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O glifo repetido só desenha a linha. O rótulo é o único conteúdo legível e
// continua sujeito ao mínimo de texto nos dois temas.
descreverContrasteDosTextos({
  nome: "AsciiDivider",
  montar: () => <AsciiDivider label="Resultados recentes" />,
  ignorar: soDecoracaoAscii,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("AsciiDivider semântico", () => {
  test("usa somente o primeiro glifo e mantém a linha fora da árvore acessível", async () => {
    const tela = await render(
      <AsciiDivider label="Próxima seção" character="=-" />,
    );
    const raiz = tela.container.querySelector('[data-slot="ascii-divider"]');
    const decoracao = raiz?.querySelectorAll('[aria-hidden="true"]');

    expect(raiz?.getAttribute("role")).toBe("separator");
    expect(raiz?.getAttribute("aria-label")).toBe("Próxima seção");
    expect(decoracao).toHaveLength(2);
    expect(decoracao?.[0]?.textContent).toBe("==");
    expect(decoracao?.[1]?.textContent).not.toContain("-");
  });
});
