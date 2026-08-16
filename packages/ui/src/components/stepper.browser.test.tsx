import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperItem,
  StepperTitle,
} from "./stepper";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// Os três status aparecem juntos porque cada um pinta o passo de um jeito, e o
// `upcoming` é o mais arriscado: passo futuro costuma ser deliberadamente
// apagado, que é onde o contraste some.
descreverContrasteDosTextos({
  nome: "Stepper",
  montar: () => (
    <Stepper>
      <StepperItem status="complete">
        <StepperContent>
          <StepperTitle>Dados da conta</StepperTitle>
          <StepperDescription>Concluído</StepperDescription>
        </StepperContent>
      </StepperItem>
      <StepperItem status="current">
        <StepperContent>
          <StepperTitle>Verificação</StepperTitle>
          <StepperDescription>Em andamento</StepperDescription>
        </StepperContent>
      </StepperItem>
      <StepperItem status="upcoming">
        <StepperContent>
          <StepperTitle>Confirmação</StepperTitle>
          <StepperDescription>Aguardando</StepperDescription>
        </StepperContent>
      </StepperItem>
    </Stepper>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
