import * as React from "react";

import { cn } from "@/lib/utils";

function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="timeline"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function TimelineItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="timeline-item"
      className={cn(
        "group/timeline-item relative grid grid-cols-[1rem_1fr] gap-x-3 pb-6 last:pb-0",
        className,
      )}
      {...props}
    />
  );
}

function TimelineIndicator({
  className,
  status = "upcoming",
  children,
  ...props
}: React.ComponentProps<"div"> & {
  status?: "complete" | "current" | "upcoming";
}) {
  return (
    <div
      data-slot="timeline-indicator"
      data-status={status}
      aria-hidden="true"
      className={cn(
        "relative z-10 mt-1 flex size-4 items-center justify-center rounded-full border-2 border-muted-foreground/35 bg-background text-primary-foreground data-[status=complete]:border-primary data-[status=complete]:bg-primary data-[status=current]:border-primary data-[status=current]:shadow-[0_0_0_3px_var(--background),0_0_0_4px_var(--ring)] [&_svg:not([class*='size-'])]:size-2.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function TimelineConnector({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-connector"
      aria-hidden="true"
      className={cn(
        "absolute top-5 bottom-0 left-[0.46875rem] w-px bg-border group-last/timeline-item:hidden",
        className,
      )}
      {...props}
    />
  );
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-content"
      className={cn("min-w-0 space-y-1", className)}
      {...props}
    />
  );
}

function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-header"
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="timeline-title"
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
}

function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
  return (
    <time
      data-slot="timeline-time"
      className={cn("text-xs text-muted-foreground tabular-nums", className)}
      {...props}
    />
  );
}

function TimelineDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
};
