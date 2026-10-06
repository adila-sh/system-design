import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

/**
 * A escala separa detalhes (8px), controles (12px) e painéis (20px).
 * md e lg continuam sendo aliases para não introduzir um degrau implícito
 * nos componentes existentes. O teste mede o CSS publicado no Chromium.
 */
const ESPERADO = {
  "rounded-sm": "8px",
  "rounded-md": "12px",
  "rounded-lg": "12px", // alias defensivo — tem que valer o mesmo que md
  "rounded-xl": "20px",
} as const;

describe("Escala de raio", () => {
  test("os degraus valem o que a escala define", async () => {
    const classes = Object.keys(ESPERADO) as (keyof typeof ESPERADO)[];
    const tela = await render(
      <div>
        {classes.map((c) => (
          <div className={`${c} size-20`} data-raio={c} key={c} />
        ))}
      </div>,
    );

    const medido = Object.fromEntries(
      classes.map((c) => [
        c,
        getComputedStyle(tela.container.querySelector(`[data-raio="${c}"]`)!)
          .borderTopLeftRadius,
      ]),
    );

    expect(medido).toEqual(ESPERADO);
  });

  test("md e lg são o mesmo degrau", async () => {
    const tela = await render(
      <div>
        <div className="rounded-md size-20" data-raio="md" />
        <div className="rounded-lg size-20" data-raio="lg" />
      </div>,
    );

    const raio = (nome: string) =>
      getComputedStyle(tela.container.querySelector(`[data-raio="${nome}"]`)!)
        .borderTopLeftRadius;

    expect(
      raio("lg"),
      "`lg` voltou a ter valor próprio — a escala tem quatro degraus de novo",
    ).toBe(raio("md"));
  });
});
