import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

// O Command reúne três papéis de texto apagado no mesmo lugar: o título do
// grupo, o atalho à direita e o estado vazio. Todos usam muted-foreground e
// todos são o tipo de texto que se aceita apagar "porque é secundário".
descreverContrasteDosTextos({
  nome: "Command",
  montar: () => (
    <Command>
      <CommandInput placeholder="Buscar comando" />
      <CommandList>
        <CommandGroup heading="Navegação">
          <CommandItem>
            Ir para faturas
            <CommandShortcut>Ctrl F</CommandShortcut>
          </CommandItem>
          <CommandItem disabled>Exportar relatório</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Conta">
          <CommandItem>Trocar de organização</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

// O estado vazio é medido à parte porque só aparece quando a busca não casa —
// é justamente o momento em que o usuário depende do texto para entender.
descreverContrasteDosTextos({
  nome: "Command vazio",
  montar: () => (
    <Command>
      <CommandInput defaultValue="zzzzzz" />
      <CommandList>
        <CommandEmpty>Nenhum comando encontrado.</CommandEmpty>
      </CommandList>
    </Command>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});
