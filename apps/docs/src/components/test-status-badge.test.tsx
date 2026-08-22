import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  TestStatusBadgeContent,
  type StatusDeTestes,
} from "./test-status-badge";

function render(dados?: StatusDeTestes) {
  return renderToStaticMarkup(<TestStatusBadgeContent dados={dados} />);
}

describe("TestStatusBadgeContent", () => {
  it("exibe o total de testes passando e o arquivo do relatório", () => {
    const markup = render({
      status: "passando",
      total: 4,
      passando: 4,
      arquivos: ["src/components/ui/button.test.tsx"],
    });

    expect(markup).toContain("4 testes passando");
    expect(markup).toContain("text-emerald-700");
    expect(markup).toContain("packages/ui/src/components/ui/button.test.tsx");
  });

  it("destaca a quantidade de testes falhando", () => {
    const markup = render({ status: "falhando", total: 3, falhando: 2 });

    expect(markup).toContain("2 de 3 testes falhando");
    expect(markup).toContain("text-red-700");
  });

  it("informa quando o componente ainda não tem testes", () => {
    expect(render({ status: "sem-testes", total: 0 })).toContain(
      "Sem testes automatizados",
    );
  });

  it.each([undefined, { status: "desconhecido", total: 0 } as const])(
    "não renderiza um estado desconhecido",
    (dados) => {
      expect(render(dados)).toBe("");
    },
  );
});
