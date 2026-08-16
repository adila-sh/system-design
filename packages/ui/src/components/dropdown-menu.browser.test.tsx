import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O menu tem superfície própria (popover), diferente do fundo da página, e traz
// os dois tons mais arriscados: o label do grupo e o atalho, ambos em
// muted-foreground. O item destructive entra por ser cor semântica sobre essa
// mesma superfície.
descreverContrasteDosTextos({
  nome: "DropdownMenu",
  montar: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Abrir menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Ações da fatura</DropdownMenuLabel>
          <DropdownMenuItem>
            Editar
            <DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Duplicar</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Excluir</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  raiz: '[data-slot="dropdown-menu-content"]',
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
