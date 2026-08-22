import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

const DOCS_LINKS = [
  { splat: "", label: "Introdução" },
  { splat: "installation", label: "Instalação" },
  { splat: "components/button", label: "Componentes" },
] as const;

const EXPLORE_LINKS = [
  { href: "/showcase", label: "Showcase", external: false },
  {
    href: "https://github.com/adila-sh/system-design",
    label: "GitHub",
    external: true,
  },
] as const;

export function HomeFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-12">
          <div>
            <Link
              to="/"
              className="inline-flex flex-wrap items-baseline gap-x-3 tracking-[-0.05em]"
            >
              <span className="text-3xl font-light">Adila.co</span>
              <span className="text-base text-background/55">
                Design System
              </span>
            </Link>
            <p className="mt-7 max-w-sm text-lg leading-7 text-background/65">
              Uma linguagem compartilhada para construir produtos claros,
              acessíveis e reconhecidamente Adila.co.
            </p>
            <p className="mt-8 font-mono text-xs tracking-[0.14em] text-background/40 uppercase">
              Projetar · construir · evoluir
            </p>
          </div>

          <FooterColumn title="Documentação">
            {DOCS_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to="/docs/$"
                  params={{ _splat: link.splat }}
                  className="transition-colors hover:text-background/60"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Explore">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-background/60"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to="/showcase"
                    className="transition-colors hover:text-background/60"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-background/15">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-6 py-5 text-xs text-background/45 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <p>© 2026 Adila.co. Todos os direitos reservados.</p>
          <a
            href="https://adila.co"
            target="_blank"
            rel="noreferrer"
            className="font-mono tracking-[0.12em] uppercase transition-colors hover:text-background/70"
          >
            Conheça a Adila.co
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-xs font-medium tracking-[0.14em] text-background/45 uppercase">
        {title}
      </h2>
      <ul className="mt-5 space-y-3 text-sm text-background/80">{children}</ul>
    </nav>
  );
}
