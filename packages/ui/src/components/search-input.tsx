"use client";

import * as React from "react";
import {
  CircleNotchIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/input-group";
import { cn } from "@/lib/utils";

type SearchInputProps = Omit<
  React.ComponentProps<"input">,
  "defaultValue" | "onChange" | "type" | "value"
> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  debounce?: number;
  loading?: boolean;
  clearLabel?: string;
};

function SearchInput({
  className,
  defaultValue = "",
  value,
  onValueChange,
  onSearch,
  debounce = 300,
  loading = false,
  clearLabel = "Limpar busca",
  disabled,
  ...props
}: SearchInputProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const firstSearch = React.useRef(true);

  React.useEffect(() => {
    if (!onSearch) return;
    if (firstSearch.current) {
      firstSearch.current = false;
      return;
    }
    const timer = window.setTimeout(() => onSearch(currentValue), debounce);
    return () => window.clearTimeout(timer);
  }, [currentValue, debounce, onSearch]);

  function update(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  return (
    <InputGroup data-slot="search-input" className={cn("min-w-48", className)}>
      <InputGroupAddon>
        {loading ? (
          <CircleNotchIcon className="animate-spin" aria-hidden="true" />
        ) : (
          <MagnifyingGlassIcon aria-hidden="true" />
        )}
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={currentValue}
        disabled={disabled}
        onChange={(event) => update(event.target.value)}
        {...props}
      />
      {currentValue ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={clearLabel}
            disabled={disabled}
            onClick={() => update("")}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}

export { SearchInput, type SearchInputProps };
