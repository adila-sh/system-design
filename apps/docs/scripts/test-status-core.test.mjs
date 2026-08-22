import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gerarManifesto } from "./test-status-core.mjs";

const UI_DIR = "/repo/packages/ui";

function relatorio({ status = "passed", slug = "button" } = {}) {
  return {
    numTotalTests: 1,
    testResults: [
      {
        name: `${UI_DIR}/src/components/${slug}.browser.test.tsx`,
        assertionResults: [{ status }],
      },
    ],
  };
}

function cobertura(slug, { lines, functions, branches }) {
  const metrica = ([covered, total]) => ({
    covered,
    total,
    skipped: 0,
    pct: total === 0 ? 100 : (covered / total) * 100,
  });
  return {
    [`${UI_DIR}/src/components/${slug}.tsx`]: {
      lines: metrica(lines),
      functions: metrica(functions),
      branches: metrica(branches),
    },
  };
}

describe("gerarManifesto", () => {
  it("marca a ausência de arquivo de teste sem inventar contagens", () => {
    const manifesto = gerarManifesto({
      componentes: ["button"],
      relatorio: { numTotalTests: 0, testResults: [] },
      cobertura: {},
      uiDir: UI_DIR,
    });
    assert.equal(manifesto.componentes.button.status, "sem-testes");
    assert.equal(manifesto.resumo.comTestes, 0);
    assert.equal(manifesto.resumo.protegidos, 0);
  });

  it("não considera protegido um componente que o teste não executou", () => {
    const manifesto = gerarManifesto({
      componentes: ["chart"],
      relatorio: relatorio({ slug: "chart" }),
      cobertura: cobertura("chart", {
        lines: [0, 20],
        functions: [0, 8],
        branches: [0, 12],
      }),
      uiDir: UI_DIR,
    });
    assert.equal(manifesto.componentes.chart.status, "passando");
    assert.equal(manifesto.componentes.chart.cobertura.status, "nao-executada");
    assert.equal(manifesto.resumo.protegidos, 0);
    assert.equal(manifesto.resumo.semExecucao, 1);
  });

  it("registra cobertura parcial com linhas, funções e branches", () => {
    const manifesto = gerarManifesto({
      componentes: ["button"],
      relatorio: relatorio(),
      cobertura: cobertura("button", {
        lines: [8, 10],
        functions: [3, 4],
        branches: [4, 8],
      }),
      uiDir: UI_DIR,
    });
    const dados = manifesto.componentes.button.cobertura;
    assert.equal(dados.status, "parcial");
    assert.deepEqual(dados.linhas, {
      total: 10,
      cobertas: 8,
      percentual: 80,
    });
    assert.equal(dados.funcoes.percentual, 75);
    assert.equal(dados.branches.percentual, 50);
    assert.equal(manifesto.resumo.protegidos, 1);
  });

  it("prioriza a falha do teste mesmo quando há cobertura", () => {
    const manifesto = gerarManifesto({
      componentes: ["button"],
      relatorio: relatorio({ status: "failed" }),
      cobertura: cobertura("button", {
        lines: [10, 10],
        functions: [4, 4],
        branches: [8, 8],
      }),
      uiDir: UI_DIR,
    });
    assert.equal(manifesto.componentes.button.status, "falhando");
    assert.equal(manifesto.componentes.button.cobertura.status, "completa");
    assert.equal(manifesto.resumo.falhando, 1);
    assert.equal(manifesto.resumo.protegidos, 0);
  });

  it("mantém compatibilidade sem relatório de cobertura", () => {
    const manifesto = gerarManifesto({
      componentes: ["button"],
      relatorio: relatorio(),
      cobertura: null,
      uiDir: UI_DIR,
    });
    assert.equal(manifesto.origem, "vitest");
    assert.equal(manifesto.componentes.button.status, "passando");
    assert.equal(manifesto.componentes.button.cobertura.status, "indisponivel");
  });

  it("é determinístico para as mesmas entradas", () => {
    const entrada = {
      componentes: ["button"],
      relatorio: relatorio(),
      cobertura: cobertura("button", {
        lines: [10, 10],
        functions: [4, 4],
        branches: [8, 8],
      }),
      uiDir: UI_DIR,
    };
    assert.deepEqual(gerarManifesto(entrada), gerarManifesto(entrada));
  });
});
