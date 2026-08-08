import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/collapsible";
import { cn } from "@/lib/utils";

type AsciiCollapsibleItem = {
  id?: React.Key;
  label: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
};

type AsciiCollapsibleProps = Omit<React.ComponentProps<"div">, "children"> & {
  items: AsciiCollapsibleItem[];
  label?: string;
};

function AsciiCollapsible({
  items,
  label = "Itens expansíveis",
  className,
  ...props
}: AsciiCollapsibleProps) {
  return (
    <div
      data-slot="ascii-collapsible"
      role="list"
      aria-label={label}
      className={cn("font-mono text-sm", className)}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const connector = isLast ? "└─" : "├─";
        const childPrefix = isLast ? "  " : "│ ";

        return (
          <Collapsible
            key={item.id ?? `${item.label}-${index}`}
            defaultOpen={item.defaultOpen}
            className="group/ascii-item"
          >
            <div role="listitem">
              <CollapsibleTrigger className="group/trigger flex w-full items-center gap-1 text-left leading-snug text-foreground outline-none transition-colors hover:text-primary focus-visible:text-primary">
                <span aria-hidden="true" className="text-muted-foreground/50">
                  {connector}
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block w-3 text-muted-foreground/60 transition-transform group-data-[panel-open]/trigger:rotate-90"
                >
                  ›
                </span>
                <span>{item.label}</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-5 border-l border-border/70 pl-4 text-muted-foreground">
                <div className="flex gap-1.5 py-1.5">
                  <span aria-hidden="true" className="text-muted-foreground/40">
                    {childPrefix}
                  </span>
                  <div>{item.content}</div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}

export { AsciiCollapsible };
export type { AsciiCollapsibleItem, AsciiCollapsibleProps };
