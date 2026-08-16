import {
  ResourceCard,
  ResourceCardContent,
  ResourceCardDescription,
  ResourceCardHeader,
  ResourceCardMeta,
  ResourceCardTitle,
} from "./resource-card";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "ResourceCard",
  montar: () => (
    <ResourceCard>
      <ResourceCardHeader>
        <ResourceCardTitle>Relatório mensal</ResourceCardTitle>
        <ResourceCardMeta>PDF · 2,4 MB</ResourceCardMeta>
      </ResourceCardHeader>
      <ResourceCardContent>
        <ResourceCardDescription>
          Consolidado de cobranças e repasses do último ciclo.
        </ResourceCardDescription>
      </ResourceCardContent>
    </ResourceCard>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
