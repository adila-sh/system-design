import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "./field";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O FieldError é o alvo principal aqui: é texto destructive direto sobre o fundo
// da página, sem tinta atrás, e é a mensagem que o usuário mais precisa ler.
descreverContrasteDosTextos({
  nome: "Field",
  montar: () => (
    <FieldSet>
      <FieldLegend>Dados de cobrança</FieldLegend>
      <Field>
        <FieldContent>
          <FieldLabel>E-mail</FieldLabel>
          <FieldTitle>Endereço principal</FieldTitle>
          <FieldDescription>
            Usamos este endereço para enviar os recibos.
          </FieldDescription>
          <FieldError>Informe um e-mail válido.</FieldError>
        </FieldContent>
      </Field>
    </FieldSet>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
