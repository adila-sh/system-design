import { createRef, type ComponentProps } from "react";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { KumoTooltip, KumoTooltipProvider } from "./kumo-tooltip";

test("revela a ajuda por foco e fecha por Escape", async () => {
  const tela = await render(
    <KumoTooltipProvider delay={0}>
      <KumoTooltip
        content="Detalhes do evento"
        render={<button>Ajuda</button>}
      />
    </KumoTooltipProvider>,
  );
  const trigger = tela.getByRole("button", { name: "Ajuda" });
  await userEvent.tab();
  await expect
    .element(tela.getByRole("tooltip"))
    .toHaveTextContent("Detalhes do evento");
  expect(trigger.element().getAttribute("aria-describedby")).toBeTruthy();
  await userEvent.keyboard("{Escape}");
  await expect.element(tela.getByRole("tooltip")).not.toBeInTheDocument();
});

test("preserva ref e descrições existentes do elemento renderizado", async () => {
  const ref = createRef<HTMLButtonElement>();
  const tela = await render(
    <>
      <span id="contexto-ajuda">Contexto</span>
      <KumoTooltipProvider delay={0}>
        <KumoTooltip
          content="Ajuda adicional"
          render={
            <button ref={ref} aria-describedby="contexto-ajuda">
              Ajuda
            </button>
          }
        />
      </KumoTooltipProvider>
    </>,
  );
  const trigger = tela.getByRole("button", { name: "Ajuda" });
  expect(ref.current).toBe(trigger.element());
  await userEvent.tab();
  await expect.element(tela.getByRole("tooltip")).toBeVisible();
  expect(trigger.element().getAttribute("aria-describedby")).toContain(
    "contexto-ajuda",
  );
});

test.each(["default", "callback", "asChild"] as const)(
  "preserva composição %s",
  async (mode) => {
    const renderTrigger =
      mode === "callback"
        ? (props: ComponentProps<"button">) => <button {...props} />
        : undefined;
    const tela = await render(
      <KumoTooltipProvider delay={0}>
        <KumoTooltip
          content="Descrição"
          render={renderTrigger}
          asChild={mode === "asChild"}
        >
          {mode === "asChild" ? (
            <button>Ajuda composta</button>
          ) : (
            "Ajuda composta"
          )}
        </KumoTooltip>
      </KumoTooltipProvider>,
    );
    await userEvent.tab();
    await expect
      .element(tela.getByRole("tooltip"))
      .toHaveTextContent("Descrição");
  },
);
test("respeita o cancelamento da abertura", async () => {
  const tela = await render(
    <KumoTooltipProvider delay={0}>
      <KumoTooltip
        content="Descrição"
        onOpenChange={(_next, details) => details.cancel()}
      >
        Ajuda cancelada
      </KumoTooltip>
    </KumoTooltipProvider>,
  );
  const trigger = tela.getByRole("button", { name: "Ajuda cancelada" });
  await userEvent.tab();
  await expect.element(trigger).not.toHaveAttribute("aria-describedby");
  expect(document.querySelector('[role="tooltip"]')).toBeNull();
});
