import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./menubar";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploMenubar({
  defaultOpen = false,
  onNew,
  onCheckedChange,
}: {
  defaultOpen?: boolean;
  onNew?: () => void;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <Menubar aria-label="Menu do editor">
      <MenubarMenu defaultOpen={defaultOpen}>
        <MenubarTrigger>Arquivo</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onNew}>
            Novo <MenubarShortcut>Ctrl N</MenubarShortcut>
          </MenubarItem>
          <MenubarCheckboxItem checked onCheckedChange={onCheckedChange}>
            Salvamento automático
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Sair</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Exibir</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup defaultValue="compacto">
            <MenubarRadioItem value="compacto">Compacto</MenubarRadioItem>
            <MenubarRadioItem value="confortavel">Confortável</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

descreverContrasteDosTextos({
  nome: "Menubar",
  montar: () => <ExemploMenubar defaultOpen />,
  raiz: '[data-slot="menubar-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Menubar", () => {
  test("expõe barra nomeada e abre menu pelo gatilho", async () => {
    const tela = await render(<ExemploMenubar />);
    const barra = tela.getByRole("menubar", { name: "Menu do editor" });
    const arquivo = tela.getByRole("menuitem", { name: "Arquivo" });

    await expect.element(barra).toBeVisible();
    await expect.element(arquivo).toHaveAttribute("aria-expanded", "false");
    await arquivo.click();
    await expect.element(arquivo).toHaveAttribute("aria-expanded", "true");
    await expect.element(tela.getByRole("menu")).toBeVisible();
  });

  test("aciona item comum e fecha o conteúdo", async () => {
    const novo = vi.fn();
    const tela = await render(<ExemploMenubar defaultOpen onNew={novo} />);

    await tela.getByRole("menuitem", { name: /Novo/ }).click();

    expect(novo).toHaveBeenCalledTimes(1);
    await expect.element(tela.getByRole("menu")).not.toBeInTheDocument();
  });

  test("expõe estado do item marcável e propaga alteração", async () => {
    const alterar = vi.fn();
    const tela = await render(
      <ExemploMenubar defaultOpen onCheckedChange={alterar} />,
    );
    const item = tela.getByRole("menuitemcheckbox", {
      name: "Salvamento automático",
    });

    await expect.element(item).toHaveAttribute("aria-checked", "true");
    await item.click();
    expect(alterar).toHaveBeenCalledWith(false, expect.anything());
  });

  test("abre, percorre e fecha o menu pelo teclado", async () => {
    const tela = await render(<ExemploMenubar />);
    const arquivo = tela.getByRole("menuitem", { name: "Arquivo" });

    arquivo.element().focus();
    await userEvent.keyboard("{Enter}");

    await expect.element(tela.getByRole("menu")).toBeVisible();
    await expect.element(arquivo).toHaveAttribute("aria-expanded", "true");
    expect(document.activeElement).toBe(
      tela.getByRole("menuitem", { name: /Novo/ }).element(),
    );

    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(
      tela
        .getByRole("menuitemcheckbox", {
          name: "Salvamento automático",
        })
        .element(),
    );

    await userEvent.keyboard("{Escape}");
    await expect.element(tela.getByRole("menu")).not.toBeInTheDocument();
    await expect.element(arquivo).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(arquivo.element());
  });
});
