import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Garante que a degradação das tintas seja o fundo da página, e não a cor cheia.
 *
 * As tintas são `color-mix`. Para cada color-mix numa custom property, o
 * Tailwind gera sozinho um fallback com o valor SEM a mistura — para
 * `--destructive-tint` isso seria `var(--destructive)`, vermelho opaco onde se
 * queria 10% dele. Texto pensado para ler sobre a tinta suave passaria a ler
 * sobre a cor cheia.
 *
 * Escrever um `@supports` à mão faz o Tailwind não gerar o dele, e aí o valor
 * de fora do @supports é o fallback de verdade. Este check afirma que ele
 * continua sendo `var(--background)`: alguém pode remover o @supports achando
 * que é redundante, o CSS segue compilando, e a regressão é invisível em
 * qualquer navegador atual.
 */
const CSS = join(process.cwd(), "dist/style.css");
const SEGURO = "var(--background)";

let source;
try {
  source = readFileSync(CSS, "utf8");
} catch {
  console.error(
    "dist/style.css não existe — rode este check depois de `build:css`.",
  );
  process.exit(1);
}

/** Remove os blocos @supports, contando chaves, para sobrar só o fallback. */
function semSupports(css) {
  let saida = "";
  let i = 0;
  while (i < css.length) {
    const inicio = css.indexOf("@supports", i);
    if (inicio === -1) {
      saida += css.slice(i);
      break;
    }
    saida += css.slice(i, inicio);
    let j = css.indexOf("{", inicio) + 1;
    let profundidade = 1;
    while (j < css.length && profundidade > 0) {
      if (css[j] === "{") profundidade += 1;
      else if (css[j] === "}") profundidade -= 1;
      j += 1;
    }
    i = j;
  }
  return saida;
}

const fora = semSupports(source);
const errors = [];

// `-tint-foreground` é derivado com oklch(from ...), não é color-mix: fica fora.
for (const [, nome, valor] of fora.matchAll(
  /(--[a-z-]+-tint(?:-strong)?)\s*:\s*([^;}]+)/g,
)) {
  const limpo = valor.trim();
  if (limpo !== SEGURO) {
    errors.push(`${nome}: fallback é \`${limpo}\`, deveria ser \`${SEGURO}\``);
  }
}

if (errors.length === 0 && !fora.includes("-tint:")) {
  console.error(
    "Nenhuma tinta encontrada fora de @supports — o check não está olhando nada.",
  );
  process.exit(1);
}

if (errors.length > 0) {
  console.error("Tinta degradando para cor cheia em vez do fundo da página:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Tintas: fallback seguro.");
