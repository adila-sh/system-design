import { FormMessage } from "./form";
import { descreverContrasteDosTextos } from "../../test/textos";

/**
 * O FormMessage é `role="alert"`: é a mensagem que aparece quando algo deu
 * errado, e portanto o texto do sistema que MAIS precisa ser legível.
 *
 * Ele repetia o arranjo `bg-destructive/N text-destructive` num nível ainda
 * mais fraco que os outros — 5% de tinta — e por não estar em nenhuma lista de
 * variantes escapou tanto da migração anterior quanto da varredura por
 * `bg-destructive/10`. Migrado agora para --destructive-tint e
 * --destructive-tint-foreground; este teste é o que garante o piso.
 */
const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "FormMessage",
  montar: () => (
    <FormMessage>Informe um e-mail válido para continuar.</FormMessage>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
