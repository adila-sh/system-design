import * as React from "react";

import { cn } from "@/lib/utils";

function DataList({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="data-list"
      className={cn("divide-y", className)}
      {...props}
    />
  );
}

function DataListItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-list-item"
      className={cn(
        "grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1.3fr)] sm:gap-4",
        className,
      )}
      {...props}
    />
  );
}

function DataListTerm({ className, ...props }: React.ComponentProps<"dt">) {
  return (
    <dt
      data-slot="data-list-term"
      className={cn("text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

function DataListValue({ className, ...props }: React.ComponentProps<"dd">) {
  return (
    <dd
      data-slot="data-list-value"
      className={cn("min-w-0 text-sm text-foreground sm:text-right", className)}
      {...props}
    />
  );
}

export { DataList, DataListItem, DataListTerm, DataListValue };
