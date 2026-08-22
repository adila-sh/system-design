import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  Blockquote,
  CodeText,
  Description,
  InlineCode,
  Label,
  Lead,
  List,
  Muted,
  PixelText,
  Small,
  Text,
  Title,
} from "./typography";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Typography",
  montar: () => (
    <div>
      <Title>Título principal</Title>
      <Text>Texto de leitura contínua.</Text>
      <PixelText>Texto pixelado</PixelText>
      <CodeText>const ativo = true</CodeText>
      <Lead>Introdução de destaque.</Lead>
      <Label>Rótulo auxiliar</Label>
      <Description>Descrição complementar.</Description>
      <Small>Nota pequena</Small>
      <Muted>Informação secundária.</Muted>
      <InlineCode>bun test</InlineCode>
      <Blockquote>Uma citação importante.</Blockquote>
      <List>
        <li>Primeiro item</li>
        <li>Segundo item</li>
      </List>
    </div>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("Typography semântica", () => {
  test.each([1, 2, 3, 4, 5, 6] as const)(
    "Title level=%s renderiza o heading correspondente",
    async (level) => {
      const tela = await render(<Title level={level}>Hierarquia</Title>);
      const titulo = tela.getByRole("heading", { level, name: "Hierarquia" });

      expect(titulo.element().getAttribute("data-level")).toBe(String(level));
    },
  );

  test("preserva elementos nativos para código, citação e lista", async () => {
    const tela = await render(
      <div>
        <InlineCode>bun test</InlineCode>
        <Blockquote>Teste antes de publicar.</Blockquote>
        <List>
          <li>Validar</li>
        </List>
      </div>,
    );

    expect(tela.container.querySelector("code")?.textContent).toBe("bun test");
    expect(tela.container.querySelector("blockquote")?.textContent).toContain(
      "Teste antes de publicar.",
    );
    expect(tela.container.querySelector("ul > li")?.textContent).toBe(
      "Validar",
    );
  });
});
