import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./button";
import { MINIMO, contrasteDe } from "../../test/contrast";
import { TEMAS, descreverContrasteDeTexto } from "../../test/variantes";

const VARIANTES = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

const ABAIXO_DO_MINIMO = new Map([
  ["light/destructive", 3.37],
  ["dark/destructive", 3.65],
  ["dark/link", 3.79],
]);

descreverContrasteDeTexto({
  nome: "Button",
  variantes: VARIANTES,
  montar: (variant) => <Button variant={variant}>Salvar alterações</Button>,
  seletor: "button",
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe.each(TEMAS)("Button desabilitado no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("continua legível apesar da opacidade", async () => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    const tela = await render(<Button disabled>Salvar alterações</Button>);

    // disabled:opacity-50 se aplica ao elemento inteiro; um texto que já esteja
    // no limite passa a falhar quando desabilitado.
    const contraste = contrasteDe(tela.getByRole("button").element());
    expect(contraste).toBeGreaterThanOrEqual(MINIMO.naoTexto);
  });
});
