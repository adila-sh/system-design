import { page } from "@vitest/browser/context";
import { afterAll, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { useIsMobile } from "./use-mobile";

/**
 * A versão anterior guardava o resultado do matchMedia em `useState` com
 * inicial `undefined` e só corrigia dentro de um efeito. O retorno era
 * `!!undefined`, então TODA montagem afirmava "não é mobile" no primeiro render
 * — num aparelho estreito, a primeira pintura vinha com o layout de desktop e
 * só o segundo render acertava.
 *
 * O teste registra os valores de cada render, e não só o valor final: o defeito
 * era exatamente um valor errado que se corrigia rápido demais para ser visto
 * numa asserção sobre o DOM já assentado.
 */
const LARGURA_DESKTOP = 1024;
const LARGURA_MOBILE = 375;
const ALTURA = 800;

function Sonda({ registrar }: { registrar: (valor: boolean) => void }) {
  const isMobile = useIsMobile();
  registrar(isMobile);
  return <output>{String(isMobile)}</output>;
}

async function rendersEm(largura: number) {
  await page.viewport(largura, ALTURA);
  const valores: boolean[] = [];
  await render(<Sonda registrar={(v) => valores.push(v)} />);
  return valores;
}

describe("useIsMobile", () => {
  afterAll(async () => {
    await page.viewport(LARGURA_DESKTOP, ALTURA);
  });

  test("acerta já no primeiro render num viewport estreito", async () => {
    const valores = await rendersEm(LARGURA_MOBILE);

    expect(
      valores[0],
      `renders: ${JSON.stringify(valores)} — o primeiro deveria já ser true`,
    ).toBe(true);
  });

  test("acerta já no primeiro render num viewport largo", async () => {
    const valores = await rendersEm(LARGURA_DESKTOP);

    expect(valores[0]).toBe(false);
  });

  test("não repinta com valor diferente depois da montagem", async () => {
    const valores = await rendersEm(LARGURA_MOBILE);

    expect(
      new Set(valores).size,
      `o valor mudou entre renders: ${JSON.stringify(valores)}`,
    ).toBe(1);
  });
});
