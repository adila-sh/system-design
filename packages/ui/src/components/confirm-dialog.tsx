"use client";

import * as React from "react";
import { WarningIcon } from "@phosphor-icons/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/alert-dialog";
import { Spinner } from "@/components/spinner";

type ConfirmDialogProps = {
  trigger?: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  pendingLabel?: string;
  errorMessage?: string;
  variant?: "default" | "destructive";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  pendingLabel = "Confirmando...",
  errorMessage = "Não foi possível concluir a ação. Tente novamente.",
  variant = "default",
  open,
  defaultOpen,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const currentOpen = open ?? internalOpen;

  function updateOpen(nextOpen: boolean) {
    if (pending) return;
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen) setError(undefined);
  }

  async function confirm() {
    setPending(true);
    setError(undefined);
    try {
      await onConfirm();
      if (open === undefined) setInternalOpen(false);
      onOpenChange?.(false);
    } catch {
      setError(errorMessage);
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog open={currentOpen} onOpenChange={updateOpen}>
      {trigger ? <AlertDialogTrigger render={trigger} /> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          {variant === "destructive" ? (
            <AlertDialogMedia className="bg-destructive-tint text-destructive-tint-foreground">
              <WarningIcon />
            </AlertDialogMedia>
          ) : null}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={variant === "destructive" ? "destructive" : "default"}
            disabled={pending}
            onClick={confirm}
          >
            {pending ? <Spinner /> : null}
            {pending ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmDialog, type ConfirmDialogProps };
