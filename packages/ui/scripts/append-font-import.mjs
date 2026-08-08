import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT_FILE = join(ROOT, "dist/style.css");
const FONT_IMPORT = '@import "https://assets.adila.co/adila-fonts.css";\n';

const css = readFileSync(OUT_FILE, "utf8");
writeFileSync(OUT_FILE, FONT_IMPORT + css);

console.log(
  "append-font-import: @import de adila-fonts.css adicionado ao topo do dist/style.css.",
);
