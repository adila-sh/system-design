import { createFileRoute } from "@tanstack/react-router";
import { CustomersShowcase } from "@/components/showcase-pages";
import { Showcase } from "@/routes/showcase";

export const Route = createFileRoute("/clientes")({ component: Customers });
function Customers() {
  return (
    <Showcase title="Clientes" description="Contas e relacionamentos">
      <CustomersShowcase />
    </Showcase>
  );
}
