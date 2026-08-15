import { ApiRequestMethod } from "./api-request";
import { descreverContrasteDeTexto } from "../../test/variantes";

// Terceiro componente com o mesmo arranjo (`bg-x/10 text-x`). PUT e PATCH usam
// o par de amarelo, o mesmo que colapsa para 1.17 no Status em tema escuro.
const METODOS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

// dark/PUT e dark/PATCH saíram desta lista ao declararmos o @custom-variant
// dark: eram 1.16 e passaram a 9.13, pelo mesmo motivo do Status.
const ABAIXO_DO_MINIMO = new Map([
  ["light/POST", 4.0],
  ["light/DELETE", 3.92],
  ["dark/GET", 3.55],
  ["dark/POST", 4.02],
  ["dark/DELETE", 4.06],
]);

descreverContrasteDeTexto({
  nome: "ApiRequestMethod",
  variantes: METODOS,
  montar: (method) => <ApiRequestMethod method={method} />,
  seletor: '[data-slot="api-request-method"]',
  prop: "method",
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
