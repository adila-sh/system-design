import { createFileRoute } from "@tanstack/react-router";
import { SettingsShowcase } from "@/components/showcase-pages";

export const Route = createFileRoute("/_app/configuracoes")({
  component: SettingsShowcase,
});
