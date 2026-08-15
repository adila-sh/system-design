import { DeploymentStatus } from "./deployment-status";
import { descreverContrasteDeTexto } from "../../test/variantes";

// Repetia o arranjo frágil do Status (`bg-x/10 text-x`); migrado para os tokens
// de tinta junto com ele.
const STATUS = ["queued", "building", "ready", "failed", "canceled"] as const;

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDeTexto({
  nome: "DeploymentStatus",
  variantes: STATUS,
  montar: (status) => <DeploymentStatus status={status} />,
  seletor: '[data-slot="deployment-status"]',
  prop: "status",
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
