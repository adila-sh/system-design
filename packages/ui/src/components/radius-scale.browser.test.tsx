import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

/**
 * A escala tinha quatro degraus — 2/4/6/10 — e os dois do meio estavam a 2px um
 * do outro, carregando juntos 107 dos 192 usos. A escolha entre `md` e `lg` era
 * arbitrária para quem escrevia componente, e a diferença não comunicava nada.
 * Foram fundidos.
 *
 * Este teste existe porque a fusão é fácil de desfazer sem querer: `--radius-lg`
 * segue declarado (senão um `rounded-lg` esquecido cairia no default do
 * Tailwind, 8px, reintroduzindo em silêncio o degrau que saiu), e basta alguém
 * dar um valor próprio a ele para a escala voltar a ter quatro degraus.
 */
const ESPERADO = {
  "rounded-sm": "2px",
  "rounded-md": "6px",
  "rounded-lg": "6px", // alias defensivo — tem que valer o mesmo que md
  "rounded-xl": "10px",
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
