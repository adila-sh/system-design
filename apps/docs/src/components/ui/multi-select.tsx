"use client";

import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value?: MultiSelectOption[];
  defaultValue?: MultiSelectOption[];
  onValueChange?: (value: MultiSelectOption[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
};

function MultiSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Selecione...",
  emptyMessage = "Nenhum resultado.",
  disabled = false,
  className,
  name,
}: MultiSelectProps) {
  const anchor = useComboboxAnchor();

  return (
    <Combobox
      items={options}
      multiple
      value={value}
      defaultValue={defaultValue}
      onValueChange={(nextValue) => onValueChange?.(nextValue)}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      isItemEqualToValue={(option, selected) => option.value === selected.value}
      disabled={disabled}
      name={name}
    >
      <ComboboxChips ref={anchor} className={cn("min-h-10", className)}>
        <ComboboxValue>
          {(selected: MultiSelectOption[]) =>
            selected.map((option) => (
              <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxChipsInput
          aria-label={placeholder}
          placeholder={placeholder}
          disabled={disabled}
        />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(option: MultiSelectOption) => (
            <ComboboxItem
              key={option.value}
              value={option}
              disabled={option.disabled}
            >
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export { MultiSelect, type MultiSelectOption, type MultiSelectProps };
