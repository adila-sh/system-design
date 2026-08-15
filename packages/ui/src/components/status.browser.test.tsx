import { Status } from "./status";
import { descreverContrasteDeTexto } from "../../test/variantes";

// Este componente era o pior do pacote: 7 das 10 combinações abaixo do mínimo,
// porque toda variante era texto colorido sobre a MESMA cor a 10-15% de alpha.
// Hoje usa os tokens de tinta (bg-x-tint / text-x-tint-foreground), que separam
// a cor da superfície da cor do texto — e a lista está vazia.
const VARIANTES = [
  "neutral",
  "info",
  "success",
  "warning",
  "destructive",
] as const;

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "Status",
  variantes: VARIANTES,
  montar: (variant) => <Status variant={variant}>Processando</Status>,
  seletor: '[data-slot="status"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
