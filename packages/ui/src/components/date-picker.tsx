"use client";

import * as React from "react";
import { CalendarBlankIcon, XIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  formatPattern?: string;
  disabled?: boolean;
  clearable?: boolean;
  fromDate?: Date;
  toDate?: Date;
  className?: string;
};

function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Selecione uma data",
  formatPattern = "dd 'de' MMMM 'de' yyyy",
  disabled = false,
  clearable = false,
  fromDate,
  toDate,
  className,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const currentValue = value ?? internalValue;

  function update(nextValue: Date | undefined) {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    if (nextValue) setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative w-full min-w-56", className)}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start pr-9 text-left font-normal",
                !currentValue && "text-muted-foreground",
              )}
            />
          }
        >
          <CalendarBlankIcon />
          <span className="truncate">
            {currentValue
              ? format(currentValue, formatPattern, { locale: ptBR })
              : placeholder}
          </span>
        </PopoverTrigger>
        {clearable && currentValue && !disabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Limpar data"
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
          mode="single"
          locale={ptBR}
          selected={currentValue}
          onSelect={update}
          disabled={[
            ...(fromDate ? [{ before: fromDate }] : []),
            ...(toDate ? [{ after: toDate }] : []),
          ]}
          defaultMonth={currentValue}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker, type DatePickerProps };
