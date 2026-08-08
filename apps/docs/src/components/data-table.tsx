"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DotsThreeIcon } from "@phosphor-icons/react";

import { Button } from "@adila-sh/ui";
import { Checkbox } from "@adila-sh/ui";
import {
  DataTable as DataTablePrimitive,
  DataTableColumnHeader,
} from "@adila-sh/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@adila-sh/ui";
import { Status } from "@adila-sh/ui";

type TransactionStatus = "Pago" | "Pendente" | "Falhou";

type Transaction = {
  id: string;
  cliente: string;
  email: string;
  status: TransactionStatus;
  valor: number;
};

const names = [
  "Ana Prado",
  "Bruno Lima",
  "Carla Reis",
  "Diego Souza",
  "Elena Costa",
  "Felipe Alves",
  "Gabi Nunes",
  "Hugo Dias",
  "Iris Melo",
  "João Rocha",
  "Kelly Souza",
  "Lucas Pinto",
];

const statusPool: TransactionStatus[] = ["Pago", "Pendente", "Falhou"];

const transactions: Transaction[] = Array.from({ length: 48 }, (_, index) => {
  const cliente = names[index % names.length];
  const firstName = cliente.split(" ")[0].toLowerCase();

  return {
    id: `#${3210 - index}`,
    cliente,
    email: `${firstName}${index + 1}@adila.co`,
    status: statusPool[index % statusPool.length],
    valor: ((index * 173) % 1450) + 20 + (index % 4) * 0.5,
  };
});

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const statusVariants = {
  Pago: "success",
  Pendente: "warning",
  Falhou: "destructive",
} as const;

const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Selecionar todas as linhas"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(!!checked)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Selecionar ${row.original.id}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(!!checked)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Pedido",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "cliente",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.cliente}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Status variant={statusVariants[row.original.status]}>
        {row.original.status}
      </Status>
    ),
  },
  {
    accessorKey: "valor",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Valor"
        className="ml-auto -mr-2.5"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">
        {brl.format(row.original.valor)}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Ações">
              <DotsThreeIcon weight="bold" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Copiar ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Estornar</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function DataTable() {
  return (
    <DataTablePrimitive
      columns={columns}
      data={transactions}
      searchKey="cliente"
      searchPlaceholder="Filtrar cliente..."
      pageSize={5}
      pageSizes={[5, 10, 20, 50]}
      getRowId={(transaction) => transaction.id}
    />
  );
}
