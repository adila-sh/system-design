import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const SRC = path.resolve(import.meta.dirname, "src");

/**
 * Pré-declara para o otimizador do Vite tudo que os componentes importam de
 * fora do pacote.
 *
 * Sem isso, a primeira execução depois de um arquivo de teste novo descobre uma
 * dependência ainda não pré-bundlada, o Vite reoptimiza e RECARREGA a página no
 * meio do teste. O sintoma é falha intermitente com "Cannot read properties of
 * null" em useState/useContext/useRef — que parece duas cópias de React, mas é a
 * árvore sendo derrubada no meio do render. O próprio Vitest sugere este campo
 * quando detecta o reload.
 *
 * A lista é derivada dos imports em vez de mantida à mão: o Base UI é importado
 * por subcaminho (um por componente), então uma lista fixa envelheceria a cada
 * componente novo.
 */
function dependenciasExternas(): string[] {
  const arquivos = readdirSync(path.join(SRC, "components"))
    .filter((f) => f.endsWith(".tsx") && !f.includes(".test."))
    .map((f) => path.join(SRC, "components", f));

  const encontradas = new Set<string>();
  for (const arquivo of arquivos) {
    const fonte = readFileSync(arquivo, "utf8");
    for (const [, spec] of fonte.matchAll(/from\s+"([^"]+)"/g)) {
      const externo = !spec.startsWith(".") && !spec.startsWith("@/");
      // react e react-dom são tratados à parte pelo próprio Vite.
      if (externo && spec !== "react" && spec !== "react-dom") {
        encontradas.add(spec);
      }
    }
  }
  return [...encontradas].sort();
}

// O plugin do Tailwind compila src/styles/index.css durante o teste, então o
// browser project roda contra o MESMO CSS que o build publica — é o que permite
// asserção de cor computada (os tokens são oklch e só existem depois da
// cascata). Sem isso, as classes utilitárias seriam apenas strings no DOM.
export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: { "@": SRC },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: [...dependenciasExternas(), "vitest-browser-react/pure"],
  },
  test: {
    // Impede que spies, mocks, globals e variáveis de ambiente vazem entre
    // testes. O DOM continua sendo limpo explicitamente em test/setup.ts.
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    experimental: {
      // Exibe somente os imports lentos, sem poluir a saída normal da suíte.
      importDurations: {
        print: "on-warn",
        limit: 10,
        thresholds: { warn: 100, danger: 500 },
      },
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/index.ts"],
      reporter: ["text", "html", "json-summary"],
      reportOnFailure: true,
      // Baseline atual: o CI não deixa a cobertura regredir silenciosamente.
      thresholds: {
        statements: 74,
        branches: 65,
        functions: 81,
        lines: 74,
        "src/components/search-input.tsx": {
          statements: 100,
          branches: 90,
          functions: 100,
          lines: 100,
        },
      },
    },
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
          // Reutiliza os workers/iframes entre os muitos arquivos pequenos.
          // test/setup.ts limpa cada render antes do teste seguinte.
          isolate: false,
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
