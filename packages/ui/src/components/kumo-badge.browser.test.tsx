import { KumoBadge } from "./kumo-badge";
import { descreverContrasteDeTexto } from "../../test/variantes";
const variantes = [
  "primary",
  "secondary",
  "error",
  "warning",
  "success",
  "info",
  "outline",
  "beta",
  "red",
  "green",
  "blue",
  "purple",
  "neutral",
  "orange",
  "teal",
  "teal-subtle",
] as const;
descreverContrasteDeTexto({
  nome: "KumoBadge",
  variantes,
  montar: (variant) => (
    <KumoBadge variant={variant}>Estado do evento</KumoBadge>
  ),
  seletor: "span",
});
