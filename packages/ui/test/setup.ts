// Carrega o CSS real do design system (tokens + Tailwind compilado) em todo
// teste de browser. Sem este import, getComputedStyle devolve os defaults do
// user-agent e qualquer asserção de cor passa vazia.
import "../src/styles/index.css";
import { beforeEach } from "vitest";
import { cleanup } from "vitest-browser-react/pure";

// Com `isolate: false`, os módulos importados permanecem no cache entre
// arquivos. Por isso o hook que `vitest-browser-react` registra no import roda
// apenas para o primeiro arquivo. O setup, porém, é executado para cada um:
// registrar a limpeza aqui permite reutilizar o iframe sem acumular renders.
beforeEach(cleanup);
