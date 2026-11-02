import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { KumoField } from "./kumo-field";
import { KumoInput } from "./kumo-input";

test("associa descrição e erro ao controle", async () => {
  const tela = await render(
    <KumoField
      label="Nome"
      description="Nome do cliente"
      error={{ message: "Informe o nome", match: true }}
    >
      <KumoInput aria-label="Nome" />
    </KumoField>,
  );
  const input = tela.getByRole("textbox", { name: "Nome" });
  await expect.element(tela.getByText("Informe o nome")).toBeVisible();
  const descriptionId = input.element().getAttribute("aria-describedby");
  expect(descriptionId).toBeTruthy();
  expect(
    descriptionId
      ?.split(" ")
      .some((id) =>
        document.getElementById(id)?.textContent?.includes("Informe o nome"),
      ),
  ).toBe(true);
});
