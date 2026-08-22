import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Garante que toda utilitária de foco tenha o fallback de alto contraste no CSS
 * compilado.
 *
 * O anel de foco é box-shadow, e o modo de alto contraste do Windows descarta
 * box-shadow. Sem um outline dentro de `@media (forced-colors: active)`, quem
 * usa alto contraste fica sem indicador de foco nenhum.
 *
 * Roda sobre o dist/style.css e não em teste de navegador de propósito: tentei
 * afirmar isso pelo CSSOM e o teste passava por acidente, porque `cssText` de
 * uma regra de grupo traz tudo que está aninhado dentro — procurar
 * "forced-colors" numa regra que menciona `focus-ring` casava com o
 * `@layer utilities` inteiro. Aqui a verificação é sobre texto que já saiu do
 * compilador, sem essa ambiguidade.
 */
const CSS = join(process.cwd(), "dist/style.css");
const UTILITARIAS = [
  "focus-ring",
  "focus-ring-inset",
  "focus-ring-within",
  "focus-ring-has-fallback",
];

let source;
try {
  source = readFileSync(CSS, "utf8");
} catch {
  console.error(
    "dist/style.css não existe — rode este check depois de `build:css`.",
  );
  process.exit(1);
}

/**
 * Blocos @media de forced-colors, delimitados contando chaves.
 *
 * Duas armadilhas que este check já caiu, as duas descobertas quebrando a media
 * query de propósito e vendo o check aprovar mesmo assim:
 *
 * 1. Uma janela de tamanho fixo a partir do `@media` transborda para o CSS
 *    seguinte e passa a casar com utilitárias que estão FORA do bloco. Por isso
 *    a delimitação é por contagem de chaves.
 * 2. Casar só "forced-colors" aceita qualquer condição — inclusive uma
 *    inválida. A condição tem que ser `forced-colors: active`.
 */
function blocosDe(condicao) {
  const blocos = [];
  const abertura = new RegExp(`@media[^{]*${condicao}[^{]*\\{`, "g");

  for (const achado of source.matchAll(abertura)) {
    let i = achado.index + achado[0].length;
    let profundidade = 1;
    while (i < source.length && profundidade > 0) {
      if (source[i] === "{") profundidade += 1;
      else if (source[i] === "}") profundidade -= 1;
      i += 1;
    }
    blocos.push(source.slice(achado.index, i));
  }
  return blocos.join("\n");
}

const blocosDeAltoContraste = blocosDe("forced-colors\\s*:\\s*active");

const errors = [];

for (const utilitaria of UTILITARIAS) {
  // `.focus-ring` é prefixo de `.focus-ring-inset`; o delimitador evita
  // que uma satisfaça a checagem da outra.
  const classe = new RegExp(`\\.${utilitaria}[:.,\\s{]`);

  if (!classe.test(source)) {
    errors.push(`${utilitaria}: não chegou no CSS compilado`);
    continue;
  }
  if (!classe.test(blocosDeAltoContraste)) {
    errors.push(`${utilitaria}: sem outline em @media (forced-colors: active)`);
  }
}

if (errors.length > 0) {
  console.error("Foco sem fallback de alto contraste (WCAG 2.2 SC 2.4.13):");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Foco: fallback de alto contraste presente nas utilitárias.");
