import { readdirSync } from "node:fs";
import { join } from "node:path";

/** Catálogo único usado pelo barrel e pelas entradas públicas do pacote. */
export function listComponentNames(packageRoot) {
  return readdirSync(join(packageRoot, "src/components"))
    .filter(
      (arquivo) => arquivo.endsWith(".tsx") && !arquivo.includes(".test."),
    )
    .map((arquivo) => arquivo.replace(/\.tsx$/, ""))
    .sort();
}
