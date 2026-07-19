import { createFileRoute } from "@tanstack/react-router";
import { ProductsShowcase } from "@/components/showcase-pages";

export const Route = createFileRoute("/_app/produtos")({
  component: ProductsShowcase,
});
