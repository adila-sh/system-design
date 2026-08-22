import { loader } from "fumadocs-core/source";
import { docs } from "collections/server";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { docsRoute } from "./shared";

export { markdownPathToSlugs, slugsToMarkdownPath } from "./markdown-path";

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
  plugins: [lucideIconsPlugin()],
});
