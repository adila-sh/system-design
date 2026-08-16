import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Sheet",
  montar: () => (
    <Sheet defaultOpen>
      <SheetTrigger>Abrir painel</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtros avançados</SheetTitle>
          <SheetDescription>
            Combine período, status e método de pagamento.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>Os filtros valem só para esta sessão</SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  raiz: '[data-slot="sheet-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
