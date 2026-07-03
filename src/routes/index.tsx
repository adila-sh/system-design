import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <Badge variant="secondary">shadcn · Base UI · Tailwind v4</Badge>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Design System <span className="text-primary">LAI</span>
        </h1>
        <p className="max-w-xl text-fd-muted-foreground">
          Registry de componentes consumível por qualquer projeto via CLI do
          shadcn. Tema verde LAI, light &amp; dark, 60+ primitives Base UI.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            render={
              <Link to="/docs/$" params={{ _splat: '' }}>
                Ver documentação
              </Link>
            }
          />
          <Button
            variant="outline"
            render={
              <a
                href="https://github.com/adila-sh/system-design"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            }
          />
        </div>
        <code className="mt-2 rounded-lg border bg-fd-muted px-4 py-2 font-mono text-sm">
          npx shadcn@latest add https://&lt;host&gt;/r/lai-theme.json
        </code>
      </div>
    </HomeLayout>
  );
}
