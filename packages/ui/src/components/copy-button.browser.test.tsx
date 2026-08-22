import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { CopyButton } from "./copy-button";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "CopyButton",
  montar: () => <CopyButton value="bun add @adila-sh/ui" />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("CopyButton", () => {
  afterEach(() => vi.restoreAllMocks());

  test("copia o valor, notifica o consumidor e informa o sucesso", async () => {
    const escrever = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    const aoCopiar = vi.fn();
    const tela = await render(
      <CopyButton value="chave-123" onCopy={aoCopiar} />,
    );

    await tela.getByRole("button", { name: "Copiar" }).click();

    expect(escrever).toHaveBeenCalledWith("chave-123");
    expect(aoCopiar).toHaveBeenCalledWith("chave-123");
    await expect
      .element(tela.getByRole("button", { name: "Copiado" }))
      .toBeVisible();
  });

  test("restaura o rótulo depois do atraso configurado", async () => {
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    const tela = await render(
      <CopyButton value="texto" resetDelay={1000} copiedLabel="Pronto" />,
    );

    await tela.getByRole("button", { name: "Copiar" }).click();
    await expect
      .element(tela.getByRole("button", { name: "Pronto" }))
      .toBeVisible();
    await new Promise((resolve) => window.setTimeout(resolve, 1050));
    await expect
      .element(tela.getByRole("button", { name: "Copiar" }))
      .toBeVisible();
  });
});
