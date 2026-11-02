import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { KumoLinkButton } from "./kumo-link-button";
import { descreverContrasteDeTexto } from "../../test/variantes";

descreverContrasteDeTexto({
  nome: "KumoLinkButton",
  variantes: [
    "primary",
    "secondary",
    "ghost",
    "outline",
    "destructive",
    "secondary-destructive",
  ] as const,
  montar: (variant) => (
    <KumoLinkButton href="/docs" variant={variant}>
      Documentação
    </KumoLinkButton>
  ),
  seletor: "a",
});
test("preserva href e protege links externos", async () => {
  const tela = await render(
    <KumoLinkButton href="https://example.test/docs" external>
      Documentação
    </KumoLinkButton>,
  );
  const link = tela.getByRole("link", { name: "Documentação" });
  await expect
    .element(link)
    .toHaveAttribute("href", "https://example.test/docs");
  await expect.element(link).toHaveAttribute("target", "_blank");
  expect(link.element().getAttribute("rel")).toContain("noopener");
});
test("desabilitado não oferece navegação", async () => {
  const tela = await render(
    <KumoLinkButton href="/docs" disabled>
      Documentação
    </KumoLinkButton>,
  );
  await expect
    .element(tela.getByRole("button", { name: "Documentação" }))
    .toBeDisabled();
});
