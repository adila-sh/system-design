import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { CodeThemeProvider, codeThemes, useCodeTheme } from "./code-theme";

function TemaAtual() {
  const { theme, definition, setTheme } = useCodeTheme();

  return (
    <>
      <output aria-label="Tema atual">{theme}</output>
      <span>{definition.label}</span>
      <button type="button" onClick={() => setTheme("dracula")}>
        Usar Dracula
      </button>
    </>
  );
}

describe("CodeTheme", () => {
  test("cataloga três temas claros e três escuros", () => {
    const definicoes = Object.values(codeThemes);

    expect(definicoes).toHaveLength(6);
    expect(definicoes.filter(({ mode }) => mode === "light")).toHaveLength(3);
    expect(definicoes.filter(({ mode }) => mode === "dark")).toHaveLength(3);
    for (const [nome, definicao] of Object.entries(codeThemes)) {
      expect(definicao.shikiTheme).toBe(nome);
      expect(definicao.label.length).toBeGreaterThan(0);
    }
  });

  test("usa Tokyo Night como fallback fora do provider", async () => {
    const tela = await render(<TemaAtual />);

    await expect
      .element(tela.getByRole("status", { name: "Tema atual" }))
      .toHaveTextContent("tokyo-night");
    await tela.getByRole("button", { name: "Usar Dracula" }).click();
    await expect
      .element(tela.getByRole("status", { name: "Tema atual" }))
      .toHaveTextContent("tokyo-night");
  });

  test("altera tema não controlado e publica modo e tokens", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <CodeThemeProvider defaultTheme="github-light" onThemeChange={aoMudar}>
        <TemaAtual />
      </CodeThemeProvider>,
    );
    const provider = tela.container.querySelector(
      '[data-slot="code-theme-provider"]',
    )!;

    expect(provider.getAttribute("data-code-theme")).toBe("github-light");
    expect(provider.getAttribute("data-code-theme-mode")).toBe("light");
    expect(getComputedStyle(provider).getPropertyValue("--code-bg")).toBe(
      "#ffffff",
    );

    await tela.getByRole("button", { name: "Usar Dracula" }).click();

    expect(aoMudar).toHaveBeenCalledWith("dracula");
    expect(provider.getAttribute("data-code-theme")).toBe("dracula");
    expect(provider.getAttribute("data-code-theme-mode")).toBe("dark");
    expect(getComputedStyle(provider).getPropertyValue("--code-bg")).toBe(
      "#282a36",
    );
  });

  test("notifica sem mudar internamente quando controlado", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <CodeThemeProvider theme="min-light" onThemeChange={aoMudar}>
        <TemaAtual />
      </CodeThemeProvider>,
    );

    await tela.getByRole("button", { name: "Usar Dracula" }).click();

    expect(aoMudar).toHaveBeenCalledWith("dracula");
    expect(
      tela.container
        .querySelector('[data-slot="code-theme-provider"]')
        ?.getAttribute("data-code-theme"),
    ).toBe("min-light");
  });
});
