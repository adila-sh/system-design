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
// luminosidade do --destructive; hoje está em 6.78, com folga real.
const TITULO_ABAIXO_DO_MINIMO = new Map<string, number>();

// A descrição segue medida à parte: ela tinha alpha próprio (text-destructive/90)
// e ficava sempre abaixo do título. O alpha saiu — a 90% ela media 4.05:1 no
// tema escuro — e agora as duas acompanham o mesmo token.
const DESCRICAO_ABAIXO_DO_MINIMO = new Map<string, number>();

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
