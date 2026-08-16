import {
  Stat,
  StatDescription,
  StatFooter,
  StatHeader,
  StatLabel,
  StatTrend,
  StatValue,
} from "./stat";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O StatTrend muda de cor semântica conforme o trend (success, destructive,
// muted) — os três aparecem na mesma montagem para serem medidos juntos.
descreverContrasteDosTextos({
  nome: "Stat",
  montar: () => (
    <Stat>
      <StatHeader>
        <StatLabel>Receita recorrente</StatLabel>
      </StatHeader>
      <StatValue>R$ 128.400</StatValue>
      <StatFooter>
        <StatTrend trend="up">+20,1%</StatTrend>
        <StatTrend trend="down">-2,4%</StatTrend>
        <StatTrend trend="neutral">0,0%</StatTrend>
        <StatDescription>vs. mês anterior</StatDescription>
      </StatFooter>
    </Stat>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
