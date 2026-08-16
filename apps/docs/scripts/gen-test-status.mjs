// Gera o manifesto de status de testes consumido pelas páginas de componente
// da documentação (src/lib/test-status.json).
//
// A contagem vem do relatório JSON do Vitest (packages/ui/test-results.json),
// não de uma varredura estática: boa parte dos testes é declarada dentro de
// laços (`for (const variante of VARIANTES) test(...)`), então contar chamadas
// de `test(` no fonte erraria o número. Sem o relatório, o manifesto ainda é
// gerado — só que marcando os componentes como "desconhecido" em vez de
// inventar um número.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const ROOT = process.cwd();
const UI_DIR = join(ROOT, "../../packages/ui");
const COMPONENTS_DIR = join(UI_DIR, "src/components");
const RELATORIO =
  process.env.VITEST_JSON_REPORT ?? join(UI_DIR, "test-results.json");
const SAIDA = join(ROOT, "src/lib/test-status.json");

/** `src/components/button.browser.test.tsx` -> `button` */
function slugDoArquivoDeTeste(caminho) {
  return basename(caminho).replace(/\.(browser\.)?test\.tsx?$/, "");
}

/** Caminho relativo ao pacote ui, para exibir e linkar no GitHub. */
function relativoAoUi(caminho) {
  const marcador = "packages/ui/";
  const i = caminho.indexOf(marcador);
  return i === -1 ? caminho : caminho.slice(i + marcador.length);
}

const componentes = readdirSync(COMPONENTS_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.includes(".test."))
  .map((f) => f.replace(/\.tsx$/, ""))
  .sort();

const temRelatorio = existsSync(RELATORIO);
const relatorio = temRelatorio
  ? JSON.parse(readFileSync(RELATORIO, "utf8"))
  : null;

// slug -> agregado dos arquivos de teste daquele componente
const porSlug = new Map();
for (const arquivo of relatorio?.testResults ?? []) {
  const slug = slugDoArquivoDeTeste(arquivo.name);
  const atual = porSlug.get(slug) ?? {
    total: 0,
    passando: 0,
    falhando: 0,
    arquivos: [],
  };
  for (const teste of arquivo.assertionResults) {
    atual.total++;
    if (teste.status === "passed") atual.passando++;
    else if (teste.status === "failed") atual.falhando++;
  }
  atual.arquivos.push(relativoAoUi(arquivo.name));
  porSlug.set(slug, atual);
}

const entradas = {};
for (const slug of componentes) {
  const dados = porSlug.get(slug);

  if (!temRelatorio) {
    entradas[slug] = { status: "desconhecido", total: 0 };
    continue;
  }
  if (!dados) {
    entradas[slug] = { status: "sem-testes", total: 0 };
    continue;
  }

  entradas[slug] = {
    status: dados.falhando > 0 ? "falhando" : "passando",
    total: dados.total,
    passando: dados.passando,
    falhando: dados.falhando,
    arquivos: dados.arquivos.sort(),
  };
}

const comTestes = Object.values(entradas).filter((e) => e.total > 0);
const manifesto = {
  geradoEm: new Date().toISOString(),
  origem: temRelatorio ? "vitest" : "indisponivel",
  resumo: {
    componentes: componentes.length,
    comTestes: comTestes.length,
    semTestes: componentes.length - comTestes.length,
    testes: comTestes.reduce((soma, e) => soma + e.total, 0),
    falhando: comTestes.reduce((soma, e) => soma + (e.falhando ?? 0), 0),
    // inclui os testes que não pertencem a um componente (utils, lib, etc.)
    testesNaSuite: relatorio?.numTotalTests ?? 0,
  },
  componentes: entradas,
};

writeFileSync(SAIDA, JSON.stringify(manifesto, null, 2) + "\n");

console.log(
  temRelatorio
    ? `gen-test-status: ${manifesto.resumo.testes} testes em ${manifesto.resumo.comTestes}/${manifesto.resumo.componentes} componentes ` +
        `(${manifesto.resumo.falhando} falhando).`
    : `gen-test-status: relatório ${RELATORIO} não encontrado — manifesto gerado com status "desconhecido". ` +
        `Rode "bun run --cwd packages/ui test:json" antes.`,
);
