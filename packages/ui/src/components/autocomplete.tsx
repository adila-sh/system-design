"use client";

import * as React from "react";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import {
  CircleNotchIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

type AutocompleteOption = { value: string; label: string };

type AutocompleteProps = {
  options: AutocompleteOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
};

function Autocomplete({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Buscar...",
  emptyMessage = "Nenhum resultado.",
  loading = false,
  disabled = false,
  name,
  className,
}: AutocompleteProps) {
  return (
    <AutocompletePrimitive.Root
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(nextValue) => onValueChange?.(nextValue)}
      itemToStringValue={(option) => option.label}
      openOnInputClick
      autoHighlight
      name={name}
      disabled={disabled}
    >
      <AutocompletePrimitive.InputGroup
        data-slot="autocomplete"
        className={cn(
          "flex h-10 w-full min-w-48 items-center rounded-md border border-input bg-transparent transition-[color,box-shadow,border-color] has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-disabled:pointer-events-none has-data-disabled:bg-input/50 has-data-disabled:opacity-50",
          className,
        )}
      >
        <span className="flex pl-2.5 text-muted-foreground [&_svg]:size-4">
          {loading ? (
            <CircleNotchIcon className="animate-spin" />
          ) : (
            <MagnifyingGlassIcon />
          )}
        </span>
        <AutocompletePrimitive.Input
          data-slot="autocomplete-input"
          className="h-full min-w-0 flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
          placeholder={placeholder}
          disabled={disabled}
        />
        <AutocompletePrimitive.Clear
          data-slot="autocomplete-clear"
          aria-label="Limpar"
          className="mr-2 flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground data-disabled:hidden [&_svg]:size-3.5"
        >
          <XIcon />
        </AutocompletePrimitive.Clear>
      </AutocompletePrimitive.InputGroup>
      <AutocompletePrimitive.Portal>
        <AutocompletePrimitive.Positioner
          sideOffset={6}
          align="start"
          className="isolate z-50"
        >
          <AutocompletePrimitive.Popup
            data-slot="autocomplete-content"
            className="max-h-(--available-height) w-(--anchor-width) min-w-56 origin-(--transform-origin) overflow-hidden rounded-md bg-popover text-popover-foreground ring-1 ring-foreground/10 duration-fast data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            <AutocompletePrimitive.Status className="px-2 py-2 text-sm text-muted-foreground empty:hidden">
              {loading ? "Buscando..." : null}
            </AutocompletePrimitive.Status>
            <AutocompletePrimitive.Empty className="px-2 py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </AutocompletePrimitive.Empty>
            <AutocompletePrimitive.List className="max-h-72 overflow-y-auto p-1">
              {(option: AutocompleteOption) => (
                <AutocompletePrimitive.Item
                  key={option.value}
                  value={option}
                  className="relative flex cursor-default items-center rounded-md px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                >
                  {option.label}
                </AutocompletePrimitive.Item>
              )}
            </AutocompletePrimitive.List>
          </AutocompletePrimitive.Popup>
        </AutocompletePrimitive.Positioner>
      </AutocompletePrimitive.Portal>
    </AutocompletePrimitive.Root>
  );
}

export { Autocomplete, type AutocompleteOption, type AutocompleteProps };
