import { createFileRoute } from "@tanstack/react-router";
import { HelpShowcase } from "@/components/showcase-pages";

export const Route = createFileRoute("/_app/ajuda")({
  component: HelpShowcase,
});
