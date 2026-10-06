import { useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import {
  Button,
  buttonVariants,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  ThemeToggle,
} from "@adila-sh/ui";

export function HomeNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="home-nav">
      <a href="#conteudo" className="home-skip-link">
        Pular para o conteúdo
      </a>
      <nav
        aria-label="Navegação principal"
        className="home-container home-nav-inner"
      >
        <Link
          to="/"
          aria-label="Adila.co Design System, início"
          className="home-brand"
        >
          <img
            src="/logo-light-40.png"
            alt=""
            width={32}
            height={32}
            className="rounded-md dark:hidden"
          />
          <img
            src="/logo-dark-40.png"
            alt=""
            width={32}
            height={32}
            className="hidden rounded-md dark:block"
          />
          <span>
            Adila.co<span className="home-brand-caption">Design System</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 lg:flex">
          <a href="#fundamentos" className="home-nav-link">
            Fundamentos
          </a>
          <a href="#componentes" className="home-nav-link">
            Componentes
          </a>
          <a href="#em-produto" className="home-nav-link">
            Em produto
          </a>
          <Link to="/showcase" className="home-nav-link">
            Showcase
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden md:block">
            <Link
              to="/docs/$"
              params={{ _splat: "" }}
              className={buttonVariants()}
            >
              Documentação
            </Link>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Abrir menu"
                  className="lg:hidden"
                />
              }
            >
              <ListIcon />
            </SheetTrigger>
            <SheetContent showCloseButton={false} className="home-mobile-menu">
              <SheetHeader>
                <div className="flex items-center justify-between gap-4">
                  <SheetTitle>Explore o design system</SheetTitle>
                  <SheetClose
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Fechar menu"
                      />
                    }
                  >
                    <XIcon />
                  </SheetClose>
                </div>
                <SheetDescription>
                  A linguagem de interface da Adila.co.
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Navegação mobile" className="home-mobile-links">
                <a href="#fundamentos" onClick={() => setOpen(false)}>
                  Fundamentos
                </a>
                <a href="#componentes" onClick={() => setOpen(false)}>
                  Componentes
                </a>
                <a href="#em-produto" onClick={() => setOpen(false)}>
                  Em produto
                </a>
                <a href="#duvidas" onClick={() => setOpen(false)}>
                  Dúvidas
                </a>
                <Link to="/showcase" onClick={() => setOpen(false)}>
                  Showcase
                </Link>
                <Link
                  to="/docs/$"
                  params={{ _splat: "" }}
                  onClick={() => setOpen(false)}
                >
                  Documentação
                </Link>
                <Link
                  to="/docs/$"
                  params={{ _splat: "installation" }}
                  onClick={() => setOpen(false)}
                >
                  Instalação
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
