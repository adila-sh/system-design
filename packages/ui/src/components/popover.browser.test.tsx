import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Popover",
  montar: () => (
    <Popover defaultOpen>
      <PopoverTrigger>Detalhes</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Repasse programado</PopoverTitle>
          <PopoverDescription>
            O valor cai na conta em até dois dias úteis.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
  raiz: '[data-slot="popover-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
