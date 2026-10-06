import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  CubeIcon,
  PaletteIcon,
  CursorClickIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button, buttonVariants } from "@adila-sh/ui";
import { HomeFooter } from "@/components/home-footer";
import { HomeNavbar } from "@/components/home-navbar";
import { HomePlayground } from "@/components/home-playground";
import { HomeGallery } from "@/components/home-gallery";
import { HomeProductPreview } from "@/components/home-product-preview";
import { HomeGuide } from "@/components/home-guide";

export const Route = createFileRoute("/")({ component: Home });

const FOUNDATIONS = [
  {
    icon: CubeIcon,
    title: "Componentes que se entendem.",
    body: "De um botão ao fluxo completo. Peças React que compartilham comportamento, proporção e identidade.",
    splat: "components/button",
    link: "Explorar componentes",
  },
  {
    icon: PaletteIcon,
    title: "Uma identidade compartilhada.",
    body: "Índigo, fontes Adila e temas claro e escuro. Uma base visual que dá continuidade a cada produto.",
    splat: "philosophy",
    link: "Conhecer os fundamentos",
  },
  {
    icon: CursorClickIcon,
    title: "Cuidado em cada interação.",
    body: "Foco, teclado, contraste e estados testados. A experiência também está nos detalhes que você sente.",
    splat: "components/theme-provider",
    link: "Conhecer os padrões",
  },
] as const;

function Home() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  async function copyInstall() {
    try {
      await navigator.clipboard.writeText("bun add @adila-sh/ui");
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }
  return (
    <>
      <HomeNavbar />
      <main id="conteudo" className="home-page" tabIndex={-1}>
        <section
          className="home-container home-hero"
          aria-labelledby="home-title"
        >
          <div className="home-hero-copy">
            <p className="home-intro">A linguagem de interface da Adila.co</p>
            <h1 id="home-title">
              Boas interfaces.
              <br />
              Uma base em comum.
            </h1>
            <p className="home-lead">
              Componentes, tokens e padrões que conectam design e código. Para
              construir produtos com clareza, do primeiro detalhe ao próximo
              lançamento.
            </p>
            <div className="home-actions">
              <Link
                to="/docs/$"
                params={{ _splat: "" }}
                className={buttonVariants({ size: "lg" })}
              >
                Explorar documentação
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
              <Link to="/showcase" className="home-text-link">
                Ver em produto
              </Link>
            </div>
            <p className="home-note">
              React. Identidade Adila. Temas claro e escuro.
            </p>
          </div>
          <figure className="home-hero-art">
            <img
              src="/identity-wallpaper.webp"
              alt="Caminhos entre flores e vegetação em uma paisagem colorida"
              fetchPriority="high"
              width={1024}
              height={1536}
            />
            <figcaption>Uma linguagem. Muitas possibilidades.</figcaption>
          </figure>
        </section>

        <section
          id="fundamentos"
          className="home-container home-foundations"
          aria-labelledby="foundations-title"
        >
          <div className="home-section-heading">
            <h2 id="foundations-title">Consistência que abre espaço.</h2>
            <p>
              Uma base compartilhada, com liberdade para cada produto encontrar
              sua própria expressão.
            </p>
          </div>
          <div className="home-foundation-grid">
            {FOUNDATIONS.map(({ icon: Icon, ...foundation }) => (
              <article key={foundation.title}>
                <Icon aria-hidden="true" className="home-foundation-icon" />
                <h3>{foundation.title}</h3>
                <p>{foundation.body}</p>
                <Link
                  to="/docs/$"
                  params={{ _splat: foundation.splat }}
                  className="home-text-link"
                >
                  {foundation.link}
                  <ArrowRightIcon aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <HomeGallery />

        <section
          id="componentes"
          className="home-lab"
          aria-labelledby="components-title"
        >
          <div className="home-container home-lab-grid">
            <div className="home-lab-copy">
              <h2 id="components-title">O sistema ganha vida no uso.</h2>
              <p>
                Troque as opções, explore a paleta e veja a tipografia. Aqui, os
                mesmos componentes da biblioteca trabalham juntos.
              </p>
              <Link to="/showcase" className="home-text-link">
                Explorar o showcase
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </div>
            <HomePlayground />
          </div>
        </section>

        <HomeProductPreview />
        <HomeGuide />

        <section
          className="home-container home-start"
          aria-labelledby="start-title"
        >
          <div>
            <h2 id="start-title">Seu próximo produto começa aqui.</h2>
            <p>
              Instale a biblioteca e encontre na documentação os exemplos para
              começar.
            </p>
          </div>
          <div className="home-install">
            <div className="home-install-command">
              <code>bun add @adila-sh/ui</code>
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  copyState === "copied"
                    ? "Comando copiado"
                    : "Copiar comando de instalação"
                }
                onClick={copyInstall}
              >
                {copyState === "copied" ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </div>
            <p role="status" className="home-copy-status">
              {copyState === "copied"
                ? "Comando copiado."
                : copyState === "error"
                  ? "Selecione o comando acima para copiar."
                  : "Disponível no GitHub Packages."}
            </p>
            <Link
              to="/docs/$"
              params={{ _splat: "installation" }}
              className={buttonVariants({ size: "lg" })}
            >
              Guia de instalação
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
