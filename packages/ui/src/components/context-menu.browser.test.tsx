import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "./context-menu";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploContextMenu({
  defaultOpen = false,
  onEdit,
  onCheckedChange,
  onValueChange,
}: {
  defaultOpen?: boolean;
  onEdit?: () => void;
  onCheckedChange?: (checked: boolean) => void;
  onValueChange?: (value: string) => void;
}) {
  return (
    <ContextMenu defaultOpen={defaultOpen}>
      <ContextMenuTrigger className="h-20 w-60" tabIndex={0}>
        Área do arquivo
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Ações</ContextMenuLabel>
          <ContextMenuItem onClick={onEdit}>
            Editar <ContextMenuShortcut>Ctrl E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuCheckboxItem checked onCheckedChange={onCheckedChange}>
            Favorito
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value="grade" onValueChange={onValueChange}>
            <ContextMenuRadioItem value="lista">Lista</ContextMenuRadioItem>
            <ContextMenuRadioItem value="grade">Grade</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Excluir</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

descreverContrasteDosTextos({
  nome: "ContextMenu",
  montar: () => <ExemploContextMenu defaultOpen />,
  raiz: '[data-slot="context-menu-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("ContextMenu", () => {
  test("abre no evento de menu de contexto", async () => {
    const tela = await render(<ExemploContextMenu />);
    const gatilho = tela.getByText("Área do arquivo").element();

    gatilho.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 40,
        clientY: 40,
      }),
    );

    await expect.element(tela.getByRole("menu")).toBeVisible();
    await expect
      .element(tela.getByRole("menuitem", { name: /Editar/ }))
      .toBeVisible();
  });

  test("aciona item e fecha o menu", async () => {
    const editar = vi.fn();
    const tela = await render(
      <ExemploContextMenu defaultOpen onEdit={editar} />,
    );

    await tela.getByRole("menuitem", { name: /Editar/ }).click();

    expect(editar).toHaveBeenCalledTimes(1);
    await expect.element(tela.getByRole("menu")).not.toBeInTheDocument();
  });

  test("expõe e atualiza itens marcáveis", async () => {
    const marcar = vi.fn();
    const escolher = vi.fn();
    const tela = await render(
      <ExemploContextMenu
        defaultOpen
        onCheckedChange={marcar}
        onValueChange={escolher}
      />,
    );
    const favorito = tela.getByRole("menuitemcheckbox", { name: "Favorito" });
    const lista = tela.getByRole("menuitemradio", { name: "Lista" });
    const grade = tela.getByRole("menuitemradio", { name: "Grade" });

    await expect.element(favorito).toHaveAttribute("aria-checked", "true");
    await expect.element(grade).toHaveAttribute("aria-checked", "true");
    await favorito.click();
    expect(marcar).toHaveBeenCalledWith(false, expect.anything());

    await render(<ExemploContextMenu defaultOpen onValueChange={escolher} />);
    await lista.click();
    expect(escolher).toHaveBeenCalledWith("lista", expect.anything());
  });

  test("abre pelo atalho de contexto, percorre e fecha com Escape", async () => {
    const tela = await render(<ExemploContextMenu />);
    const gatilho = tela.getByText("Área do arquivo").element() as HTMLElement;

    gatilho.focus();
    await userEvent.keyboard("{Shift>}{F10}{/Shift}");

    const menu = tela.getByRole("menu");
    await expect.element(menu).toBeVisible();
    expect(document.activeElement).toBe(menu.element());

    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement?.getAttribute("role")).toMatch(/^menuitem/);

    await userEvent.keyboard("{Escape}");

    await expect.element(tela.getByRole("menu")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(gatilho);
  });
});
