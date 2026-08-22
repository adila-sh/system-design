import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumnDef,
} from "./data-table";
import { descreverContrasteDosTextos } from "../../test/textos";

type Cliente = {
  id: string;
  nome: string;
  plano: string;
};

const CLIENTES: Cliente[] = [
  { id: "c1", nome: "Ana Lima", plano: "Profissional" },
  { id: "c2", nome: "Bruno Reis", plano: "Essencial" },
];

const COLUNAS: DataTableColumnDef<Cliente>[] = [
  {
    accessorKey: "nome",
    header: () => <DataTableColumnHeader column={null} title="Cliente" />,
  },
  {
    accessorKey: "plano",
    header: () => <DataTableColumnHeader column={null} title="Plano" />,
  },
];

descreverContrasteDosTextos({
  nome: "DataTable",
  montar: () => <DataTable columns={COLUNAS} data={CLIENTES} />,
  abaixoDoMinimo: new Map<string, number>(),
});

describe("DataTable", () => {
  test("renderiza cabeçalhos, linhas e células com semântica de tabela", async () => {
    const tela = await render(<DataTable columns={COLUNAS} data={CLIENTES} />);

    expect(tela.getByRole("table").element()).toBeInstanceOf(HTMLTableElement);
    expect(tela.getByRole("columnheader", { name: "Cliente" })).toBeTruthy();
    expect(tela.getByRole("columnheader", { name: "Plano" })).toBeTruthy();
    expect(tela.getByRole("cell", { name: "Ana Lima" })).toBeTruthy();
    expect(tela.getByRole("cell", { name: "Essencial" })).toBeTruthy();
    expect(tela.container.querySelectorAll("tbody tr")).toHaveLength(2);
  });

  test("seleciona uma linha sem afetar as demais", async () => {
    const tela = await render(<DataTable columns={COLUNAS} data={CLIENTES} />);
    const seletores = tela.getByRole("checkbox", {
      name: "Selecionar registro",
    });

    await seletores.nth(0).click();

    const linhas = tela.container.querySelectorAll("tbody tr");
    expect(linhas[0]?.getAttribute("data-selected")).toBe("true");
    expect(linhas[1]?.getAttribute("data-selected")).toBe("false");
    await expect.element(seletores.nth(0)).toBeChecked();
    await expect.element(seletores.nth(1)).not.toBeChecked();
  });

  test("seleciona e limpa todos os registros pelo cabeçalho", async () => {
    const tela = await render(<DataTable columns={COLUNAS} data={CLIENTES} />);
    const todos = tela.getByRole("checkbox", {
      name: "Selecionar todos os registros",
    });

    await todos.click();
    await expect.element(todos).toBeChecked();
    expect(
      Array.from(tela.container.querySelectorAll("tbody tr"), (linha) =>
        linha.getAttribute("data-selected"),
      ),
    ).toEqual(["true", "true"]);

    await todos.click();
    await expect.element(todos).not.toBeChecked();
    expect(
      Array.from(tela.container.querySelectorAll("tbody tr"), (linha) =>
        linha.getAttribute("data-selected"),
      ),
    ).toEqual(["false", "false"]);
  });

  test("expõe estado parcial no seletor do cabeçalho", async () => {
    const tela = await render(<DataTable columns={COLUNAS} data={CLIENTES} />);
    await tela
      .getByRole("checkbox", { name: "Selecionar registro" })
      .nth(0)
      .click();

    const todos = tela
      .getByRole("checkbox", { name: "Selecionar todos os registros" })
      .element();
    expect(todos.getAttribute("data-indeterminate")).not.toBeNull();
  });

  test("mostra mensagens vazias padrão e personalizada", async () => {
    const tela = await render(<DataTable columns={COLUNAS} data={[]} />);
    await expect
      .element(tela.getByText("Nenhum registro encontrado."))
      .toBeVisible();
    expect(tela.container.querySelector("table")).toBeNull();

    await tela.rerender(
      <DataTable columns={COLUNAS} data={[]} empty="Sem clientes ativos." />,
    );
    await expect.element(tela.getByText("Sem clientes ativos.")).toBeVisible();
  });
});
