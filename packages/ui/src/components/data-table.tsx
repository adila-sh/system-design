import { useMemo, type ReactNode } from "react";
import {
  type ColumnDef,
  type RowData,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { type Row, rowSelectionFeature } from "@tanstack/table-core";

import { Checkbox } from "@/components/checkbox";
import { cn } from "@/lib/utils";

export const dataTableFeatures = tableFeatures({ rowSelectionFeature });

export type DataTableColumnDef<TData extends RowData> = ColumnDef<
  typeof dataTableFeatures,
  TData
>;

type DataTableColumnHeaderProps = {
  column: unknown;
  title: string;
  className?: string;
};

export function DataTableColumnHeader({
  column: _column,
  title,
  className,
}: DataTableColumnHeaderProps) {
  return <span className={cn("text-xs font-medium", className)}>{title}</span>;
}

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumnDef<TData>[];
  data: TData[];
  empty?: ReactNode;
  getRowId?: (originalRow: TData, index: number) => string;
}

function createSelectionColumn<
  TData extends RowData,
>(): DataTableColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Selecionar todos os registros"
        checked={table.getIsAllRowsSelected()}
        indeterminate={
          table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
      />
    ),
    cell: ({ row }: { row: Row<typeof dataTableFeatures, TData> }) => (
      <Checkbox
        aria-label="Selecionar registro"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  };
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  empty = "Nenhum registro encontrado.",
  getRowId,
}: DataTableProps<TData>) {
  const tableColumns = useMemo(
    () => [createSelectionColumn<TData>(), ...columns],
    [columns],
  );
  const table = useTable({
    features: dataTableFeatures,
    columns: tableColumns,
    data,
    getRowId,
  });

  if (data.length === 0) {
    return (
      <div className="rounded-md border border-border px-6 py-12 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "h-10 px-4 font-medium first:pl-6 last:pr-6",
                      header.column.id === "select" && "w-10",
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border/60">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-muted-hover data-[selected=true]:bg-muted/30"
                data-selected={row.getIsSelected()}
              >
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-4 py-4 first:pl-6 last:pr-6",
                      cell.column.id === "select" && "w-10",
                    )}
                  >
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
