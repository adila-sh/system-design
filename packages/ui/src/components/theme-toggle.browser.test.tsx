import { beforeEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

const STORAGE_KEY = "adila-ui-theme-toggle-test";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.classList.remove("light", "dark");
  });

  test("abre o menu e troca o tema pelo hook compartilhado", async () => {
    const tela = await render(
      <ThemeProvider
        defaultTheme="light"
        enableSystem={false}
        storageKey={STORAGE_KEY}
      >
        <ThemeToggle />
      </ThemeProvider>,
    );

    await tela.getByRole("button", { name: "Alternar tema" }).click();
    await expect
      .element(tela.getByRole("menuitemradio", { name: "Escuro" }))
      .toBeVisible();
    await tela.getByRole("menuitemradio", { name: "Escuro" }).click();

    await expect
      .poll(() => document.documentElement.classList.contains("dark"))
      .toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  test("permite customizar os textos públicos", async () => {
    const tela = await render(
      <ThemeProvider storageKey={STORAGE_KEY}>
        <ThemeToggle
          triggerLabel="Escolher aparência"
          labels={{ light: "Dia", dark: "Noite", system: "Automático" }}
        />
      </ThemeProvider>,
    );

    await tela.getByRole("button", { name: "Escolher aparência" }).click();
    await expect
      .element(tela.getByRole("menuitemradio", { name: "Dia" }))
      .toBeVisible();
    await expect
      .element(tela.getByRole("menuitemradio", { name: "Noite" }))
      .toBeVisible();
    await expect
      .element(tela.getByRole("menuitemradio", { name: "Automático" }))
      .toBeVisible();
  });
});
