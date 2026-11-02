import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { KumoSelect } from "./kumo-select";

test("seleciona uma opção", async () => {
  const tela = await render(
    <KumoSelect
      aria-label="Situação"
      defaultValue="all"
      renderValue={(value) => (value === "failed" ? "Falhas" : "Todas")}
    >
      <KumoSelect.Option value="all">Todas</KumoSelect.Option>
      <KumoSelect.Option value="failed">Falhas</KumoSelect.Option>
    </KumoSelect>,
  );
  await tela.getByRole("combobox", { name: "Situação" }).click();
  await tela.getByRole("option", { name: "Falhas" }).click();
  await expect
    .element(tela.getByRole("combobox", { name: "Situação" }))
    .toHaveTextContent("Falhas");
});
