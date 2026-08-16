import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "./empty";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Empty",
  montar: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Nenhuma transação por aqui</EmptyTitle>
        <EmptyDescription>
          Quando a primeira cobrança for compensada, ela aparece nesta lista.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>Importe um extrato para começar.</EmptyContent>
    </Empty>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
