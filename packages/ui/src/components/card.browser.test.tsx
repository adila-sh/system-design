import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O footer cria uma camada muted/50 própria. Medir o card completo verifica o
// título, a descrição apagada, o conteúdo e texto sobre essa camada composta.
descreverContrasteDosTextos({
  nome: "Card",
  montar: () => (
    <Card>
      <CardHeader>
        <CardTitle>Plano profissional</CardTitle>
        <CardDescription>Renovação mensal automática</CardDescription>
        <CardAction>Ativo</CardAction>
      </CardHeader>
      <CardContent>Inclui até dez integrantes.</CardContent>
      <CardFooter>Próxima cobrança em 12 de setembro.</CardFooter>
    </Card>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
