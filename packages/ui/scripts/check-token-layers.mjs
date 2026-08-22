import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Guarda a separação entre a camada primitiva e a semântica de adila-tokens.css.
 *
 * A camada primitiva existe para que o acento da marca (ou qualquer outro
 * degrau) seja editável em um lugar só. Um `oklch()` literal escrito direto num
 * token semântico desfaz isso em silêncio: o valor passa a existir em dois
 * lugares e só um deles é encontrado na próxima troca de paleta.
 *
 * A exceção é `oklch(from var(--token) ...)`, que não introduz valor novo — é
 * derivação de um token existente, e é como as tintas nascem.
 */
const TOKENS = join(process.cwd(), "src/styles/adila-tokens.css");
const MARCA_DA_CAMADA_2 = "/* CAMADA 2";

const source = readFileSync(TOKENS, "utf8");
const inicioDaCamada2 = source.indexOf(MARCA_DA_CAMADA_2);

if (inicioDaCamada2 === -1) {
  console.error(
    `adila-tokens.css não tem a marca "${MARCA_DA_CAMADA_2}" que separa as camadas.`,
  );
  process.exit(1);
}

const linhaInicial = source.slice(0, inicioDaCamada2).split("\n").length;
const errors = [];

source
  .slice(inicioDaCamada2)
  .split("\n")
  .forEach((linha, indice) => {
    const literais = linha.match(/oklch\((?!from\b)[^)]*\)/g);
    if (!literais) return;
    for (const literal of literais) {
      errors.push(
        `src/styles/adila-tokens.css:${linhaInicial + indice}  ${literal}`,
      );
    }
  });

if (errors.length > 0) {
  console.error(
    "Literal oklch() fora da camada primitiva — defina um primitivo e aponte para ele:",
  );
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Tokens: camada primitiva íntegra.");
