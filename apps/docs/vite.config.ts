import { cpSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";

const require = createRequire(import.meta.url);

function fixTslibBeforeSpaPrerender() {
  return {
    name: "adila-fix-tslib-before-spa-prerender",
    apply: "build" as const,
    writeBundle() {
      const output = path.resolve(".output/server");
      if (!existsSync(output)) return;

      const source = path.dirname(require.resolve("tslib/package.json"));
      cpSync(source, path.join(output, "node_modules/tslib"), {
        recursive: true,
      });
    },
  };
}

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    mdx(),
    tailwindcss(),
    // SPA: a interface é renderizada somente no cliente, evitando hydration
    // mismatch em componentes interativos como tema e sidebar.
    tanstackStart({
      spa: {
        enabled: true,
      },
      prerender: {
        enabled: false,
      },
    }),
    react(),
    // Railway: servidor Node standalone (respeita process.env.PORT).
    nitro({
      preset: "node-server",
    }),
    fixTslibBeforeSpaPrerender(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: "tslib/tslib.es6.js",
      // alias explícito: o tsconfigPaths não resolve `@/` nos módulos MDX
      // virtuais de content/, usados nos previews ao vivo dos docs.
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  optimizeDeps: {
    // Keep Base UI and its CommonJS compatibility shims in the same optimized
    // graph so the browser receives ESM-compatible named exports.
    include: [
      "@base-ui/react",
      "use-sync-external-store",
      "use-sync-external-store/shim",
      "use-sync-external-store/shim/with-selector",
    ],
  },
});
