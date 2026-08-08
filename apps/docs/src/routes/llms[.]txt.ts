import { source } from "@/lib/source";
import { createFileRoute } from "@tanstack/react-router";
import { llms } from "fumadocs-core/source";

const packageGuide = `# adila.co UI

> React design system distributed through GitHub Packages and installed with Bun.

The package is published as \`@adila-sh/ui\`. It includes the component library,
precompiled styles, and Adila design tokens for light and dark themes.

## Installation

Configure the GitHub Packages registry and install the package:

\`\`\`bash
echo "@adila-sh:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}" >> .npmrc
bun add @adila-sh/ui
\`\`\`

Import the styles and components in the consumer project:

\`\`\`tsx
import "@adila-sh/ui/style.css";
import { Button } from "@adila-sh/ui";
\`\`\`

## Documentation

- [Complete LLM documentation](https://ds.adila.co/llms-full.txt): Documentation pages combined into a single text file.
- [Human-readable documentation](https://ds.adila.co/docs): Component previews, API references, and usage guides.

## Guidance for AI agents

- Install the published package with \`bun add @adila-sh/ui\`.
- Import components from \`@adila-sh/ui\` and styles from \`@adila-sh/ui/style.css\`.
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

        return new Response(`${packageGuide}\n${documentationIndex}\n`, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
          },
        });
      },
    },
  },
});
