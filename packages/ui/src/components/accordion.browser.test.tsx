import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O painel começa aberto para medir, no mesmo render, tanto o gatilho quanto o
// conteúdo. Isso também exercita as cores herdadas durante o estado expandido.
descreverContrasteDosTextos({
  nome: "Accordion expandido",
  montar: () => (
    <Accordion defaultValue={["cobranca"]}>
      <AccordionItem value="cobranca">
        <AccordionTrigger>Como funciona a cobrança?</AccordionTrigger>
        <AccordionContent>
          O valor é calculado no fechamento de cada mês.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
