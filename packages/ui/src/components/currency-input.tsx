"use client";

import * as React from "react";

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/number-field";
import { cn } from "@/lib/utils";

type CurrencyInputProps = Omit<
  React.ComponentProps<typeof NumberField>,
  "format" | "locale"
> & {
  currency?: string;
  locale?: string;
  showControls?: boolean;
  inputProps?: Omit<React.ComponentProps<typeof NumberFieldInput>, "children">;
};

function CurrencyInput({
  currency = "BRL",
  locale = "pt-BR",
  showControls = false,
  inputProps,
  className,
  step = 0.01,
  ...props
}: CurrencyInputProps) {
  return (
    <NumberField
      data-slot="currency-input"
      locale={locale}
      step={step}
      format={{
        style: "currency",
        currency,
        currencyDisplay: "symbol",
      }}
      className={cn(className)}
      {...props}
    >
      <NumberFieldGroup>
        {showControls ? <NumberFieldDecrement /> : null}
        <NumberFieldInput inputMode="decimal" {...inputProps} />
        {showControls ? <NumberFieldIncrement /> : null}
      </NumberFieldGroup>
    </NumberField>
  );
}

export { CurrencyInput, type CurrencyInputProps };
