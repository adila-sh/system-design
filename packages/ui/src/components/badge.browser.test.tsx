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

// Ver a nota em button.browser.test.tsx para o porquê dos tokens de tinta.
// O `destructive` mantém os dois níveis que o componente sempre teve — tinta
// normal no claro, forte no escuro —, agora como tokens opacos em vez de
// bg-destructive/10 e /20.
const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "Badge",
  variantes: VARIANTES,
  montar: (variant) => <Badge variant={variant}>Em revisão</Badge>,
  seletor: '[data-slot="badge"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
