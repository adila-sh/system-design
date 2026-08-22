import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { AsciiBadge } from "./ascii-badge";
import { descreverContrasteDeTexto } from "../../test/variantes";

// Os componentes ASCII desenham o estado com CARACTERE, não com forma: o símbolo
// é texto de verdade, então vale o mínimo de texto e não o de gráfico. É também
// por isso que medi-los importa — um símbolo apagado não tem borda nem
// preenchimento que ajude a percebê-lo.
const VARIANTES = [
  "default",
  "success",
  "warning",
  "destructive",
  "error",
  "info",
] as const;

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "AsciiBadge",
  variantes: VARIANTES,
  montar: (variant) => <AsciiBadge variant={variant} label="PRONTO" />,
  seletor: '[data-slot="ascii-badge"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

/**
 * Contraste sozinho não pega variante morta: a `info` apontava para `text-info`,
 * um token que nunca existiu, então a classe não gerava regra e a cor era
 * simplesmente herdada. Passava no contraste — herdar o foreground dá contraste
 * ótimo — enquanto não comunicava estado nenhum.
 *
 * Este teste afirma o que o de contraste não vê: cada variante semântica pinta
 * uma cor DIFERENTE da neutra.
 */
describe("AsciiBadge distingue as variantes", () => {
  test("nenhuma variante semântica repete a cor da default", async () => {
    const cor = async (variant: (typeof VARIANTES)[number]) => {
      const tela = await render(
        <AsciiBadge variant={variant} label="PRONTO" />,
      );
      const el = tela.container.querySelector('[data-slot="ascii-badge"]');
      return getComputedStyle(el as Element).color;
    };

    const neutra = await cor("default");
    const semanticas = ["success", "warning", "destructive", "info"] as const;

    const repetidas: string[] = [];
    for (const variant of semanticas) {
      if ((await cor(variant)) === neutra) repetidas.push(variant);
    }

    expect(
      repetidas,
      `variantes sem cor própria: ${repetidas.join(", ")}`,
    ).toHaveLength(0);
  });

  /**
   * A `info` já esteve colada em --primary: enquanto o token de estado
   * informativo não existia, ela reusava --primary-tint-foreground e pintava
   * "informação" com a cor da marca. Isso passa em qualquer teste de contraste
   * e em qualquer teste de "tem cor própria" — a cor era própria, só não era
   * dela. O que pega é comparar com a cor da marca diretamente.
   */
  test("info não usa a cor da marca", async () => {
    const tela = await render(<AsciiBadge variant="info" label="PRONTO" />);
    const el = tela.container.querySelector('[data-slot="ascii-badge"]');

    const marca = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-tint-foreground")
      .trim();

    expect(getComputedStyle(el as Element).color).not.toBe(marca);
  });
});
