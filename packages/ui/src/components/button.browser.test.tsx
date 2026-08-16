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
 * Lista vazia — e o caminho até aqui explica por que os tokens de tinta existem.
 *
 * No tema claro bastou baixar a luminosidade de --destructive e --success,
 * porque lá existe uma faixa de L que satisfaz as duas restrições ao mesmo
 * tempo: texto colorido sobre a própria tinta E foreground branco sobre o
 * preenchimento sólido.
 *
 * No escuro essa faixa é VAZIA: a tinta é a cor sobre um fundo escuro, então as
 * duas restrições puxam em sentidos opostos. A saída foi separar os papéis em
 * --x-tint (superfície) e --x-tint-foreground (texto sobre ela), cada um livre
 * para atender à própria restrição.
 *
 * O `destructive` daqui usa --destructive-tint-strong, o nível de 20% que este
 * componente sempre teve, e o `link` usa --primary-tint-foreground mesmo sem
 * tinta nenhuma atrás: sobre o fundo da página, o que importa é ser a cor de
 * acento legível como texto, que é exatamente o que esse token guarda.
 */
const ABAIXO_DO_MINIMO = new Map<string, number>();

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
