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

// No tema claro o título passa raspando (4.55) — é justamente por isso que ele
// tem teste: qualquer escurecimento do --card ou clareamento do --destructive
// derruba abaixo de 4.5 sem ninguém perceber.
const TITULO_ABAIXO_DO_MINIMO = new Map([["dark/destructive", 3.79]]);

// A descrição é medida à parte porque tem alpha próprio
// (text-destructive/90), e de fato fica pior que o título nos dois temas.
const DESCRICAO_ABAIXO_DO_MINIMO = new Map([
  ["light/destructive", 4.04],
  ["dark/destructive", 3.3],
]);

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
