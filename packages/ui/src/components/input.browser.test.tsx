import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Input } from "./input";
import { Textarea } from "./textarea";
import {
  MINIMO,
  contrasteDe,
  contrasteDoPlaceholder,
} from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

/**
 * O placeholder tem teste próprio porque `::placeholder` é pseudo-elemento: a
 * varredura de textos não o alcança, e ele é o caso em que a cor apagada é o
 * efeito pretendido — exatamente onde o contraste some sem ninguém notar.
 */
describe.each(TEMAS)("Campos de texto no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("o valor digitado é legível", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(<Input defaultValue="ana@adila.co" />);
    const campo = tela.container.querySelector('[data-slot="input"]');
    expect(contrasteDe(campo as Element)).toBeGreaterThanOrEqual(MINIMO.texto);
  });

  test("o placeholder do Input é legível", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(<Input placeholder="nome@empresa.com" />);
    const campo = tela.container.querySelector('[data-slot="input"]');
    expect(contrasteDoPlaceholder(campo as Element)).toBeGreaterThanOrEqual(
      MINIMO.texto,
    );
  });

  test("o placeholder do Textarea é legível", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(<Textarea placeholder="Descreva o problema" />);
    const campo = tela.container.querySelector('[data-slot="textarea"]');
    expect(contrasteDoPlaceholder(campo as Element)).toBeGreaterThanOrEqual(
      MINIMO.texto,
    );
  });

  // O campo inválido é o momento em que o usuário mais precisa enxergar, e é
  // quando a borda muda de cor — daí medir também o estado aria-invalid.
  test("o valor continua legível no estado inválido", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(
      <Input aria-invalid defaultValue="e-mail incorreto" />,
    );
    const campo = tela.container.querySelector('[data-slot="input"]');
    expect(contrasteDe(campo as Element)).toBeGreaterThanOrEqual(MINIMO.texto);
  });
});
