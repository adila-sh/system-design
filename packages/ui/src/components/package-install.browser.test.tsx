import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { PackageInstall } from "./package-install";
import { descreverContrasteDosTextos } from "../../test/textos";

const COMANDOS = {
  npm: "npm install @adila-sh/ui",
  pnpm: "pnpm add @adila-sh/ui",
  bun: "bun add @adila-sh/ui",
} as const;

// `--code-muted` pinta as abas inativas e o texto visualmente recortado do
// CopyButton. Sobre `--code-bg`, o par mede 2.76:1 nos dois temas (o tema de
// código é deliberadamente fixo), abaixo dos 4.5:1 exigidos para texto pequeno.
const ABAIXO_DO_MINIMO = new Map([
  ["light/npm", 2.76],
  ["light/bun", 2.76],
  ["light/Copiar", 2.76],
  ["dark/npm", 2.76],
  ["dark/bun", 2.76],
  ["dark/Copiar", 2.76],
]);

descreverContrasteDosTextos({
  nome: "PackageInstall",
  montar: () => <PackageInstall commands={COMANDOS} defaultManager="pnpm" />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("PackageInstall", () => {
  test("usa o primeiro gerenciador disponível quando o padrão não existe", async () => {
    const tela = await render(
      <PackageInstall commands={{ bun: "bun add @adila-sh/ui" }} />,
    );

    await expect
      .element(tela.getByRole("tab", { name: "bun" }))
      .toHaveAttribute("aria-selected", "true");
    await expect
      .element(tela.getByRole("tabpanel"))
      .toHaveTextContent("bun add @adila-sh/ui");
  });

  test("troca o comando no modo não controlado", async () => {
    const tela = await render(<PackageInstall commands={COMANDOS} />);

    await tela.getByRole("tab", { name: "pnpm" }).click();

    await expect
      .element(tela.getByRole("tab", { name: "pnpm" }))
      .toHaveAttribute("aria-selected", "true");
    await expect
      .element(tela.getByRole("tabpanel"))
      .toHaveTextContent("pnpm add @adila-sh/ui");
  });

  test("notifica a escolha sem substituir o valor controlado", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <PackageInstall
        commands={COMANDOS}
        manager="npm"
        onManagerChange={aoMudar}
      />,
    );

    await tela.getByRole("tab", { name: "bun" }).click();

    expect(aoMudar).toHaveBeenCalledWith("bun");
    await expect
      .element(tela.getByRole("tab", { name: "npm", exact: true }))
      .toHaveAttribute("aria-selected", "true");
    await expect
      .element(tela.getByRole("tabpanel"))
      .toHaveTextContent("npm install @adila-sh/ui");
  });
});
