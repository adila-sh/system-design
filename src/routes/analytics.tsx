import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsShowcase } from "@/components/showcase-pages";
import { Showcase } from "@/routes/showcase";

export const Route = createFileRoute("/analytics")({ component: Analytics });
function Analytics() {
  return (
    <Showcase title="Analytics" description="Performance e adoção">
      <AnalyticsShowcase />
    </Showcase>
  );
}
