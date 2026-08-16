import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "./timeline";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Timeline",
  montar: () => (
    <Timeline>
      <TimelineItem>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Pagamento confirmado</TimelineTitle>
            <TimelineTime>há 2 horas</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            A compensação foi concluída pelo banco emissor.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
