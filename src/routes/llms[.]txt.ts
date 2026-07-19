import { source } from "@/lib/source";
import { createFileRoute } from "@tanstack/react-router";
import { llms } from "fumadocs-core/source";

const registryGuide = `# adila.co UI Registry

> Public shadcn registry and design system for React and TypeScript projects, built with Base UI and Tailwind CSS v4. Use the shadcn CLI to discover, inspect, and install its source components.

This website is a shadcn registry named \`adila-ui\`. Components are distributed as source code through registry JSON endpoints, not as a UI component npm package. Prefer the machine-readable registry endpoints below instead of scraping the rendered website.

## Registry endpoints

- [Registry catalog](https://ds.adila.co/r/registry.json): Complete machine-readable shadcn catalog. Use this URL with discovery commands such as \`list\` and \`search\`.
- [Registry item URL template](https://ds.adila.co/r/{name}.json): Replace \`{name}\` with an item name, such as \`button\`, \`sidebar\`, or \`adila-theme\`. Use an item URL with \`view\` and \`add\`.
- [Complete LLM documentation](https://ds.adila.co/llms-full.txt): Documentation pages combined into a single text file.
- [Human-readable documentation](https://ds.adila.co/docs): Component previews, API references, and usage guides.

## Requirements

Consumer projects should use Tailwind CSS v4 and initialize shadcn with Base UI:

\`\`\`bash
npx shadcn@latest init --base base
\`\`\`

Install \`adila-theme\` first when the project should use the Adila design tokens, colors, radii, and fonts:

\`\`\`bash
npx shadcn@latest add https://ds.adila.co/r/adila-theme.json
\`\`\`

## Discover and install items

\`\`\`bash
npx shadcn@latest list https://ds.adila.co/r/registry.json
npx shadcn@latest search https://ds.adila.co/r/registry.json --query sidebar
npx shadcn@latest view https://ds.adila.co/r/sidebar.json
npx shadcn@latest add https://ds.adila.co/r/sidebar.json
\`\`\`

The shadcn CLI resolves npm dependencies and other registry items declared by each component.

## Optional namespace

Add the registry to the consumer project's \`components.json\`:

\`\`\`json
{
  "registries": {
    "@adila": "https://ds.adila.co/r/{name}.json"
  }
}
\`\`\`

Then install items by namespace:

\`\`\`bash
npx shadcn@latest add @adila/sidebar
\`\`\`

## Guidance for AI agents

- Read the registry catalog before recommending or installing a component.
- Treat each item JSON as the source of truth for its files, npm dependencies, registry dependencies, and CSS variables.
- Use the shadcn CLI to install items so dependencies and target paths are resolved correctly.
- Consult the component documentation before changing its public API or interaction behavior.

## Documentation index
`;

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET() {
        const docs = llms(source);
        const documentationIndex = source.pageTree.children
          .map((node) => docs.indexNode(node))
          .join("\n");

        return new Response(`${registryGuide}\n${documentationIndex}\n`, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
          },
        });
      },
    },
  },
});
