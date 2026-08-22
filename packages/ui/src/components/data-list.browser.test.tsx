import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  DataList,
  DataListItem,
  DataListTerm,
  DataListValue,
} from "./data-list";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "DataList",
  montar: () => (
    <DataList>
      <DataListItem>
        <DataListTerm>Plano</DataListTerm>
        <DataListValue>Profissional</DataListValue>
      </DataListItem>
      <DataListItem>
        <DataListTerm>Valor mensal</DataListTerm>
        <DataListValue>R$ 149,00</DataListValue>
      </DataListItem>
    </DataList>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("DataList", () => {
  test("preserva a semântica nativa de lista de descrições", async () => {
    const tela = await render(
      <DataList>
        <DataListItem>
          <DataListTerm>Renovação</DataListTerm>
          <DataListValue>18 de agosto de 2026</DataListValue>
        </DataListItem>
      </DataList>,
    );

    expect(tela.container.querySelector("dl")?.dataset.slot).toBe("data-list");
    expect(tela.container.querySelector("dt")?.textContent).toBe("Renovação");
    expect(tela.container.querySelector("dd")?.textContent).toBe(
      "18 de agosto de 2026",
    );
  });
});
