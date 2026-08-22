import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { CodeBlock } from "./code-block";
import { CodeThemeProvider } from "./code-theme";
import { MINIMO, contrasteDe } from "../../test/contrast";

const CODIGO = `const total = soma(2);
// resultado calculado`;

function ExemploCodeBlock(
  props: Partial<React.ComponentProps<typeof CodeBlock>> = {},
) {
  return (
    <CodeThemeProvider defaultTheme="tokyo-night">
      <CodeBlock
        code={CODIGO}
        language="typescript"
        filename="app.ts"
        {...props}
      />
    </CodeThemeProvider>
  );
}

describe("CodeBlock", () => {
  afterEach(() => vi.restoreAllMocks());

  test("expõe figura, legenda, linguagem e área de código focalizável", async () => {
    const tela = await render(<ExemploCodeBlock />);
    const figura = tela.container.querySelector('[data-slot="code-block"]')!;
    const pre = figura.querySelector("pre")!;
    const code = figura.querySelector("code")!;

    expect(figura.tagName).toBe("FIGURE");
    expect(figura.querySelector("figcaption")?.textContent).toContain("app.ts");
    expect(figura.querySelector("figcaption")?.textContent).toContain(
      "typescript",
    );
    expect(pre.tabIndex).toBe(0);
    expect(code.getAttribute("data-language")).toBe("typescript");
    expect(contrasteDe(pre)).toBeGreaterThanOrEqual(MINIMO.texto);
  });

  test("numera linhas, remove apenas a quebra final e destaca as indicadas", async () => {
    const tela = await render(
      <ExemploCodeBlock
        code={"primeira\n\nterceira\n"}
        showLineNumbers
        highlightLines={[2, 3]}
      />,
    );
    const linhas = tela.container.querySelectorAll(
      '[data-slot="code-block-line"]',
    );

    expect(linhas).toHaveLength(3);
    expect(
      Array.from(linhas, (linha) => linha.getAttribute("data-highlighted")),
    ).toEqual([null, "true", "true"]);
    expect(
      Array.from(
        linhas,
        (linha) => linha.querySelector('[aria-hidden="true"]')?.textContent,
      ),
    ).toEqual(["1", "2", "3"]);
  });

  test.each([
    [
      "typescript",
      "const nome = 'Ada'; // pessoa",
      ["keyword", "string", "comment"],
    ],
    ["json", '{"ativo": true, "total": 2}', ["string", "keyword", "number"]],
    ["shell", "export PORT=3000 # porta", ["keyword", "number", "comment"]],
    [
      "css",
      "@media (min-width: 10px) { color: '#fff'; }",
      ["keyword", "number", "function", "string"],
    ],
    ["html", '<strong title="x">Olá</strong>', ["tag"]],
  ] as const)("tokeniza language=%s", async (language, code, kinds) => {
    const tela = await render(
      <CodeThemeProvider>
        <CodeBlock code={code} language={language} hideHeader />
      </CodeThemeProvider>,
    );
    const encontrados = new Set(
      Array.from(tela.container.querySelectorAll("[data-token]"), (token) =>
        token.getAttribute("data-token"),
      ),
    );

    for (const kind of kinds) expect(encontrados.has(kind)).toBe(true);
  });

  test("copia o código integral mesmo com cabeçalho oculto", async () => {
    const copiar = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    const tela = await render(<ExemploCodeBlock hideHeader />);

    expect(tela.container.querySelector("figcaption")).toBeNull();
    await tela.getByRole("button", { name: "Copiar código" }).click();
    expect(copiar).toHaveBeenCalledWith(CODIGO);
  });
});
