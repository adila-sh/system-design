"use client";

import {
  ChartLineIcon as LineChart,
  CreditCardIcon as CreditCard,
  GearSixIcon as Settings2,
  PackageIcon as Package,
  PlusIcon as Plus,
  SignOutIcon as LogOut,
  SquaresFourIcon as LayoutDashboard,
  UsersIcon as Users,
} from "@phosphor-icons/react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@adila-sh/ui";

export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const run = () => onOpenChange(false);
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Digite um comando ou busque…" />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            <CommandItem onSelect={run}>
              <LayoutDashboard />
              Visão geral
            </CommandItem>
            <CommandItem onSelect={run}>
              <LineChart />
              Analytics
            </CommandItem>
            <CommandItem onSelect={run}>
              <Users />
              Clientes
            </CommandItem>
            <CommandItem onSelect={run}>
              <Package />
              Produtos
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ações">
            <CommandItem onSelect={run}>
              <Plus />
              Nova transação
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={run}>
              <CreditCard />
              Faturamento
            </CommandItem>
            <CommandItem onSelect={run}>
              <Settings2 />
              Configurações
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={run}>
              <LogOut />
              Sair
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
