import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DateRangePicker, type DateRange } from "./date-range-picker";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();
const PERIODO: DateRange = {
  from: new Date(2026, 6, 1),
  to: new Date(2026, 6, 18),
};

descreverContrasteDosTextos({
  nome: "DateRangePicker",
  montar: () => <DateRangePicker defaultValue={PERIODO} clearable />,
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("DateRangePicker", () => {
  test("formata o intervalo em português", async () => {
    const tela = await render(<DateRangePicker defaultValue={PERIODO} />);

    await expect
      .element(tela.getByRole("button", { name: "01 jul 2026 – 18 jul 2026" }))
      .toBeVisible();
  });

  test("limpa valor não controlado, restaura placeholder e notifica", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <DateRangePicker
        defaultValue={PERIODO}
        clearable
        placeholder="Escolha as datas"
        onValueChange={aoMudar}
      />,
    );

    await tela.getByRole("button", { name: "Limpar período" }).click();

    expect(aoMudar).toHaveBeenCalledWith(undefined);
    await expect
      .element(tela.getByRole("button", { name: "Escolha as datas" }))
      .toBeVisible();
    expect(
      tela.container.querySelector('button[aria-label="Limpar período"]'),
    ).toBeNull();
  });

  test("notifica sem alterar sozinho quando controlado", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <DateRangePicker value={PERIODO} clearable onValueChange={aoMudar} />,
    );

    await tela.getByRole("button", { name: "Limpar período" }).click();

    expect(aoMudar).toHaveBeenCalledWith(undefined);
    await expect
      .element(tela.getByRole("button", { name: "01 jul 2026 – 18 jul 2026" }))
      .toBeVisible();
  });

  test("desabilita o gatilho e omite limpeza", async () => {
    const tela = await render(
      <DateRangePicker value={PERIODO} clearable disabled />,
    );

    await expect
      .element(tela.getByRole("button", { name: "01 jul 2026 – 18 jul 2026" }))
      .toBeDisabled();
    expect(
      tela.container.querySelector('button[aria-label="Limpar período"]'),
    ).toBeNull();
  });

  test("abre calendário com a quantidade configurada de meses", async () => {
    const tela = await render(
      <DateRangePicker defaultValue={PERIODO} numberOfMonths={1} />,
    );

    await tela
      .getByRole("button", { name: "01 jul 2026 – 18 jul 2026" })
      .click();

    const calendario = document.querySelector(
      '[data-slot="calendar"]',
    ) as HTMLElement;
    await expect.element(calendario).toBeVisible();
    expect(calendario.querySelectorAll(".rdp-month")).toHaveLength(1);
    expect(
      document.querySelector('[data-slot="popover-content"]'),
    ).not.toBeNull();
  });
});
