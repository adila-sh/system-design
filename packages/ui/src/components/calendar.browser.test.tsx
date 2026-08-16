import { Calendar } from "./calendar";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O Calendar é o componente com mais papéis de texto do pacote: cabeçalho do
// mês, iniciais dos dias da semana, dias do mês, dias de fora do mês, o dia de
// hoje e o dia selecionado. Os dois últimos ganham superfície própria, e os
// "de fora do mês" são deliberadamente apagados — que é onde o contraste some.
const REFERENCIA = new Date(2026, 7, 15);

descreverContrasteDosTextos({
  nome: "Calendar",
  montar: () => (
    <Calendar
      mode="single"
      defaultMonth={REFERENCIA}
      selected={new Date(2026, 7, 20)}
      today={REFERENCIA}
      showOutsideDays
    />
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

// Intervalo selecionado: pinta a faixa entre as pontas com uma superfície
// própria, diferente da do dia único.
descreverContrasteDosTextos({
  nome: "Calendar com intervalo",
  montar: () => (
    <Calendar
      mode="range"
      defaultMonth={REFERENCIA}
      selected={{ from: new Date(2026, 7, 10), to: new Date(2026, 7, 22) }}
      showOutsideDays
    />
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

/**
 * Dias bloqueados são o caso mais extremo de estado inativo do pacote: os
 * números caem para 1.38:1 no tema claro e 1.61:1 no escuro.
 *
 * A WCAG 1.4.3 isenta componente inativo, então isto não é violação — e é por
 * isso que fica como piso, não como falha. Mas vale saber que é o menor valor
 * medido em todo o pacote: um calendário de reserva em que metade dos dias está
 * bloqueada fica com metade da grade quase apagada.
 */
descreverContrasteDosTextos({
  nome: "Calendar com dias bloqueados",
  montar: () => (
    <Calendar
      mode="single"
      defaultMonth={REFERENCIA}
      disabled={{ before: REFERENCIA }}
      showOutsideDays
    />
  ),
  pisoDesabilitado: { light: 1.37, dark: 1.6 },
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
