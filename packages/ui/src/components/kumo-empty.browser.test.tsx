import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { KumoEmpty } from "./kumo-empty";

test("apresenta estado vazio", async () => {
  const tela = await render(
    <KumoEmpty title="Nenhuma entrega" description="Aguarde um evento" />,
  );
  await expect.element(tela.getByText("Nenhuma entrega")).toBeVisible();
});
