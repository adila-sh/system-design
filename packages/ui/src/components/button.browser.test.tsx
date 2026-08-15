import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./button";
import { MINIMO, contrasteDe } from "../../test/contrast";

const VARIANTES = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

const TEMAS = ["light", "dark"] as const;

/**
 * Combinações que JÁ nascem abaixo do mínimo AA de texto (4.5:1), medidas na
 * primeira execução desta suíte. Não são tolerância: são catraca. O valor
 * registrado é o piso — se cair, houve regressão; se subir até passar em AA, o
 * teste falha pedindo a remoção da entrada, pra lista não virar depósito.
 *
 * Corrigir exige mexer nos tokens --destructive e --primary, o que muda a
 * identidade do pacote publicado — decisão de design, fora do escopo de quem
 * só montou a suíte.
 */
const ABAIXO_DO_MINIMO = new Map([
  ["light/destructive", 3.37],
  ["dark/destructive", 3.65],
  ["dark/link", 3.79],
]);

function aplicarTema(tema: (typeof TEMAS)[number]) {
  document.documentElement.classList.toggle("dark", tema === "dark");
}

afterEach(() => {
  document.documentElement.classList.remove("dark");
});

describe.each(TEMAS)("Button no tema %s", (tema) => {
  test.each(VARIANTES)(
    "variant=%s atinge o mínimo de contraste para texto",
    async (variant) => {
      aplicarTema(tema);
      const tela = await render(
        <Button variant={variant}>Salvar alterações</Button>,
      );
      // Mede o que o navegador pintou, não a classe declarada: é o único jeito
      // de pegar superfície semitransparente escurecendo o texto por baixo.
      const contraste = contrasteDe(tela.getByRole("button").element());

      const piso = ABAIXO_DO_MINIMO.get(`${tema}/${variant}`);
      if (piso === undefined) {
        expect(contraste).toBeGreaterThanOrEqual(MINIMO.texto);
        return;
      }

      expect(contraste).toBeGreaterThanOrEqual(piso);
      expect(
        contraste,
        `${tema}/${variant} agora passa em AA — remova a entrada de ABAIXO_DO_MINIMO`,
      ).toBeLessThan(MINIMO.texto);
    },
  );

  test("o botão desabilitado continua legível apesar da opacidade", async () => {
    aplicarTema(tema);
    const tela = await render(<Button disabled>Salvar alterações</Button>);

    // disabled:opacity-50 se aplica ao elemento inteiro; um texto que já esteja
    // no limite passa a falhar quando desabilitado.
    const contraste = contrasteDe(tela.getByRole("button").element());
    expect(contraste).toBeGreaterThanOrEqual(MINIMO.naoTexto);
  });
});
