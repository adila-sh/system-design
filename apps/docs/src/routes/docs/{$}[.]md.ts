import { createFileRoute } from "@tanstack/react-router";
import { createMarkdownPageResponse } from "@/lib/llm-responses";
import { source } from "@/lib/source";

export const Route = createFileRoute("/docs/{$}.md")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        return createMarkdownPageResponse(
          params._splat?.split("/") ?? [],
          (slugs) => source.getPage(slugs),
        );
      },
    },
  },
});
