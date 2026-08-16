import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "./item";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Item",
  montar: () => (
    <Item>
      <ItemContent>
        <ItemHeader>Fatura #3208</ItemHeader>
        <ItemTitle>Carla Reis</ItemTitle>
        <ItemDescription>carla3@adila.co · vence em 12 dias</ItemDescription>
        <ItemFooter>Atualizado há 3 horas</ItemFooter>
      </ItemContent>
    </Item>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
