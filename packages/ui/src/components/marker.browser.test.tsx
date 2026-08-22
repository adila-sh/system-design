import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Marker, MarkerContent, MarkerIcon } from "./marker";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();
const VARIANTES = ["default", "separator", "border"] as const;

descreverContrasteDosTextos({
  nome: "Marker",
  montar: () => (
    <div>
      {VARIANTES.map((variant) => (
        <Marker key={variant} variant={variant}>
          <MarkerIcon>•</MarkerIcon>
          <MarkerContent>Marco {variant}</MarkerContent>
        </Marker>
      ))}
    </div>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Marker", () => {
  test.each(VARIANTES)(
    "expõe variant=%s e oculta o ícone decorativo",
    async (variant) => {
      const tela = await render(
        <Marker variant={variant}>
          <MarkerIcon>•</MarkerIcon>
          <MarkerContent>Entrega</MarkerContent>
        </Marker>,
      );
      const marker = tela.container.querySelector('[data-slot="marker"]');
      const icone = tela.container.querySelector('[data-slot="marker-icon"]');

      expect(marker?.getAttribute("data-variant")).toBe(variant);
      expect(icone?.getAttribute("aria-hidden")).toBe("true");
    },
  );
});
