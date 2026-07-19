"use client";

import * as React from "react";
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

function NumberField({ className, ...props }: NumberFieldPrimitive.Root.Props) {
  return (
    <NumberFieldPrimitive.Root
      data-slot="number-field"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function NumberFieldGroup({
  className,
  ...props
}: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn(
        "flex h-10 w-full min-w-0 items-center rounded-md border border-input bg-transparent transition-[color,box-shadow,border-color] has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-disabled:pointer-events-none has-data-disabled:bg-input/50 has-data-disabled:opacity-50 dark:has-data-disabled:bg-input/80",
        className,
      )}
      {...props}
    />
  );
}

function NumberFieldInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(
        "h-full min-w-0 flex-1 bg-transparent px-2.5 py-1 text-base outline-none placeholder:text-muted-foreground md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function NumberFieldIncrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Increment.Props) {
  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      aria-label="Incrementar"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children ?? <PlusIcon />}
    </NumberFieldPrimitive.Increment>
  );
}

function NumberFieldDecrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Decrement.Props) {
  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      aria-label="Diminuir"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children ?? <MinusIcon />}
    </NumberFieldPrimitive.Decrement>
  );
}

function NumberFieldScrubArea({
  className,
  ...props
}: NumberFieldPrimitive.ScrubArea.Props) {
  return (
    <NumberFieldPrimitive.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn("cursor-ew-resize select-none", className)}
      {...props}
    />
  );
}

function NumberFieldScrubAreaCursor({
  ...props
}: NumberFieldPrimitive.ScrubAreaCursor.Props) {
  return (
    <NumberFieldPrimitive.ScrubAreaCursor
      data-slot="number-field-scrub-area-cursor"
      {...props}
    />
  );
}

export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
};
