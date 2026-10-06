import { Link } from "@tanstack/react-router";

const DOCS_LINKS = [
  { splat: "", label: "Introdução" },
  { splat: "installation", label: "Instalação" },
  { splat: "components/button", label: "Componentes" },
] as const;

export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-container home-footer-grid">
        <div>
          <Link to="/" className="home-footer-brand">
            Adila.co
          </Link>
          <p>
            Uma linguagem compartilhada para construir produtos claros,
            acessíveis e reconhecidamente nossos.
          </p>
        </div>
        <nav aria-label="Documentação">
          <h2>Documentação</h2>
          <ul>
            {DOCS_LINKS.map((link) => (
              <li key={link.label}>
                <Link to="/docs/$" params={{ _splat: link.splat }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Explore">
          <h2>Explore</h2>
          <ul>
            <li>
              <Link to="/showcase">Showcase</Link>
            </li>
            <li>
              <a
                href="https://github.com/adila-sh/system-design"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a href="https://adila.co" target="_blank" rel="noreferrer">
                Conheça a Adila.co
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="home-container home-footer-bottom">
        <p>© 2026 Adila.co. Todos os direitos reservados.</p>
        <p>Design e código, na mesma direção.</p>
      </div>
    </footer>
  );
}
