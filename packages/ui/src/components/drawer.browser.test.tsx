import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploDrawer({
  defaultOpen = false,
  onOpenChange,
  swipeDirection = "down",
}: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  swipeDirection?: "down" | "up" | "left" | "right";
}) {
  return (
    <Drawer
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      showSwipeHandle
      swipeDirection={swipeDirection}
    >
      <DrawerTrigger render={<Button>Abrir detalhes</Button>} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Detalhes do plano</DrawerTitle>
          <DrawerDescription>
            Revise as condições selecionadas.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Fechar</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

descreverContrasteDosTextos({
  nome: "Drawer",
  montar: () => <ExemploDrawer defaultOpen />,
  raiz: '[data-slot="drawer-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Drawer", () => {
  test("abre como diálogo modal com título, descrição e overlay", async () => {
    const tela = await render(<ExemploDrawer />);

    await tela.getByRole("button", { name: "Abrir detalhes" }).click();

    const dialogo = tela.getByRole("dialog", { name: "Detalhes do plano" });
    await expect.element(dialogo).toBeVisible();
    expect(dialogo.element().getAttribute("aria-describedby")).toBeTruthy();
    expect(
      document.querySelector('[data-slot="drawer-overlay"]'),
    ).not.toBeNull();
    expect(
      document
        .querySelector('[data-slot="drawer-swipe-handle"]')
        ?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  test("fecha pelo controle dedicado e notifica o consumidor", async () => {
    const aoAbrir = vi.fn();
    const tela = await render(
      <ExemploDrawer defaultOpen onOpenChange={aoAbrir} />,
    );

    await tela.getByRole("button", { name: "Fechar" }).click();

    expect(aoAbrir).toHaveBeenCalledWith(false, expect.anything());
    await expect
      .element(tela.getByRole("dialog", { name: "Detalhes do plano" }))
      .not.toBeInTheDocument();
  });

  test.each([
    ["down", "y"],
    ["up", "y"],
    ["left", "x"],
    ["right", "x"],
  ] as const)("swipeDirection=%s usa o eixo %s", async (direction, axis) => {
    await render(<ExemploDrawer defaultOpen swipeDirection={direction} />);
    const popup = document.querySelector('[data-slot="drawer-popup"]')!;

    expect(popup.getAttribute("data-swipe-direction")).toBe(direction);
    expect(popup.getAttribute("data-swipe-axis")).toBe(axis);
  });
});
