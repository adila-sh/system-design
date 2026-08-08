import { createFileRoute } from "@tanstack/react-router";
import { CustomersShowcase } from "@/components/showcase-pages";

export const Route = createFileRoute("/_app/clientes")({
  component: CustomersShowcase,
});
