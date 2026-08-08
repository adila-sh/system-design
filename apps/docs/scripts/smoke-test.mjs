// Smoke test do registry: valida a estrutura dos JSONs gerados e confirma que
// o registry é servível por HTTP com CORS (o caminho real de consumo).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = process.cwd();
const R_SRC = join(ROOT, "public/r");
const SERVER = join(ROOT, ".output/server/index.mjs");
let failures = 0;
const fail = (msg) => {
  console.error("  ✗", msg);
  failures++;
};

// ---- 1. validação estrutural ------------------------------------------
if (!existsSync(R_SRC)) {
  fail("public/r não existe — rode `npm run registry` antes.");
} else {
  const files = readdirSync(R_SRC).filter((f) => f.endsWith(".json"));
  const names = new Set(files.map((f) => f.replace(/\.json$/, "")));
  console.log(`Validando ${files.length} itens do registry...`);

  for (const f of files) {
    const item = JSON.parse(readFileSync(join(R_SRC, f), "utf8"));
    const base = f.replace(/\.json$/, "");
    if (Array.isArray(item.items)) continue; // índice do registry, não um item
    if (!item.name) fail(`${f}: sem "name"`);
    if (!item.type) fail(`${f}: sem "type"`);

    if (item.type === "registry:ui" || item.type === "registry:hook") {
      if (!item.files?.length) fail(`${f}: sem files`);
      for (const file of item.files ?? []) {
        if (!file.content || file.content.length === 0)
          fail(`${f}: file ${file.path} sem conteúdo inline`);
      }
    }
    if (item.type === "registry:style") {
      const dark = item.cssVars?.dark ?? {};
      const light = item.cssVars?.light ?? {};
      if (!light.primary || !dark.primary)
        fail(`${f}: cssVars primary ausente em light/dark`);
      if (light.background === dark.background)
        fail(`${f}: light e dark têm o mesmo background (tokens não diferem)`);
    }
    // registryDependencies internas precisam existir no registry
    for (const dep of item.registryDependencies ?? []) {
      const known = ["utils"]; // itens providos pelo shadcn
      if (!names.has(dep) && !known.includes(dep) && !dep.includes("/"))
        fail(`${base}: registryDependency "${dep}" não existe no registry`);
    }
  }
}

// ---- 2. sobe o node server (nitro) + fetch com CORS -------------------
if (!existsSync(SERVER)) {
  console.log(
    ".output/server ausente — pulando teste HTTP (rode `npm run build`).",
  );
} else {
  const PORT = 5099;
  console.log(`Subindo node server (nitro) em :${PORT}...`);
  const srv = spawn("node", [SERVER], {
    stdio: "ignore",
    env: { ...process.env, PORT: String(PORT), HOST: "127.0.0.1" },
  });
  try {
    const url = `http://127.0.0.1:${PORT}/r/button.json`;
    let res;
    for (let i = 0; i < 30; i++) {
      await sleep(300);
      try {
        res = await fetch(url);
        if (res.ok) break;
      } catch {
        /* ainda subindo */
      }
    }
    if (!res || !res.ok) {
      fail("servidor não respondeu 200 em /r/button.json");
    } else {
      let ok = true;
      const cors = res.headers.get("access-control-allow-origin");
      if (cors !== "*") {
        fail(`CORS ausente (Access-Control-Allow-Origin=${cors})`);
        ok = false;
      }
      const json = await res.json();
      if (json.name !== "button") {
        fail("button.json servido inválido");
        ok = false;
      }
      if (ok)
        console.log("  ✓ HTTP 200 + CORS + JSON válido em /r/button.json");
    }
  } finally {
    srv.kill();
  }
}

if (failures > 0) {
  console.error(`\n✗ Smoke test falhou (${failures} erro(s)).`);
  process.exit(1);
}
console.log("\n✓ Smoke test passou.");
