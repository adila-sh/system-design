import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./button";
import { ConfirmDialog } from "./confirm-dialog";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "ConfirmDialog destrutivo",
  montar: () => (
    <ConfirmDialog
      defaultOpen
      title="Excluir projeto?"
      description="Essa ação não poderá ser desfeita."
      confirmLabel="Excluir"
      variant="destructive"
      onConfirm={() => undefined}
    />
  ),
  raiz: '[data-slot="alert-dialog-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("ConfirmDialog", () => {
  test("abre pelo gatilho e associa título e descrição", async () => {
    const tela = await render(
      <ConfirmDialog
        trigger={<Button>Publicar</Button>}
        title="Publicar alterações?"
        description="As mudanças ficarão disponíveis."
        onConfirm={() => undefined}
      />,
    );

    await tela.getByRole("button", { name: "Publicar" }).click();
    const dialogo = tela
      .getByRole("alertdialog", {
        name: "Publicar alterações?",
      })
      .element();

    expect(dialogo.getAttribute("aria-describedby")).toBeTruthy();
    await expect
      .element(tela.getByText("As mudanças ficarão disponíveis."))
      .toBeVisible();
  });

  test("confirma, notifica o fechamento e encerra o diálogo", async () => {
    const confirmar = vi.fn();
    const aoAbrir = vi.fn();
    const tela = await render(
      <ConfirmDialog
        defaultOpen
        title="Continuar?"
        onConfirm={confirmar}
        onOpenChange={aoAbrir}
      />,
    );

    await tela.getByRole("button", { name: "Confirmar" }).click();

    expect(confirmar).toHaveBeenCalledTimes(1);
    expect(aoAbrir).toHaveBeenCalledWith(false);
    await expect
      .element(tela.getByRole("alertdialog", { name: "Continuar?" }))
      .not.toBeInTheDocument();
  });

  test("mantém o diálogo aberto e anuncia falhas", async () => {
    const tela = await render(
      <ConfirmDialog
        defaultOpen
        title="Excluir?"
        errorMessage="Falha ao excluir."
        onConfirm={() => Promise.reject(new Error("indisponível"))}
      />,
    );

    await tela.getByRole("button", { name: "Confirmar" }).click();

    await expect
      .element(tela.getByRole("alert"))
      .toHaveTextContent("Falha ao excluir.");
    await expect
      .element(tela.getByRole("alertdialog", { name: "Excluir?" }))
      .toBeVisible();
  });
});
