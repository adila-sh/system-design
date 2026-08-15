// Carrega o CSS real do design system (tokens + Tailwind compilado) em todo
// teste de browser. Sem este import, getComputedStyle devolve os defaults do
// user-agent e qualquer asserção de cor passa vazia.
import "../src/styles/index.css";
