import { createFileRoute } from "@tanstack/react-router";
import { HelpShowcase } from "@/components/showcase-pages";
import { Showcase } from "@/routes/showcase";

export const Route = createFileRoute("/ajuda")({ component: Help });
function Help() {
  return (
    <Showcase title="Ajuda" description="Documentação e suporte">
      <HelpShowcase />
    </Showcase>
  );
}
