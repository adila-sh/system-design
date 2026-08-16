import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O diálogo tem superfície própria e fica sobre um overlay escurecido, o que
// muda o fundo efetivo de tudo que está dentro.
descreverContrasteDosTextos({
  nome: "Dialog",
  montar: () => (
    <Dialog defaultOpen>
      <DialogTrigger>Abrir</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir fatura</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita e o recibo deixa de ficar
            disponível.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>Confirme para prosseguir</DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  raiz: '[data-slot="dialog-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
