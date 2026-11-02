import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { KumoDialog } from "./kumo-dialog";

test("abre, associa título e descrição e fecha pelo teclado", async () => {
  const tela = await render(
    <KumoDialog.Root>
      <KumoDialog.Trigger>Abrir</KumoDialog.Trigger>
      <KumoDialog>
        <KumoDialog.Title>Detalhes da entrega</KumoDialog.Title>
        <KumoDialog.Description>Histórico do webhook</KumoDialog.Description>
        <KumoDialog.Close>Fechar</KumoDialog.Close>
      </KumoDialog>
    </KumoDialog.Root>,
  );
  const gatilho = tela.getByRole("button", { name: "Abrir" });
  await gatilho.click();
  const dialogo = tela.getByRole("dialog", { name: "Detalhes da entrega" });
  await expect.element(dialogo).toBeVisible();
  expect(dialogo.element().getAttribute("aria-describedby")).toBeTruthy();
  await tela.getByRole("button", { name: "Fechar" }).element().focus();
  await userEvent.keyboard("{Escape}");
  await expect.element(dialogo).not.toBeInTheDocument();
  await expect.element(gatilho).toHaveFocus();
});
