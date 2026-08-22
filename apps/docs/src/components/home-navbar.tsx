import { Link } from "@tanstack/react-router";
import { Button } from "@adila-sh/ui";

export function HomeNavbar() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border/70 bg-background text-foreground shadow-sm">
      <nav
        aria-label="Navegação principal"
        className="mx-auto grid h-14 w-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:gap-6 sm:px-10 lg:px-16"
      >
        <Link
          to="/"
          aria-label="Adila.co Design System — início"
          className="inline-flex min-w-0 items-center gap-2 justify-self-start font-semibold"
        >
          <img
            src="/logo-light-40.png"
            alt=""
            width={20}
            height={20}
            className="shrink-0 rounded-md dark:hidden"
          />
          <img
            src="/logo-dark-40.png"
            alt=""
            width={20}
            height={20}
            className="hidden shrink-0 rounded-md dark:block"
          />
          <span className="truncate text-sm sm:text-base">DS | Adila.co</span>
        </Link>

        <Link
          to="/showcase"
          className="rounded-full px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Showcase
        </Link>

        <Button
          size="sm"
          className="h-9 justify-self-end rounded-full px-3 sm:px-4"
          render={
            <Link to="/docs/$" params={{ _splat: "" }}>
              Documentação
            </Link>
          }
        />
      </nav>
    </header>
  );
}
