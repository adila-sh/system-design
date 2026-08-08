"use client";

import { PlusIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NewTransactionDrawer() {
  return (
    <Drawer>
      <DrawerTrigger
        render={
          <Button size="sm">
            <PlusIcon />
            Nova
          </Button>
        }
      />
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col pb-2">
          <DrawerHeader>
            <DrawerTitle>Nova transação</DrawerTitle>
            <DrawerDescription>
              Registre um pagamento manualmente.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="t-cliente">Cliente</Label>
              <Input id="t-cliente" placeholder="Nome do cliente" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="t-valor">Valor</Label>
              <Input id="t-valor" inputMode="decimal" placeholder="R$ 0,00" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="t-status">Status</Label>
              <Select defaultValue="Pendente">
                <SelectTrigger id="t-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Falhou">Falhou</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DrawerFooter>
            <Button>Salvar transação</Button>
            <DrawerClose render={<Button variant="outline">Cancelar</Button>} />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
