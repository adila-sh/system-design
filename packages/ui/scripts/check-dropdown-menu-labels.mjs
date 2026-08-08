import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "src");
const PRIMITIVE_FILES = new Set([
  "src/components/dropdown-menu.tsx",
  "src/components/menubar.tsx",
]);
const VALID_PARENTS = new Set(["DropdownMenuGroup", "DropdownMenuRadioGroup"]);

function listTsxFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory()
      ? listTsxFiles(path)
      : path.endsWith(".tsx")
        ? [path]
        : [];
  });
}

const errors = [];

for (const file of listTsxFiles(SRC_DIR)) {
  const displayPath = relative(ROOT, file);
  if (PRIMITIVE_FILES.has(displayPath)) continue;

  const source = readFileSync(file, "utf8");
  const groupStack = [];
  const tagPattern =
    /<(\/)?(DropdownMenu(?:Group|RadioGroup|Label))\b[^>]*(\/?)>/g;
  let match;

  while ((match = tagPattern.exec(source))) {
    const [, closing, name, selfClosing] = match;

    if (name === "DropdownMenuLabel" && !closing && groupStack.length === 0) {
      const line = source.slice(0, match.index).split("\n").length;
      errors.push(`${displayPath}:${line}`);
    } else if (VALID_PARENTS.has(name)) {
      if (closing) groupStack.pop();
      else if (!selfClosing) groupStack.push(name);
    }
  }
}

if (errors.length > 0) {
  console.error(
    "DropdownMenuLabel deve estar dentro de DropdownMenuGroup ou DropdownMenuRadioGroup:",
  );
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("DropdownMenuLabel: composição válida.");
