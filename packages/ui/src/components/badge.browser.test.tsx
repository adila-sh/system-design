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
// O `destructive` usa os dois níveis por ESTADO e não por tema: tinta normal
// parado, forte no hover, igual nos dois temas. Antes eram normal no claro e
// forte no escuro, o que colapsava base e hover no escuro — ver
// badge-hover.browser.test.tsx.
const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "Badge",
  variantes: VARIANTES,
  montar: (variant) => <Badge variant={variant}>Em revisão</Badge>,
  seletor: '[data-slot="badge"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
