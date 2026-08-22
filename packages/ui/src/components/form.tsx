"use client";

import * as React from "react";
import { Form as FormPrimitive } from "@base-ui/react/form";

import { cn } from "@/lib/utils";

function Form<
  FormValues extends Record<string, unknown> = Record<string, unknown>,
>({ className, ...props }: FormPrimitive.Props<FormValues>) {
  return (
    <FormPrimitive
      data-slot="form"
      className={cn("space-y-5", className)}
      {...props}
    />
  );
}

function FormActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-actions"
      className={cn(
        "flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-message"
      role="alert"
      className={cn(
        "rounded-md border border-destructive/25 bg-destructive-tint px-3 py-2 text-sm text-destructive-tint-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Form, FormActions, FormMessage };
