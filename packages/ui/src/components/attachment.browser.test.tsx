import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentTitle,
} from "./attachment";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Attachment",
  montar: () => (
    <AttachmentGroup>
      <Attachment>
        <AttachmentContent>
          <AttachmentTitle>contrato-assinado.pdf</AttachmentTitle>
          <AttachmentDescription>1,2 MB · enviado hoje</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </AttachmentGroup>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
