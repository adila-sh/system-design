import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O tooltip inverte a superfície em relação ao resto da interface (fundo escuro
// no tema claro), então é o caso em que medir a cor declarada enganaria mais.
descreverContrasteDosTextos({
  nome: "Tooltip",
  montar: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger>Saldo</TooltipTrigger>
      <TooltipContent>Valor já descontado das taxas</TooltipContent>
    </Tooltip>
  ),
  raiz: '[data-slot="tooltip-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
