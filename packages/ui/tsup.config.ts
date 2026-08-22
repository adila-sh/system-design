import path from "node:path";
import { defineConfig } from "tsup";
import { listComponentNames } from "./scripts/component-catalog.mjs";

const componentEntries = Object.fromEntries(
  listComponentNames(import.meta.dirname).map((name) => [
    name,
    `src/components/${name}.tsx`,
  ]),
);

export default defineConfig({
  entry: { index: "src/index.ts", ...componentEntries },
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(import.meta.dirname, "src"),
    };
  },
});
