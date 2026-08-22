import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  SectionHeader,
  SectionHeaderActions,
  SectionHeaderContent,
  SectionHeaderDescription,
  SectionHeaderTitle,
} from "./section-header";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "SectionHeader",
  montar: () => (
    <SectionHeader>
      <SectionHeaderContent>
        <SectionHeaderTitle>Últimas transações</SectionHeaderTitle>
        <SectionHeaderDescription>
          Movimentações registradas nos últimos 30 dias.
        </SectionHeaderDescription>
      </SectionHeaderContent>
      <SectionHeaderActions>Ver todas</SectionHeaderActions>
    </SectionHeader>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("SectionHeader", () => {
  test("usa título de seção de nível dois", async () => {
    const tela = await render(
      <SectionHeader>
        <SectionHeaderContent>
          <SectionHeaderTitle>Últimas transações</SectionHeaderTitle>
        </SectionHeaderContent>
      </SectionHeader>,
    );

    await expect
      .element(
        tela.getByRole("heading", {
          level: 2,
          name: "Últimas transações",
        }),
      )
      .toBeInTheDocument();
  });
});
