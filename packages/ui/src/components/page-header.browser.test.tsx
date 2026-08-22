import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "./page-header";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "PageHeader",
  montar: () => (
    <PageHeader>
      <PageHeaderContent>
        <PageHeaderEyebrow>Workspace</PageHeaderEyebrow>
        <PageHeaderTitle>Clientes</PageHeaderTitle>
        <PageHeaderDescription>
          Gerencie contatos, permissões e informações de cobrança.
        </PageHeaderDescription>
      </PageHeaderContent>
      <PageHeaderActions>Exportar dados</PageHeaderActions>
    </PageHeader>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("PageHeader", () => {
  test("oferece header e título de página semânticos", async () => {
    const tela = await render(
      <PageHeader aria-label="Cabeçalho de clientes">
        <PageHeaderContent>
          <PageHeaderTitle>Clientes</PageHeaderTitle>
        </PageHeaderContent>
      </PageHeader>,
    );

    expect(tela.container.querySelector("header")?.dataset.slot).toBe(
      "page-header",
    );
    await expect
      .element(tela.getByRole("heading", { level: 1, name: "Clientes" }))
      .toBeInTheDocument();
  });
});
