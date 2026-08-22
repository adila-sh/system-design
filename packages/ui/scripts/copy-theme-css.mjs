import { copyFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SOURCE = join(ROOT, "src/styles");
const DIST = join(ROOT, "dist");

for (const file of ["theme.css", "adila-tokens.css"]) {
  copyFileSync(join(SOURCE, file), join(DIST, file));
}

console.log("copy-theme-css: theme.css e adila-tokens.css copiados para dist.");
