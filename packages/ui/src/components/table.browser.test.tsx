import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// Cabeçalho, legenda e rodapé usam muted-foreground em superfícies diferentes do
// corpo, então a varredura por dentro mede os quatro papéis de uma vez.
descreverContrasteDosTextos({
  nome: "Table",
  montar: () => (
    <Table>
      <TableCaption>Transações do último ciclo</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fatura</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>#3208</TableCell>
          <TableCell>Carla Reis</TableCell>
          <TableCell>R$ 367,00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>1 fatura</TableCell>
          <TableCell>R$ 367,00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
