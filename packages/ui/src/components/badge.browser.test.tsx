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

// Ver a nota em button.browser.test.tsx: --destructive e --primary não atingem
// AA de texto sobre as próprias superfícies translúcidas.
const ABAIXO_DO_MINIMO = new Map([
  ["light/destructive", 3.92],
  ["dark/destructive", 4.06],
  ["dark/link", 3.79],
]);

descreverContrasteDeTexto({
  nome: "Badge",
  variantes: VARIANTES,
  montar: (variant) => <Badge variant={variant}>Em revisão</Badge>,
  seletor: '[data-slot="badge"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
