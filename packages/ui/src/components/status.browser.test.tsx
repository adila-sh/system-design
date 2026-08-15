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

// De 7 combinações falhando restaram 3, todas do tema escuro. As do tema claro
// saíram ao baixar a luminosidade de --destructive, --success e
// --muted-foreground; dark/warning saiu antes, com o @custom-variant dark
// (1.16 -> 9.13). O que resta depende de decisão de design — ver a nota em
// button.browser.test.tsx.
const ABAIXO_DO_MINIMO = new Map([
  ["dark/info", 3.55],
  ["dark/success", 4.02],
  ["dark/destructive", 4.06],
]);

descreverContrasteDeTexto({
  nome: "Status",
  variantes: VARIANTES,
  montar: (variant) => <Status variant={variant}>Processando</Status>,
  seletor: '[data-slot="status"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
