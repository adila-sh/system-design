import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// O plugin do Tailwind compila src/styles/index.css durante o teste, então o
// browser project roda contra o MESMO CSS que o build publica — é o que permite
// asserção de cor computada (os tokens são oklch e só existem depois da
// cascata). Sem isso, as classes utilitárias seriam apenas strings no DOM.
export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
    // O pacote resolve react pelo node_modules da raiz do monorepo, mas alguns
    // caminhos de import chegavam a uma segunda cópia — o sintoma era falha
    // intermitente com "Cannot read properties of null (reading 'useRef')",
    // que é o dispatcher de hooks de uma instância vendo a árvore da outra.
    dedupe: ["react", "react-dom"],
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.tsx"],
          setupFiles: ["./test/setup.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
