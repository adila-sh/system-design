import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { TEMAS } from "../../test/variantes";

/**
 * O scrim dos modais era `bg-black/10` cru, repetido em quatro componentes.
 * Virou token, e medindo o que ele fazia apareceu que 10% suprimia só 8% do
 * contraste do conteúdo atrás — o modal dependia inteiramente da borda, da
 * sombra e do backdrop-blur para se separar da página. Está em 40%, que suprime
 * cerca de um terço.
 *
 * O valor é o mesmo nos dois temas de propósito: o scrim multiplica a
 * luminosidade do texto e a do fundo na mesma proporção, então a supressão é
 * praticamente idêntica (34% no claro, 36% no escuro). Um `.dark` aqui seria
 * ruído. A segunda asserção guarda essa decisão.
 */
const ALFA_ESPERADO = 0.4;

function alfaDe(cor: string) {
  const m = cor.match(/[\d.]+/g);
  if (!m) throw new Error(`cor sem componentes: ${cor}`);
  return m.length >= 4 ? Number(m[3]) : 1;
}

async function alfaDoScrim() {
  const tela = await render(
    <Dialog open>
      <DialogContent>
        <DialogTitle>Confirmar</DialogTitle>
      </DialogContent>
    </Dialog>,
  );
  const overlay = await tela
    .getByRole("dialog")
    .element()
    .ownerDocument.querySelector('[data-slot="dialog-overlay"]');

  if (!overlay) throw new Error("overlay não montou");
  return alfaDe(getComputedStyle(overlay).backgroundColor);
}

describe("Scrim dos modais", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test.each(TEMAS)(
    "no tema %s cobre a página com o alfa da escala",
    async (tema) => {
      document.documentElement.classList.toggle("dark", tema === "dark");

      expect(await alfaDoScrim()).toBeCloseTo(ALFA_ESPERADO, 2);
    },
  );

  test("é o mesmo nos dois temas", async () => {
    document.documentElement.classList.remove("dark");
    const claro = await alfaDoScrim();

    document.documentElement.classList.add("dark");
    const escuro = await alfaDoScrim();

    expect(
      escuro,
      "o scrim ganhou valor por tema — a supressão é igual nos dois, um `.dark` aqui é ruído",
    ).toBeCloseTo(claro, 2);
  });
});
