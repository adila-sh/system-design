import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "Select",
  montar: () => (
    <Select defaultOpen defaultValue="pix">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Formas de pagamento</SelectLabel>
          <SelectItem value="pix">Pix</SelectItem>
          <SelectItem value="boleto">Boleto</SelectItem>
          <SelectItem value="cartao" disabled>
            Cartão de crédito
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  raiz: '[data-slot="select-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
