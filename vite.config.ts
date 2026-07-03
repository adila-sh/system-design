import path from 'node:path';
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    mdx(),
    tailwindcss(),
    // Prerender desligado: o plugin do TanStack pré-bundla @radix-ui (via
    // Fumadocs/cmdk) em _libs importando `tslib` de forma que o trace do
    // nitro copia incompleto. SSR sob demanda no runtime serve os docs;
    // scripts/fix-tslib.mjs garante o tslib completo no .output.
    tanstackStart({
      prerender: {
        enabled: false,
      },
    }),
    react(),
    // Railway: servidor Node standalone (respeita process.env.PORT).
    nitro({
      preset: 'node-server',
      routeRules: {
        // CORS para consumidores em browser (a CLI do shadcn não precisa).
        '/r/**': {
          headers: {
            'access-control-allow-origin': '*',
            'cache-control': 'public, max-age=300',
          },
        },
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      tslib: 'tslib/tslib.es6.js',
      // alias explícito: o tsconfigPaths não resolve `@/` nos módulos MDX
      // virtuais de content/, usados nos previews ao vivo dos docs.
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
});
