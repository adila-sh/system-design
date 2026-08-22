import { basename, join, normalize } from "node:path";

const METRICAS = ["linhas", "funcoes", "branches"];
const CHAVES_DE_COBERTURA = {
  linhas: "lines",
  funcoes: "functions",
  branches: "branches",
};

/** `src/components/button.browser.test.tsx` -> `button` */
export function slugDoArquivoDeTeste(caminho) {
  return basename(caminho).replace(/\.(browser\.)?test\.tsx?$/, "");
}

/** Caminho relativo ao pacote ui, para exibir e linkar no GitHub. */
export function relativoAoUi(caminho) {
  const normalizado = caminho.replaceAll("\\", "/");
  const marcador = "packages/ui/";
  const i = normalizado.indexOf(marcador);
  return i === -1 ? normalizado : normalizado.slice(i + marcador.length);
}

function agregarTestes(relatorio) {
  const porSlug = new Map();
  for (const arquivo of relatorio?.testResults ?? []) {
    const slug = slugDoArquivoDeTeste(arquivo.name);
    const atual = porSlug.get(slug) ?? {
      total: 0,
      passando: 0,
      falhando: 0,
      arquivos: [],
    };
    for (const teste of arquivo.assertionResults ?? []) {
      atual.total++;
      if (teste.status === "passed") atual.passando++;
      else if (teste.status === "failed") atual.falhando++;
    }
    atual.arquivos.push(relativoAoUi(arquivo.name));
    porSlug.set(slug, atual);
  }
  return porSlug;
}

function encontrarCobertura(cobertura, arquivoFonte) {
  const alvo = normalize(arquivoFonte);
  return Object.entries(cobertura ?? {}).find(
    ([arquivo]) => arquivo !== "total" && normalize(arquivo) === alvo,
  )?.[1];
}

function resumirCobertura(dados) {
  if (!dados) {
    return {
      status: "nao-executada",
      linhas: { total: 0, cobertas: 0, percentual: 0 },
      funcoes: { total: 0, cobertas: 0, percentual: 0 },
      branches: { total: 0, cobertas: 0, percentual: 0 },
    };
  }

  const metricas = Object.fromEntries(
    METRICAS.map((metrica) => {
      const valor = dados[CHAVES_DE_COBERTURA[metrica]] ?? {};
      return [
        metrica,
        {
          total: valor.total ?? 0,
          cobertas: valor.covered ?? 0,
          percentual: valor.pct ?? 0,
        },
      ];
    }),
  );
  const executada = METRICAS.some((metrica) => metricas[metrica].cobertas > 0);
  const completa = METRICAS.every(
    (metrica) => metricas[metrica].cobertas === metricas[metrica].total,
  );

  return {
    status: !executada ? "nao-executada" : completa ? "completa" : "parcial",
    ...metricas,
  };
}

export function gerarManifesto({ componentes, relatorio, cobertura, uiDir }) {
  const temRelatorio = relatorio !== null;
  const temCobertura = cobertura !== null;
  const porSlug = agregarTestes(relatorio);
  const entradas = {};

  for (const slug of [...componentes].sort()) {
    const dados = porSlug.get(slug);
    const coberturaDoComponente = temCobertura
      ? resumirCobertura(
          encontrarCobertura(
            cobertura,
            join(uiDir, "src/components", `${slug}.tsx`),
          ),
        )
      : { status: "indisponivel" };

    if (!temRelatorio) {
      entradas[slug] = {
        status: "desconhecido",
        total: 0,
        cobertura: coberturaDoComponente,
      };
      continue;
    }
    if (!dados) {
      entradas[slug] = {
        status: "sem-testes",
        total: 0,
        cobertura: coberturaDoComponente,
      };
      continue;
    }
    entradas[slug] = {
      status: dados.falhando > 0 ? "falhando" : "passando",
      total: dados.total,
      passando: dados.passando,
      falhando: dados.falhando,
      arquivos: dados.arquivos.sort(),
      cobertura: coberturaDoComponente,
    };
  }

  const valores = Object.values(entradas);
  const comTestes = valores.filter((entrada) => entrada.total > 0);
  const protegidos = valores.filter(
    (entrada) =>
      entrada.total > 0 &&
      entrada.status === "passando" &&
      ["parcial", "completa"].includes(entrada.cobertura.status),
  );

  return {
    origem: !temRelatorio
      ? "indisponivel"
      : temCobertura
        ? "vitest+coverage"
        : "vitest",
    resumo: {
      componentes: componentes.length,
      comTestes: comTestes.length,
      semTestes: componentes.length - comTestes.length,
      protegidos: protegidos.length,
      semExecucao: valores.filter(
        (entrada) => entrada.cobertura.status === "nao-executada",
      ).length,
      coberturaParcial: valores.filter(
        (entrada) => entrada.cobertura.status === "parcial",
      ).length,
      coberturaCompleta: valores.filter(
        (entrada) => entrada.cobertura.status === "completa",
      ).length,
      testes: comTestes.reduce((soma, entrada) => soma + entrada.total, 0),
      falhando: comTestes.reduce(
        (soma, entrada) => soma + (entrada.falhando ?? 0),
        0,
      ),
      testesNaSuite: relatorio?.numTotalTests ?? 0,
    },
    componentes: entradas,
  };
}
