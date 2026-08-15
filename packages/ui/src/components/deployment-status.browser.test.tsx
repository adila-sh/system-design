import { DeploymentStatus } from "./deployment-status";
import { descreverContrasteDeTexto } from "../../test/variantes";

// Mesmo arranjo do Status (`bg-x/10 text-x`), replicado em outro componente:
// texto colorido sobre a própria cor a 10% de alpha.
const STATUS = ["queued", "building", "ready", "failed", "canceled"] as const;

const ABAIXO_DO_MINIMO = new Map([
  ["dark/building", 3.55],
  ["dark/ready", 4.02],
  ["dark/failed", 4.06],
]);

descreverContrasteDeTexto({
  nome: "DeploymentStatus",
  variantes: STATUS,
  montar: (status) => <DeploymentStatus status={status} />,
  seletor: '[data-slot="deployment-status"]',
  prop: "status",
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
