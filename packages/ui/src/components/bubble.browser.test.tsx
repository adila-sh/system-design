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
 * Vazio de propósito, e vale registrar por quê: foi o dark/tinted, medindo
 * 1.08, que expôs a ausência do `@custom-variant dark`. O fundo claro (0.93)
 * ficava com o texto quase branco do tema escuro, porque a utilitária
 * `dark:bg-[...]` estava presa a `@media (prefers-color-scheme: dark)` enquanto
 * o tema trocava por classe. Declarada a variante, o valor foi para 11.80.
 */
const ABAIXO_DO_MINIMO = new Map<string, number>();

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
