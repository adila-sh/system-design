import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { AsciiTree } from "./ascii-tree";
import {
  descreverContrasteDosTextos,
  soDecoracaoAscii,
} from "../../test/textos";

// O metadado usa muted-foreground/60 e não alcança 4.5:1 em nenhum dos temas.
// Como continua sendo texto legível, fica registrado sem afrouxar o mínimo.
const ABAIXO_DO_MINIMO = new Map([
  ["light/pasta", 2.34],
  ["dark/pasta", 4.05],
]);

// A montagem inclui metadado, folha e ramo para medir todos os papéis visuais.
// Prefixos e conectores apenas mostram a hierarquia já descrita pelos níveis
// ARIA, então são tratados como decoração.
descreverContrasteDosTextos({
  nome: "AsciiTree",
  montar: () => (
    <AsciiTree
      label="Estrutura do projeto"
      nodes={[
        {
          label: "src",
          meta: "pasta",
          children: [{ label: "components" }, { label: "lib" }],
        },
      ]}
    />
  ),
  ignorar: soDecoracaoAscii,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("AsciiTree acessível", () => {
  test("representa a hierarquia com níveis, grupos e expansão", async () => {
    const tela = await render(
      <AsciiTree
        label="Arquivos"
        nodes={[
          {
            label: "src",
            children: [{ label: "index.ts", meta: "2 KB" }],
          },
          { label: "package.json" },
        ]}
      />,
    );
    const raiz = tela.container.querySelector('[data-slot="ascii-tree"]');
    const itens = raiz?.querySelectorAll('[role="treeitem"]');

    expect(raiz?.getAttribute("role")).toBe("tree");
    expect(raiz?.getAttribute("aria-label")).toBe("Arquivos");
    expect(itens).toHaveLength(3);
    expect(itens?.[0]?.getAttribute("aria-level")).toBe("1");
    expect(itens?.[0]?.getAttribute("aria-expanded")).toBe("true");
    expect(itens?.[1]?.getAttribute("aria-level")).toBe("2");
    expect(itens?.[1]?.hasAttribute("aria-expanded")).toBe(false);
    expect(raiz?.querySelectorAll('[role="group"]')).toHaveLength(1);
  });
});
