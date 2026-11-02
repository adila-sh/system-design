import path from "node:path";
import { defineConfig } from "tsup";
import { listComponentNames } from "./scripts/component-catalog.mjs";

const componentEntries = Object.fromEntries(
  listComponentNames(import.meta.dirname).map((name) => [
    name,
    `src/components/${name}.tsx`,
  ]),
);

const shared = {
  entry: { index: "src/index.ts", ...componentEntries },
  splitting: true,
  sourcemap: true,
  external: ["react", "react-dom", "use-sync-external-store"],
  // Phosphor 2.1.10 aponta `require` para um .js CommonJS em um pacote ESM.
  // Empacotar os ícones utilizados evita esse entrypoint inválido no Node.
  noExternal: ["@phosphor-icons/react"],
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(import.meta.dirname, "src"),
    };
  },
} satisfies import("tsup").Options;

export default defineConfig([
  { ...shared, format: ["esm"], dts: true, clean: true },
  {
    ...shared,
    format: ["cjs"],
    clean: false,
    noExternal: ["@phosphor-icons/react", "@cloudflare/kumo"],
  },
]);
