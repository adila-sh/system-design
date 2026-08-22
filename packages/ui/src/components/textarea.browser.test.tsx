import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Textarea } from "./textarea";
import {
  MINIMO,
  contrasteDaBorda,
  contrasteDe,
  contrasteDoPlaceholder,
} from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

// A borda vem de --input, o mesmo achado sistêmico já registrado para campos e
// controles de seleção. Este arquivo mantém a catraca também no Textarea.
const BORDA_ABAIXO_DO_MINIMO = new Map([
  ["light", 1.23],
  ["dark", 1.56],
]);

describe.each(TEMAS)("Textarea no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("texto, placeholder e borda preservam seus pisos", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(
      <Textarea
        aria-label="Observações"
        placeholder="Escreva uma observação"
      />,
    );
    const campo = tela.getByRole("textbox", { name: "Observações" }).element();

    expect(contrasteDe(campo)).toBeGreaterThanOrEqual(MINIMO.texto);
    expect(contrasteDoPlaceholder(campo)).toBeGreaterThanOrEqual(MINIMO.texto);

    const contraste = contrasteDaBorda(campo);
    const piso = BORDA_ABAIXO_DO_MINIMO.get(tema)!;
    expect(contraste, `borda no tema ${tema} regrediu`).toBeGreaterThanOrEqual(
      piso,
    );
    expect(
      contraste,
      `borda no tema ${tema} agora passa em 1.4.11 — remova a entrada`,
    ).toBeLessThan(MINIMO.naoTexto);
  });
});

describe("Textarea interativo", () => {
  test("propaga a edição do valor", async () => {
    const aoMudar = vi.fn();
    const tela = await render(
      <Textarea aria-label="Resumo" onChange={aoMudar} />,
    );
    const campo = tela.getByRole("textbox", { name: "Resumo" });

    await campo.fill("Novo resumo da atividade");

    expect(aoMudar).toHaveBeenCalled();
    expect((campo.element() as HTMLTextAreaElement).value).toBe(
      "Novo resumo da atividade",
    );
  });
});
