import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentTitle,
} from "./attachment";
import { descreverContrasteDosTextos } from "../../test/textos";

/**
 * O estado de erro fica num arquivo separado do resto do Attachment porque o
 * harness mede TODOS os textos de um render de uma vez: misturar os dois
 * estados no mesmo `montar` faria o `done` mascarar o `error`, que é o único
 * que troca as cores.
 *
 * Este era o pior caso da migração para os tokens de tinta. A descrição usava
 * `text-destructive/80` — não só a cor de preenchimento como texto, o que já
 * não passa em AA, mas ela a 80%. Agora usa --destructive-tint-foreground, que
 * é o token cujo trabalho é ser a cor legível como texto.
 */
const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Attachment com erro",
  montar: () => (
    <AttachmentGroup>
      <Attachment state="error">
        <AttachmentContent>
          <AttachmentTitle>contrato-assinado.pdf</AttachmentTitle>
          <AttachmentDescription>
            Falha no envio · tente de novo
          </AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </AttachmentGroup>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
