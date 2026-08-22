import { WarningIcon } from "@phosphor-icons/react";
import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploAlertDialog({
  defaultOpen = false,
  onOpenChange,
  onAction,
  size = "default",
}: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: () => void;
  size?: "default" | "sm";
}) {
  return (
    <AlertDialog defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger render={<Button>Excluir conta</Button>} />
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <WarningIcon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Excluir conta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onAction}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

descreverContrasteDosTextos({
  nome: "AlertDialog",
  montar: () => <ExemploAlertDialog defaultOpen />,
  raiz: '[data-slot="alert-dialog-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("AlertDialog", () => {
  test("abre como alertdialog nomeado e descrito", async () => {
    const tela = await render(<ExemploAlertDialog />);

    await tela.getByRole("button", { name: "Excluir conta" }).click();
    const dialogo = tela.getByRole("alertdialog", { name: "Excluir conta?" });

    await expect.element(dialogo).toBeVisible();
    expect(dialogo.element().getAttribute("aria-describedby")).toBeTruthy();
    expect(
      document.querySelector('[data-slot="alert-dialog-overlay"]'),
    ).not.toBeNull();
  });

  test("cancela, fecha e notifica a mudança de estado", async () => {
    const aoAbrir = vi.fn();
    const tela = await render(
      <ExemploAlertDialog defaultOpen onOpenChange={aoAbrir} />,
    );

    await tela.getByRole("button", { name: "Cancelar" }).click();

    expect(aoAbrir).toHaveBeenCalledWith(false, expect.anything());
    await expect
      .element(tela.getByRole("alertdialog", { name: "Excluir conta?" }))
      .not.toBeInTheDocument();
  });

  test("propaga a ação destrutiva", async () => {
    const aoExcluir = vi.fn();
    const tela = await render(
      <ExemploAlertDialog defaultOpen onAction={aoExcluir} />,
    );

    await tela.getByRole("button", { name: "Excluir" }).click();

    expect(aoExcluir).toHaveBeenCalledTimes(1);
  });

  test.each([
    ["default", "flex"],
    ["sm", "grid"],
  ] as const)("size=%s define o layout do rodapé", async (size, display) => {
    await render(<ExemploAlertDialog defaultOpen size={size} />);
    const conteudo = document.querySelector(
      '[data-slot="alert-dialog-content"]',
    )!;
    const rodape = document.querySelector('[data-slot="alert-dialog-footer"]')!;

    expect(conteudo.getAttribute("data-size")).toBe(size);
    expect(getComputedStyle(rodape).display).toBe(display);
  });
});
