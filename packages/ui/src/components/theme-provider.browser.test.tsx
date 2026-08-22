import { beforeEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { ThemeProvider, useTheme } from "./theme-provider";

const STORAGE_KEY = "adila-ui-theme-test";

function ThemeProbe() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  return (
    <div>
      <output aria-label="Tema selecionado">{theme}</output>
      <output aria-label="Tema resolvido">{resolvedTheme}</output>
      <button type="button" onClick={() => setTheme("dark")}>
        Usar escuro
      </button>
    </div>
  );
}

function limparTema() {
  localStorage.removeItem(STORAGE_KEY);
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.removeAttribute("data-mode");
  document.documentElement.style.removeProperty("color-scheme");
}

describe("ThemeProvider", () => {
  beforeEach(limparTema);

  test("usa os defaults do design system", async () => {
    const tela = await render(
      <ThemeProvider storageKey={STORAGE_KEY}>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await expect
      .element(tela.getByLabelText("Tema selecionado"))
      .toHaveTextContent("system");

    const resolvido = tela
      .getByLabelText("Tema resolvido")
      .element().textContent;
    expect(["light", "dark"]).toContain(resolvido);
    await expect
      .poll(() => document.documentElement.classList.contains(resolvido!))
      .toBe(true);
  });

  test("o hook troca, aplica e persiste o tema", async () => {
    const tela = await render(
      <ThemeProvider defaultTheme="light" storageKey={STORAGE_KEY}>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await tela.getByRole("button", { name: "Usar escuro" }).click();

    await expect
      .element(tela.getByLabelText("Tema selecionado"))
      .toHaveTextContent("dark");
    await expect
      .poll(() => document.documentElement.classList.contains("dark"))
      .toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  test("permite sobrescrever os defaults do provider", async () => {
    await render(
      <ThemeProvider
        attribute="data-mode"
        defaultTheme="claro"
        enableSystem={false}
        storageKey={STORAGE_KEY}
        themes={["claro", "escuro"]}
        value={{ claro: "light", escuro: "dark" }}
      >
        <ThemeProbe />
      </ThemeProvider>,
    );

    await expect
      .poll(() => document.documentElement.getAttribute("data-mode"))
      .toBe("light");
  });
});
