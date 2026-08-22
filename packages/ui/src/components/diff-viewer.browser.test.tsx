import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { CodeThemeProvider } from "./code-theme";
import { DiffViewer } from "./diff-viewer";

const ANTIGO = "export const total = 1;\n";
const NOVO = "export const total = 2;\n";

function obterSombra(raiz: ParentNode) {
  return raiz.querySelector("diffs-container")?.shadowRoot ?? null;
}

describe("DiffViewer", () => {
  test("renderiza o arquivo alterado dentro do web component", async () => {
    const tela = await render(
      <DiffViewer
        oldCode={ANTIGO}
        newCode={NOVO}
        filename="totais.ts"
        language="typescript"
      />,
    );
    const viewer = tela.container.querySelector('[data-slot="diff-viewer"]');

    expect(viewer).not.toBeNull();
    expect(viewer?.classList.contains("rounded-md")).toBe(true);
    await expect
      .poll(() => obterSombra(tela.container)?.textContent ?? "")
      .toContain("totais.ts");
    await expect
      .poll(() => obterSombra(tela.container)?.textContent ?? "")
      .toContain("total");
  });

  test.each(["unified", "split"] as const)(
    "propaga o layout %s para o renderizador",
    async (layout) => {
      const tela = await render(
        <DiffViewer oldCode={ANTIGO} newCode={NOVO} layout={layout} />,
      );

      await expect
        .poll(() =>
          obterSombra(tela.container)
            ?.querySelector("[data-diff-type]")
            ?.getAttribute("data-diff-type"),
        )
        .toBe(layout === "split" ? "split" : "single");
    },
  );

  test("mostra os dois nomes quando o arquivo é renomeado", async () => {
    const tela = await render(
      <CodeThemeProvider defaultTheme="github-light">
        <DiffViewer
          oldCode={ANTIGO}
          newCode={NOVO}
          oldFilename="subtotal.ts"
          filename="total.ts"
        />
      </CodeThemeProvider>,
    );

    await expect
      .poll(() => obterSombra(tela.container)?.textContent ?? "")
      .toContain("subtotal.ts");
    expect(obterSombra(tela.container)?.textContent).toContain("total.ts");
    expect(
      tela.container
        .querySelector('[data-slot="code-theme-provider"]')
        ?.getAttribute("data-code-theme-mode"),
    ).toBe("light");
  });
});
