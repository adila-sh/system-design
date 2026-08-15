import { ApiRequestMethod } from "./api-request";
import { descreverContrasteDeTexto } from "../../test/variantes";

// Terceiro componente que repetia o arranjo frágil (`bg-x/10 text-x`), migrado
// para os tokens de tinta. PUT e PATCH usam o par de amarelo, que chegou a medir
// 1.16 no tema escuro antes do @custom-variant dark.
const METODOS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "ApiRequestMethod",
  variantes: METODOS,
  montar: (method) => <ApiRequestMethod method={method} />,
  seletor: '[data-slot="api-request-method"]',
  prop: "method",
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
