import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { Button } from "@adila-sh/ui";
import { PixelBlast } from "@adila-sh/ui";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <HomeLayout
      {...baseOptions()}
      nav={{ ...baseOptions().nav, transparentMode: "top" }}
      // Escopo p/ os overrides de cor da navbar sobre o hero — ver app.css.
      className="home-hero-nav"
    >
      {/* Hero — fundo animado "Pixel Blast", o mesmo motivo da LP do adila.co. */}
      <section className="relative isolate -mt-14 flex min-h-svh flex-1 items-center justify-center overflow-hidden px-4">
        <PixelBlast className="absolute inset-0 -z-10" />
        <div className="flex flex-col items-center gap-6 text-center text-white">
          <span className="font-pixel text-sm uppercase tracking-[0.2em] text-white/80">
            React · componentes acessíveis · GitHub Packages
          </span>
          <h1 className="max-w-2xl text-balance text-4xl font-light tracking-tight sm:text-5xl">
            Design System <span className="font-pixel">adila.co</span>
          </h1>
          <p className="max-w-xl text-balance text-white/80">
            Biblioteca de componentes da adila.co, distribuída como pacote no
            GitHub Packages. Tema indigo, light &amp; dark e uma base
            consistente para produtos React.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              className="bg-white text-primary hover:bg-white/90"
              render={
                <Link to="/docs/$" params={{ _splat: "" }}>
                  Ver documentação
                </Link>
              }
            />
            <Button
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              render={<Link to="/showcase">Ver showcase</Link>}
            />
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
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
          <code className="mt-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-mono text-sm text-white backdrop-blur-sm">
            bun add @adila-sh/ui
          </code>
        </div>
      </section>
    </HomeLayout>
  );
}
