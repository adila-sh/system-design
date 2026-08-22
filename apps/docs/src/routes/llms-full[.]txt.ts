import { createFileRoute } from "@tanstack/react-router";
import { createLlmsFullResponse } from "@/lib/llm-responses";
import { source } from "@/lib/source";

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: async () => {
        return createLlmsFullResponse(source.getPages());
      },
    },
  },
});
