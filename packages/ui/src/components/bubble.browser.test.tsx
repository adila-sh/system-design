import { Bubble, BubbleContent } from "./bubble";
import { descreverContrasteDeTexto } from "../../test/variantes";

// Estrutura diferente das anteriores: a variante fica no <Bubble>, mas quem
// pinta a superfície e o texto é o filho [data-slot=bubble-content], via
// seletores `*:`. Se a composição quebrar, a cor não chega no conteúdo — e o
// teste pega isso junto com o contraste.
const VARIANTES = [
  "default",
  "secondary",
  "muted",
  "tinted",
  "outline",
  "ghost",
] as const;

/**
 * dark/tinted em 1.08 NÃO é token mal calibrado como os demais registros desta
 * suíte — é sintoma de um defeito de configuração, diagnosticado ao investigar
 * este número.
 *
 * O pacote não declara `@custom-variant dark`, então o Tailwind v4 compila toda
 * utilitária `dark:` dentro de `@media (prefers-color-scheme: dark)`. Os tokens,
 * porém, trocam pela classe `.dark` (adila-tokens.css). Num sistema operacional
 * em modo claro, ativar o tema escuro troca as cores dos tokens mas deixa toda
 * `dark:` inativa. No tinted isso resulta em fundo claro (0.93) com texto quase
 * branco do tema escuro.
 *
 * Quando o `@custom-variant` for declarado, este valor sobe e o teste vai pedir
 * a remoção da entrada — que é o comportamento desejado.
 */
const ABAIXO_DO_MINIMO = new Map([["dark/tinted", 1.08]]);

descreverContrasteDeTexto({
  nome: "Bubble",
  variantes: VARIANTES,
  montar: (variant) => (
    <Bubble variant={variant}>
      <BubbleContent>Recebi, vou verificar e te retorno.</BubbleContent>
    </Bubble>
  ),
  seletor: '[data-slot="bubble-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
