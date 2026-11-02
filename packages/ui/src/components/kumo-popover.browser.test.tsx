import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { KumoPopover } from "./kumo-popover";

test("associa conteúdo e devolve foco ao fechar com Escape", async () => {
  const tela = await render(
    <KumoPopover>
      <KumoPopover.Trigger>Filtros</KumoPopover.Trigger>
      <KumoPopover.Portal>
        <KumoPopover.Positioner>
          <KumoPopover.Popup>
            <KumoPopover.Title>Filtrar eventos</KumoPopover.Title>
            <KumoPopover.Description>Escolha um evento</KumoPopover.Description>
            <KumoPopover.Close>Fechar</KumoPopover.Close>
          </KumoPopover.Popup>
        </KumoPopover.Positioner>
      </KumoPopover.Portal>
    </KumoPopover>,
  );
  const trigger = tela.getByRole("button", { name: "Filtros" });
  await trigger.click();
  const popup = tela.getByRole("dialog", { name: "Filtrar eventos" });
  await expect.element(popup).toBeVisible();
  expect(popup.element().getAttribute("aria-describedby")).toBeTruthy();
  tela.getByRole("button", { name: "Fechar" }).element().focus();
  await userEvent.keyboard("{Escape}");
  await expect.element(popup).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
});
