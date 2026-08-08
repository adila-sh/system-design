import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsShowcase } from "@/components/showcase-pages";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsShowcase,
});
