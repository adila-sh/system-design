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

/**
 * Só restam combinações do tema ESCURO. As do tema claro saíram ao baixar a
 * luminosidade de --destructive e --success, o que bastou porque no tema claro
 * existe uma faixa de L que satisfaz as duas restrições ao mesmo tempo: texto
 * colorido sobre a própria tinta E foreground branco sobre o preenchimento
 * sólido.
 *
 * No tema escuro essa faixa é VAZIA — as duas restrições puxam em sentidos
 * opostos, porque a tinta é a cor sobre um fundo escuro. A saída foi dar à
 * tinta tokens próprios (--x-tint / --x-tint-foreground), e Status,
 * DeploymentStatus e ApiRequestMethod já migraram.
 *
 * Button, Badge e Alert continuam aqui porque usam OUTRAS superfícies:
 * bg-destructive/20 (não /10), texto sobre --card, e o link, que é texto
 * colorido direto sobre o fundo da página, sem tinta nenhuma. Cada um precisa da
 * própria decisão — o /20 pede um segundo nível de tinta, e o link pede uma cor
 * de acento própria para texto.
 */
const ABAIXO_DO_MINIMO = new Map([
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
