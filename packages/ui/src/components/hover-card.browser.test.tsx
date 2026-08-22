import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

function ExemploHoverCard({
  defaultOpen = false,
  onOpenChange,
}: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <HoverCard
      defaultOpen={defaultOpen}
      defaultTriggerId="perfil-adila"
      onOpenChange={onOpenChange}
    >
      <HoverCardTrigger
        id="perfil-adila"
        href="/adila"
        delay={0}
        closeDelay={0}
      >
        @adila.co
      </HoverCardTrigger>
      <HoverCardContent side="top" align="start">
        <p className="font-medium">adila.co</p>
        <p className="text-muted-foreground">Design system brasileiro.</p>
      </HoverCardContent>
    </HoverCard>
  );
}

descreverContrasteDosTextos({
  nome: "HoverCard",
  montar: () => <ExemploHoverCard defaultOpen />,
  raiz: '[data-slot="hover-card-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("HoverCard", () => {
  test("abre ao passar o ponteiro e preserva o vínculo do gatilho", async () => {
    const aoAbrir = vi.fn();
    const tela = await render(<ExemploHoverCard onOpenChange={aoAbrir} />);
    const gatilho = tela.getByRole("link", { name: "@adila.co" });

    expect(gatilho.element().getAttribute("href")).toBe("/adila");
    await userEvent.hover(gatilho);

    await expect
      .element(tela.getByText("Design system brasileiro."))
      .toBeVisible();
    expect(aoAbrir).toHaveBeenCalledWith(true, expect.anything());
    expect(
      document
        .querySelector('[data-slot="hover-card-content"]')
        ?.getAttribute("data-side"),
    ).toBe("bottom");
  });

  test("fecha quando o ponteiro deixa o gatilho e o conteúdo", async () => {
    const aoAbrir = vi.fn();
    const tela = await render(<ExemploHoverCard onOpenChange={aoAbrir} />);
    const gatilho = tela.getByRole("link", { name: "@adila.co" });

    await userEvent.hover(gatilho);
    await expect
      .element(tela.getByText("Design system brasileiro."))
      .toBeVisible();
    await userEvent.unhover(gatilho);

    await expect
      .element(tela.getByText("Design system brasileiro."))
      .not.toBeInTheDocument();
    expect(aoAbrir).toHaveBeenLastCalledWith(false, expect.anything());
  });
});
