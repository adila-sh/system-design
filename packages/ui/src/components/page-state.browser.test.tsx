import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { WarningIcon } from "@phosphor-icons/react";
import {
  PageState,
  PageStateActions,
  PageStateBackdrop,
  PageStateCode,
  PageStateContent,
  PageStateDescription,
  PageStateEyebrow,
  PageStateFooter,
  PageStateMedia,
  PageStateTitle,
} from "./page-state";
import { descreverContrasteDosTextos } from "../../test/textos";

// O texto de destaque herda o acento semântico. Três combinações ainda ficam
// abaixo de 4.5:1 sobre background e permanecem como catraca dos tokens.
const ABAIXO_DO_MINIMO = new Map([
  ["light/Estado warning", 2.14],
  ["dark/Estado default", 3.79],
  ["dark/Estado destructive", 4.36],
]);

const VARIANTES = ["default", "muted", "warning", "destructive"] as const;

descreverContrasteDosTextos({
  nome: "PageState",
  montar: () => (
    <div>
      {VARIANTES.map((variant, indice) => (
        <PageState key={variant} variant={variant}>
          <PageStateBackdrop />
          <PageStateContent>
            {variant === "default" ? (
              <PageStateCode>404</PageStateCode>
            ) : (
              <PageStateMedia>
                <WarningIcon aria-hidden="true" />
              </PageStateMedia>
            )}
            <PageStateEyebrow>Estado {variant}</PageStateEyebrow>
            <PageStateTitle>Mensagem {indice + 1}</PageStateTitle>
            <PageStateDescription>
              Descrição do estado {variant} para orientar a próxima ação.
            </PageStateDescription>
            <PageStateActions>Continuar no estado {variant}</PageStateActions>
            <PageStateFooter>Referência {indice + 1}</PageStateFooter>
          </PageStateContent>
        </PageState>
      ))}
    </div>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("PageState", () => {
  test.each(VARIANTES)("expõe variant=%s na raiz", async (variant) => {
    const tela = await render(<PageState variant={variant} />);

    expect(
      tela.container
        .querySelector('[data-slot="page-state"]')
        ?.getAttribute("data-variant"),
    ).toBe(variant);
  });

  test("mantém o backdrop fora da árvore acessível", async () => {
    const tela = await render(
      <PageState>
        <PageStateBackdrop />
      </PageState>,
    );

    expect(
      tela.container
        .querySelector('[data-slot="page-state-backdrop"]')
        ?.getAttribute("aria-hidden"),
    ).toBe("true");
  });
});
