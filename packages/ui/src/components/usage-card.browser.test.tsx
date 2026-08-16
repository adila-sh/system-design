import { UsageCard } from "./usage-card";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// Os três níveis (normal, aviso e crítico) trocam a cor semântica conforme o
// consumo cruza os limiares, então cada um é montado à parte.
descreverContrasteDosTextos({
  nome: "UsageCard",
  montar: () => (
    <div>
      <UsageCard
        label="Armazenamento"
        value={30}
        max={100}
        description="30 GB de 100 GB"
      />
      <UsageCard
        label="Requisições"
        value={82}
        max={100}
        warningAt={80}
        description="82 mil de 100 mil"
      />
      <UsageCard
        label="Assentos"
        value={97}
        max={100}
        warningAt={80}
        criticalAt={95}
        description="97 de 100 assentos"
      />
    </div>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
