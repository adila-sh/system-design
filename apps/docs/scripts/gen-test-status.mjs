// Gera o manifesto consumido pelas páginas de componentes a partir dos
// resultados reais do Vitest e do relatório de cobertura da fonte.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { gerarManifesto } from "./test-status-core.mjs";

const ROOT = process.cwd();
const UI_DIR = join(ROOT, "../../packages/ui");
const COMPONENTS_DIR = join(UI_DIR, "src/components");
const RELATORIO =
  process.env.VITEST_JSON_REPORT ?? join(UI_DIR, "test-results.json");
const RELATORIO_COBERTURA =
  process.env.VITEST_COVERAGE_REPORT ??
  join(UI_DIR, "coverage/coverage-summary.json");
const SAIDA = join(ROOT, "src/lib/test-status.json");

function lerJsonSeExistir(caminho) {
  return existsSync(caminho) ? JSON.parse(readFileSync(caminho, "utf8")) : null;
}

const componentes = readdirSync(COMPONENTS_DIR)
  .filter((arquivo) => arquivo.endsWith(".tsx") && !arquivo.includes(".test."))
  .map((arquivo) => arquivo.replace(/\.tsx$/, ""));
const relatorio = lerJsonSeExistir(RELATORIO);
const cobertura = lerJsonSeExistir(RELATORIO_COBERTURA);
const manifesto = gerarManifesto({
  componentes,
  relatorio,
  cobertura,
  uiDir: UI_DIR,
});

writeFileSync(SAIDA, `${JSON.stringify(manifesto, null, 2)}\n`);
execFileSync("bunx", ["oxfmt", "--write", SAIDA], { stdio: "ignore" });

if (!relatorio) {
  console.log(
    `gen-test-status: relatório ${RELATORIO} não encontrado — manifesto gerado com status "desconhecido".`,
  );
} else {
  console.log(
    `gen-test-status: ${manifesto.resumo.testes} testes; ${manifesto.resumo.protegidos}/${manifesto.resumo.componentes} componentes protegidos ` +
      `(${manifesto.resumo.semExecucao} sem execução da fonte, ${manifesto.resumo.falhando} testes falhando).` +
      (cobertura ? "" : " Relatório de cobertura indisponível."),
  );
}
