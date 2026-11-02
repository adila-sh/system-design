import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { KumoTable } from "./kumo-table";

test("expõe tabela com cabeçalho e célula", async () => {
  const tela = await render(
    <KumoTable>
      <KumoTable.Header>
        <KumoTable.Row>
          <KumoTable.Head>Evento</KumoTable.Head>
        </KumoTable.Row>
      </KumoTable.Header>
      <KumoTable.Body>
        <KumoTable.Row>
          <KumoTable.Cell>Pagamento</KumoTable.Cell>
        </KumoTable.Row>
      </KumoTable.Body>
    </KumoTable>,
  );
  await expect
    .element(tela.getByRole("columnheader", { name: "Evento" }))
    .toBeVisible();
  await expect
    .element(tela.getByRole("cell", { name: "Pagamento" }))
    .toBeVisible();
});
