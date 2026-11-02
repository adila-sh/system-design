import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";
import { KumoTabs } from "./kumo-tabs";
import { descreverContrasteDosTextos } from "../../test/textos";
const tabs = [
  { value: "overview", label: "Visão geral" },
  { value: "history", label: "Histórico" },
];
descreverContrasteDosTextos({
  nome: "KumoTabs",
  montar: () => <KumoTabs tabs={tabs} selectedValue="overview" />,
});
test("navega por setas e ativa por Enter", async () => {
  const change = vi.fn();
  const tela = await render(
    <KumoTabs tabs={tabs} selectedValue="overview" onValueChange={change} />,
  );
  tela.getByRole("tab", { name: "Visão geral" }).element().focus();
  await userEvent.keyboard("{ArrowRight}{Enter}");
  await expect
    .element(tela.getByRole("tab", { name: "Histórico" }))
    .toHaveAttribute("aria-selected", "true");
  expect(change).toHaveBeenCalledWith("history");
});
