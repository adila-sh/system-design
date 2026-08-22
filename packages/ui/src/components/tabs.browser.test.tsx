import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { descreverContrasteDosTextos } from "../../test/textos";

/**
 * A opacidade de 50% aplicada à aba desabilitada reduz o texto para 1.94:1 no
 * tema claro e 2.94:1 no escuro. Texto de controle inativo é isento pela WCAG,
 * mas o piso preserva o valor renderizado para ele não desaparecer ainda mais.
 */
const PADRAO_ABAIXO_DO_MINIMO = new Map([
  ["light/Histórico", 1.93],
  ["dark/Histórico", 2.93],
]);

// Sem a superfície muted da lista padrão, o mesmo texto mede 1.95:1 no claro.
const LINE_ABAIXO_DO_MINIMO = new Map([["light/Histórico", 1.94]]);

function ExemploTabs({
  variant = "default",
}: {
  variant?: "default" | "line";
}) {
  return (
    <Tabs defaultValue="visao">
      <TabsList variant={variant} aria-label="Seções do relatório">
        <TabsTrigger value="visao">Visão geral</TabsTrigger>
        <TabsTrigger value="dados">Dados</TabsTrigger>
        <TabsTrigger value="historico" disabled>
          Histórico
        </TabsTrigger>
      </TabsList>
      <TabsContent value="visao">Resumo do período</TabsContent>
      <TabsContent value="dados">Tabela de lançamentos</TabsContent>
      <TabsContent value="historico">Histórico indisponível</TabsContent>
    </Tabs>
  );
}

descreverContrasteDosTextos({
  nome: "Tabs padrão",
  montar: () => <ExemploTabs />,
  abaixoDoMinimo: PADRAO_ABAIXO_DO_MINIMO,
});

descreverContrasteDosTextos({
  nome: "Tabs line",
  montar: () => <ExemploTabs variant="line" />,
  abaixoDoMinimo: LINE_ABAIXO_DO_MINIMO,
});

describe("Tabs", () => {
  test("expõe seleção e painéis associados", async () => {
    const tela = await render(<ExemploTabs />);
    const visao = tela.getByRole("tab", { name: "Visão geral" }).element();
    const painelId = visao.getAttribute("aria-controls");

    expect(visao.getAttribute("aria-selected")).toBe("true");
    expect(painelId).toBeTruthy();
    expect(document.getElementById(painelId!)?.getAttribute("role")).toBe(
      "tabpanel",
    );
    await expect.element(tela.getByText("Resumo do período")).toBeVisible();
  });

  test("alterna o painel ao ativar outra aba", async () => {
    const tela = await render(<ExemploTabs />);
    const dados = tela.getByRole("tab", { name: "Dados" });

    await dados.click();

    expect(dados.element().getAttribute("aria-selected")).toBe("true");
    expect(
      tela
        .getByRole("tab", { name: "Visão geral" })
        .element()
        .getAttribute("aria-selected"),
    ).toBe("false");
    await expect.element(tela.getByText("Tabela de lançamentos")).toBeVisible();
  });
});
