import { Alert, AlertDescription, AlertTitle } from "./alert";
import { descreverContrasteDeTexto } from "../../test/variantes";

const VARIANTES = ["default", "destructive"] as const;

function montar(variant: (typeof VARIANTES)[number]) {
  return (
    <Alert variant={variant}>
      <AlertTitle>Não foi possível salvar</AlertTitle>
      <AlertDescription>Verifique a conexão e tente de novo.</AlertDescription>
    </Alert>
  );
}

// O título no tema claro passava raspando (4.55) antes de baixarmos a
// luminosidade do --destructive; agora está em 6.78, com folga real.
const TITULO_ABAIXO_DO_MINIMO = new Map([["dark/destructive", 3.79]]);

// A descrição é medida à parte porque tem alpha próprio (text-destructive/90) e
// fica sempre abaixo do título — no claro, 6.15 contra 6.78.
const DESCRICAO_ABAIXO_DO_MINIMO = new Map([["dark/destructive", 3.3]]);

descreverContrasteDeTexto({
  nome: "AlertTitle",
  variantes: VARIANTES,
  montar,
  seletor: '[data-slot="alert-title"]',
  abaixoDoMinimo: TITULO_ABAIXO_DO_MINIMO,
});

descreverContrasteDeTexto({
  nome: "AlertDescription",
  variantes: VARIANTES,
  montar,
  seletor: '[data-slot="alert-description"]',
  abaixoDoMinimo: DESCRICAO_ABAIXO_DO_MINIMO,
});
