import * as React from "react";

import { cn } from "@/lib/utils";

type StepStatus = "complete" | "current" | "upcoming";

function Stepper({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="stepper"
      className={cn(
        "flex w-full flex-col gap-4 sm:flex-row sm:gap-0",
        className,
      )}
      {...props}
    />
  );
}

function StepperItem({
  className,
  status = "upcoming",
  ...props
}: React.ComponentProps<"li"> & { status?: StepStatus }) {
  return (
    <li
      data-slot="stepper-item"
      data-status={status}
      aria-current={status === "current" ? "step" : undefined}
      className={cn(
        "group/stepper-item relative flex min-w-0 flex-1 items-start gap-3 sm:block",
        className,
      )}
      {...props}
    />
  );
}

function StepperIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-indicator"
      aria-hidden="true"
      className={cn(
        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-medium text-muted-foreground transition-colors group-data-[status=complete]/stepper-item:border-primary group-data-[status=complete]/stepper-item:bg-primary group-data-[status=complete]/stepper-item:text-primary-foreground group-data-[status=current]/stepper-item:border-primary group-data-[status=current]/stepper-item:text-primary [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function StepperSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-separator"
      aria-hidden="true"
      className={cn(
        "absolute top-8 bottom-[-1rem] left-4 w-px -translate-x-1/2 bg-border group-last/stepper-item:hidden group-data-[status=complete]/stepper-item:bg-primary sm:top-4 sm:right-0 sm:bottom-auto sm:left-8 sm:h-px sm:w-[calc(100%-2rem)] sm:translate-x-0 sm:-translate-y-1/2",
        className,
      )}
      {...props}
    />
  );
}

function StepperContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stepper-content"
      className={cn("min-w-0 pt-1 sm:pr-4 sm:pt-3", className)}
      {...props}
    />
  );
}

function StepperTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="stepper-title"
      className={cn(
        "text-sm font-medium text-muted-foreground group-data-[status=complete]/stepper-item:text-foreground group-data-[status=current]/stepper-item:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function StepperDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="stepper-description"
      className={cn(
        "mt-1 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
};
