import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { CodeBlock } from "./code-block";
import { CodeThemeProvider } from "./code-theme";

/**
 * As superfícies de código liam `var(--code-fg, #c0caf5)` — com o Tokyo Night
 * repetido como fallback em 41 lugares, em três arquivos, sem nada sincronizando
 * essas cópias com a definição real em code-theme.tsx.
 *
 * Agora o padrão vive uma vez só, no :root de code-theme.css, e o provider
 * sobrescreve na própria div quando existe. Os fallbacks sumiram, e é
 * exatamente por isso que este teste precisa existir: sem eles, um `--code-fg`
 * que deixe de ser declarado não vira "cor errada", vira cor herdada — passa
 * despercebido em qualquer teste de contraste.
 */
function corDoCodigo(container: Element) {
  const el = container.querySelector('[data-slot="code-block"]') as Element;
  return getComputedStyle(el).getPropertyValue("--code-fg").trim();
}

describe("Tokens de tema de código", () => {
  test("solto, sem provider, usa o padrão Tokyo Night", async () => {
    const tela = await render(<CodeBlock code="const a = 1;" lang="ts" />);

    expect(corDoCodigo(tela.container)).toBe("#c0caf5");
  });

  test("dentro de um provider, usa o tema do provider", async () => {
    const tela = await render(
      <CodeThemeProvider theme="dracula">
        <CodeBlock code="const a = 1;" lang="ts" />
      </CodeThemeProvider>,
    );

    expect(corDoCodigo(tela.container)).toBe("#f8f8f2");
  });

  test("os semáforos do Terminal têm cor própria", async () => {
    const raiz = getComputedStyle(document.documentElement);

    const semaforos = [
      raiz.getPropertyValue("--terminal-dot-close").trim(),
      raiz.getPropertyValue("--terminal-dot-minimize").trim(),
      raiz.getPropertyValue("--terminal-dot-maximize").trim(),
    ];

    expect(semaforos.filter(Boolean)).toHaveLength(3);
    expect(new Set(semaforos).size).toBe(3);
  });
});
