import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "./button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "ButtonGroup",
  montar: () => (
    <ButtonGroup aria-label="Ações da fatura">
      <Button variant="outline">Aprovar</Button>
      <ButtonGroupSeparator />
      <ButtonGroupText>2 selecionadas</ButtonGroupText>
      <Button variant="outline">Arquivar</Button>
    </ButtonGroup>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("ButtonGroup", () => {
  test("expõe o agrupamento e a orientação vertical", async () => {
    const tela = await render(
      <ButtonGroup aria-label="Ações" orientation="vertical">
        <Button>Salvar</Button>
        <Button>Cancelar</Button>
      </ButtonGroup>,
    );

    const grupo = tela.getByRole("group", { name: "Ações" }).element();
    expect(grupo.dataset.orientation).toBe("vertical");
    expect(grupo.querySelectorAll("button")).toHaveLength(2);
  });

  test("o separador é vertical por padrão", async () => {
    const tela = await render(
      <ButtonGroup>
        <Button>Anterior</Button>
        <ButtonGroupSeparator />
        <Button>Próximo</Button>
      </ButtonGroup>,
    );

    const separador = tela.container.querySelector(
      '[data-slot="button-group-separator"]',
    );
    expect(separador?.getAttribute("data-orientation")).toBe("vertical");
  });
});
