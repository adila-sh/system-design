import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "./sidebar";

function EstadoSidebar() {
  const { isMobile, openMobile, state } = useSidebar();
  return (
    <output aria-label="Estado da sidebar">
      {isMobile ? "mobile" : "desktop"}:{state}:{String(openMobile)}
    </output>
  );
}

function ExemploSidebar({
  defaultOpen = true,
  open,
  onOpenChange,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<a href="/inicio" />}
                    isActive
                    tooltip="Início"
                  >
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="/relatorios" />}>
                    <span>Relatórios</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <EstadoSidebar />
      </SidebarInset>
    </SidebarProvider>
  );
}

function simularDesktop() {
  return vi.spyOn(window, "innerWidth", "get").mockReturnValue(1024);
}

afterEach(() => {
  vi.restoreAllMocks();
  document.cookie = "sidebar_state=; path=/; max-age=0";
});

describe("Sidebar", () => {
  test("abre a navegação móvel com a composição completa", async () => {
    const tela = await render(<ExemploSidebar />);
    await expect
      .element(tela.getByRole("status", { name: "Estado da sidebar" }))
      .toHaveTextContent("mobile:expanded:false");

    await tela.getByRole("button", { name: "Toggle Sidebar" }).click();

    await expect
      .element(tela.getByRole("dialog", { name: "Sidebar" }))
      .toBeVisible();
    const inicio = tela.getByRole("link", { name: "Início" }).element();
    expect(inicio.getAttribute("href")).toBe("/inicio");
    expect(inicio.getAttribute("data-active")).not.toBeNull();
  });

  test("atalho Ctrl+B alterna o drawer móvel", async () => {
    const tela = await render(<ExemploSidebar />);
    await expect
      .element(tela.getByRole("status", { name: "Estado da sidebar" }))
      .toHaveTextContent("mobile:expanded:false");

    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "b", ctrlKey: true, bubbles: true }),
    );

    await expect
      .element(tela.getByRole("dialog", { name: "Sidebar" }))
      .toBeVisible();
  });

  test("no desktop, o gatilho recolhe e persiste o estado", async () => {
    simularDesktop();
    const tela = await render(<ExemploSidebar />);
    await expect
      .element(tela.getByRole("status", { name: "Estado da sidebar" }))
      .toHaveTextContent("desktop:expanded:false");

    await tela.getByRole("button", { name: "Toggle Sidebar" }).first().click();

    await expect
      .element(tela.getByRole("status", { name: "Estado da sidebar" }))
      .toHaveTextContent("desktop:collapsed:false");
    expect(
      tela.container
        .querySelector('[data-slot="sidebar"]')
        ?.getAttribute("data-state"),
    ).toBe("collapsed");
    expect(document.cookie).toContain("sidebar_state=false");
  });

  test("respeita estado desktop controlado", async () => {
    simularDesktop();
    const aoMudar = vi.fn();
    const tela = await render(<ExemploSidebar open onOpenChange={aoMudar} />);
    await expect
      .element(tela.getByRole("status", { name: "Estado da sidebar" }))
      .toHaveTextContent("desktop:expanded:false");

    await tela.getByRole("button", { name: "Toggle Sidebar" }).first().click();

    expect(aoMudar).toHaveBeenCalledWith(false);
    expect(
      tela.container
        .querySelector('[data-slot="sidebar"]')
        ?.getAttribute("data-state"),
    ).toBe("expanded");
  });

  test("a área principal mantém semântica e destinos da aplicação", async () => {
    simularDesktop();
    const tela = await render(<ExemploSidebar defaultOpen={false} />);
    await expect
      .element(tela.getByRole("status", { name: "Estado da sidebar" }))
      .toHaveTextContent("desktop:collapsed:false");

    expect(
      tela.container.querySelector('[data-slot="sidebar-inset"]')?.tagName,
    ).toBe("MAIN");
    expect(
      tela.container
        .querySelector('[data-slot="sidebar-menu-button"][href="/relatorios"]')
        ?.getAttribute("href"),
    ).toBe("/relatorios");
  });
});
