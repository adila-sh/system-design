import { createFileRoute } from "@tanstack/react-router";
import { SettingsShowcase } from "@/components/showcase-pages";
import { Showcase } from "@/routes/showcase";

export const Route = createFileRoute("/configuracoes")({ component: Settings });
function Settings() {
  return (
    <Showcase title="Configurações" description="Preferências do workspace">
      <SettingsShowcase />
    </Showcase>
  );
}
