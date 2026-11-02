"use client";

import { Table } from "@cloudflare/kumo/components/table";
import { forwardRef, type ComponentProps } from "react";

const TableRoot = forwardRef<HTMLTableElement, ComponentProps<typeof Table>>(
  function KumoTable(props, ref) {
    return <Table {...props} ref={ref} />;
  },
);

const TableHead = forwardRef<
  HTMLTableCellElement,
  ComponentProps<typeof Table.Head> & {
    scope?: "col" | "row" | "colgroup" | "rowgroup";
  }
>(function KumoTableHead({ scope = "col", ...props }, ref) {
  return <Table.Head {...{ ...props, scope }} ref={ref} />;
});

export const KumoTable = Object.assign(TableRoot, {
  Header: Table.Header,
  Head: TableHead,
  Row: Table.Row,
  Body: Table.Body,
  Cell: Table.Cell,
  CheckCell: Table.CheckCell,
  CheckHead: Table.CheckHead,
  Footer: Table.Footer,
  ResizeHandle: Table.ResizeHandle,
});
