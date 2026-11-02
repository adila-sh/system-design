import { useState } from "react";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { KumoSwitch } from "./kumo-switch";

function Fixture() {
  const [checked, setChecked] = useState(false);
  return (
    <KumoSwitch
      aria-label="Avisos"
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}
test("alterna pelo teclado e mantém o controle redondo", async () => {
  const tela = await render(<Fixture />);
  const controle = tela.getByRole("switch", { name: "Avisos" });
  controle.element().focus();
  await userEvent.keyboard(" ");
  await expect.element(controle).toHaveAttribute("aria-checked", "true");
  expect(
    parseFloat(getComputedStyle(controle.element()).borderRadius),
  ).toBeGreaterThan(100);
});
test("preserva o bloqueio do controle desabilitado", async () => {
  const tela = await render(
    <KumoSwitch aria-label="Avisos" disabled checked={false} />,
  );
  await expect
    .element(tela.getByRole("switch", { name: "Avisos" }))
    .toBeDisabled();
});
