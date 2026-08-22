import { ArrowRightIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Button } from "@adila-sh/ui";
import { HomeFooter } from "@/components/home-footer";
import { baseOptions } from "@/lib/layout.shared";

export const Route = createFileRoute("/")({
  component: Home,
});

const FOUNDATIONS = [
  {
    number: "01",
    title: "Componentes prontos para produto.",
    body: "Uma biblioteca React acessível, documentada e preparada para interfaces que precisam evoluir sem perder consistência.",
  },
  {
    number: "02",
    title: "Tokens que carregam a identidade.",
    body: "Cor, tipografia, espaço e movimento organizados em uma linguagem compartilhada entre todos os produtos Adila.co.",
  },
  {
    number: "03",
    title: "Contratos que protegem a experiência.",
    body: "Testes de interação, tema, contraste e cobertura transformam decisões visuais em garantias verificáveis.",
  },
] as const;

function Home() {
  const options = baseOptions();

  return (
    <HomeLayout
      {...options}
      nav={{ ...options.nav, transparentMode: "top" }}
      // Escopo dos overrides de contraste da navbar sobre o wallpaper.
      className="home-hero-nav"
    >
      <main className="bg-background">
        <section className="relative isolate -mt-14 flex min-h-svh w-full items-end overflow-hidden bg-foreground text-white">
          <img
            src="/identity-wallpaper.webp"
            alt="Paisagem colorida com caminhos entre flores e vegetação"
            fetchPriority="high"
            className="home-wallpaper-motion absolute inset-0 -z-20 size-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/5 to-black/80"
          />

          <div className="mx-auto flex min-h-svh w-full max-w-[1600px] flex-col justify-end px-6 pt-32 pb-8 sm:px-10 sm:pb-10 lg:px-16">
            <div className="py-12 sm:py-16">
              <h1 className="max-w-[calc(100vw-2rem)] text-[clamp(4.4rem,25vw,7rem)] leading-[0.92] font-light tracking-[-0.09em] text-balance sm:max-w-6xl sm:text-[clamp(6rem,15vw,14rem)] sm:leading-[0.88]">
                <span className="home-editorial-shimmer block">Design</span>
                <span className="home-editorial-shimmer ml-[10vw] block sm:ml-[18vw]">
                  System
                </span>
              </h1>

              <div className="mt-10 flex flex-col gap-7 sm:ml-[18vw] lg:flex-row lg:items-end lg:gap-12">
                <p className="max-w-sm text-base leading-7 text-white/80 text-pretty">
                  A linguagem de interface da Adila.co: componentes, tokens e
                  padrões para construir produtos com clareza e continuidade.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="h-12 rounded-full bg-white px-6 text-black hover:bg-white/90"
                    render={
                      <Link to="/docs/$" params={{ _splat: "" }}>
                        Explorar documentação
                        <ArrowRightIcon data-icon="inline-end" />
                      </Link>
                    }
                  />
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-full border-white/50 bg-black/10 px-6 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
                    render={<Link to="/showcase">Ver em produto</Link>}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/70 bg-background">
          <div className="mx-auto grid max-w-[1600px] gap-8 px-6 py-12 sm:grid-cols-[1fr_auto] sm:items-end sm:px-10 lg:px-16">
            <p className="max-w-3xl text-2xl leading-tight tracking-[-0.035em] text-balance sm:text-4xl">
              Consistência não é repetir a mesma tela. É dar a cada produto a
              mesma voz, mesmo quando ele precisa dizer algo novo.
            </p>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground sm:text-right">
              Uma base compartilhada para projetar, implementar e manter a
              experiência Adila.co.
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
              <div>
                <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
                  Fundamentos
                </p>
                <h2 className="mt-5 max-w-xl text-5xl leading-[0.95] font-light tracking-[-0.07em] text-balance sm:text-7xl">
                  Uma linguagem. Todos os produtos.
                </h2>
              </div>

              <div className="divide-y divide-border/70 border-y border-border/70 lg:mt-16">
                {FOUNDATIONS.map((foundation) => (
                  <article
                    key={foundation.number}
                    className="group grid gap-4 py-8 transition-[padding] duration-300 hover:px-3 sm:grid-cols-[4rem_0.8fr_1fr] sm:items-baseline sm:gap-8 sm:py-10"
                  >
                    <p className="font-mono text-sm text-muted-foreground">
                      {foundation.number}
                    </p>
                    <h3 className="max-w-sm text-2xl leading-tight tracking-[-0.04em]">
                      {foundation.title}
                    </h3>
                    <p className="max-w-lg text-base leading-7 text-muted-foreground">
                      {foundation.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/70 bg-muted/30">
          <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-end lg:px-16">
            <div>
              <p className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
                Comece pela base
              </p>
              <h2 className="mt-5 max-w-3xl text-4xl leading-[0.98] font-light tracking-[-0.06em] text-balance sm:text-6xl">
                Da instalação ao primeiro fluxo em poucos minutos.
              </h2>
              <code className="mt-8 inline-flex rounded-md border bg-background px-4 py-3 font-mono text-sm shadow-xs">
                bun add @adila-sh/ui
              </code>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-12 rounded-full px-6"
                render={
                  <Link to="/docs/$" params={{ _splat: "installation" }}>
                    Começar agora
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                }
              />
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-6"
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
          </div>
        </section>

        <HomeFooter />
      </main>
    </HomeLayout>
  );
}
