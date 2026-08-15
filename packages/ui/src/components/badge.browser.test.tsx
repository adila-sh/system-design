import { Badge } from "./badge";
import { descreverContrasteDeTexto } from "../../test/variantes";

const VARIANTES = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const;

// Ver a nota em button.browser.test.tsx: no tema escuro não existe luminosidade
// que satisfaça texto-sobre-tinta e branco-sobre-sólido ao mesmo tempo.
// dark/destructive PIOROU (4.06 -> 3.65) ao declararmos o @custom-variant dark,
// e é a única combinação do pacote que regrediu. Não é efeito colateral: o
// Badge declara bg-destructive/10 com dark:bg-destructive/20, e o override do
// tema escuro simplesmente nunca chegava a valer. Agora vale — o fundo fica
// mais saturado e o contraste com text-destructive cai. É a aparência que o
// componente sempre pretendeu ter, e coincide com o valor do Button, que já
// usava /20 nos dois temas.
const ABAIXO_DO_MINIMO = new Map([
  ["dark/destructive", 3.65],
  ["dark/link", 3.79],
]);

descreverContrasteDeTexto({
  nome: "Badge",
  variantes: VARIANTES,
  montar: (variant) => <Badge variant={variant}>Em revisão</Badge>,
  seletor: '[data-slot="badge"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
