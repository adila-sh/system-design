import { Status } from "./status";
import { descreverContrasteDeTexto } from "../../test/variantes";

// Todas as variantes do Status são texto colorido sobre a MESMA cor a 10-15% de
// alpha. É o arranjo mais frágil do pacote: o par passa ou falha inteiro
// conforme o token, sem uma superfície neutra pra sustentar o contraste.
const VARIANTES = [
  "neutral",
  "info",
  "success",
  "warning",
  "destructive",
] as const;

// 7 das 10 combinações falham — o pior resultado do pacote, coerente com o
// arranjo acima. dark/warning em 1.17 é o caso extremo: --warning é amarelo, e
// amarelo sobre amarelo a 15% num fundo escuro fica praticamente ilegível.
const ABAIXO_DO_MINIMO = new Map([
  ["light/neutral", 4.49],
  ["light/success", 4.0],
  ["light/destructive", 3.92],
  ["dark/info", 3.55],
  ["dark/success", 4.02],
  ["dark/warning", 1.16],
  ["dark/destructive", 4.06],
]);

descreverContrasteDeTexto({
  nome: "Status",
  variantes: VARIANTES,
  montar: (variant) => <Status variant={variant}>Processando</Status>,
  seletor: '[data-slot="status"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
