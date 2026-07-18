import { createFileRoute } from "@tanstack/react-router";
import { ProductsShowcase } from "@/components/showcase-pages";
import { Showcase } from "@/routes/showcase";

export const Route = createFileRoute("/produtos")({ component: Products });
function Products() {
  return (
    <Showcase title="Produtos" description="Catálogo do ecossistema">
      <ProductsShowcase />
    </Showcase>
  );
}
