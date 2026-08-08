"use client";

import * as React from "react";
import { CalendarBlankIcon, XIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { cn } from "@/lib/utils";

type DateRangePickerProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  numberOfMonths?: number;
  className?: string;
};

function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Selecione um período",
  disabled = false,
  clearable = false,
  numberOfMonths = 2,
  className,
}: DateRangePickerProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;

  function update(nextValue: DateRange | undefined) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  const label = currentValue?.from
    ? currentValue.to
      ? `${format(currentValue.from, "dd MMM yyyy", { locale: ptBR })} – ${format(currentValue.to, "dd MMM yyyy", { locale: ptBR })}`
      : format(currentValue.from, "dd MMM yyyy", { locale: ptBR })
    : placeholder;

  return (
    <Popover>
      <div className={cn("relative w-full min-w-64", className)}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start pr-9 text-left font-normal",
                !currentValue?.from && "text-muted-foreground",
              )}
            />
          }
        >
          <CalendarBlankIcon />
          <span className="truncate">{label}</span>
        </PopoverTrigger>
        {clearable && currentValue?.from && !disabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Limpar período"
            className="absolute top-1/2 right-2 -translate-y-1/2"
            onClick={(event) => {
              event.stopPropagation();
              update(undefined);
            }}
          >
            <XIcon />
          </Button>
        ) : null}
      </div>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          locale={ptBR}
          selected={currentValue}
          onSelect={update}
          defaultMonth={currentValue?.from}
          numberOfMonths={numberOfMonths}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DateRangePicker, type DateRangePickerProps, type DateRange };
