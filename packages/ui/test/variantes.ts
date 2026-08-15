import type { ReactElement } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MINIMO, contrasteDe } from "./contrast";

export const TEMAS = ["light", "dark"] as const;
export type Tema = (typeof TEMAS)[number];

/**
 * Combinações `tema/variante` que já nascem abaixo do mínimo AA, com o valor
 * medido na primeira execução. Não é tolerância, é catraca: o valor vira piso e
 * o teste falha pedindo a remoção da entrada quando a combinação passar em AA.
 */
export type AbaixoDoMinimo = ReadonlyMap<string, number>;

type Opcoes<V extends string> = {
  /** Nome do componente, usado só na descrição do bloco. */
  nome: string;
  variantes: readonly V[];
  montar: (variante: V) => ReactElement;
  /** Onde está, dentro do render, o elemento cujo texto será medido. */
  seletor: string;
  abaixoDoMinimo?: AbaixoDoMinimo;
};

/**
 * Percorre as variantes de um componente nos dois temas e afirma o mínimo de
 * contraste de texto sobre o que o navegador realmente pintou.
 */
export function descreverContrasteDeTexto<V extends string>({
  nome,
  variantes,
  montar,
  seletor,
  abaixoDoMinimo,
}: Opcoes<V>) {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  describe.each(TEMAS)(`${nome} no tema %s`, (tema) => {
    test.each(variantes)(
      "variant=%s atinge o mínimo de contraste para texto",
      async (variante) => {
        document.documentElement.classList.toggle("dark", tema === "dark");

        const tela = await render(montar(variante));
        const alvo = tela.container.querySelector(seletor);
        expect(alvo, `nenhum elemento casou "${seletor}"`).not.toBeNull();

        const contraste = contrasteDe(alvo as Element);
        const piso = abaixoDoMinimo?.get(`${tema}/${variante}`);

        if (piso === undefined) {
          expect(contraste).toBeGreaterThanOrEqual(MINIMO.texto);
          return;
        }

        expect(contraste).toBeGreaterThanOrEqual(piso);
        expect(
          contraste,
          `${tema}/${variante} agora passa em AA — remova a entrada de abaixoDoMinimo`,
        ).toBeLessThan(MINIMO.texto);
      },
    );
  });
}
