# --- build stage (bun) ---
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/docs/package.json apps/docs/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN bun install --frozen-lockfile
COPY . .
RUN bun run --cwd packages/ui build
RUN bun run --cwd apps/docs build

# --- runtime stage (node) ---
# o output do nitro (node-server) roda em node; imagem enxuta pro runtime.
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/docs/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
