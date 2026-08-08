import * as React from "react";

import { cn } from "@/lib/utils";

function Terminal({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal"
      className={cn(
        "overflow-hidden rounded-lg border border-[var(--code-border,#292e42)] bg-[var(--code-bg,#1a1b26)] font-mono text-[13px] text-[var(--code-fg,#c0caf5)] shadow-sm transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TerminalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-header"
      className={cn(
        "flex min-h-10 items-center gap-3 border-b border-[var(--code-border,#292e42)] px-3 text-xs text-[var(--code-muted,#565f89)]",
        className,
      )}
      {...props}
    />
  );
}

function TerminalControls({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-controls"
      aria-hidden="true"
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    >
      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
      <span className="size-2.5 rounded-full bg-[#febc2e]" />
      <span className="size-2.5 rounded-full bg-[#28c840]" />
    </div>
  );
}

function TerminalTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-title"
      className={cn("min-w-0 flex-1 truncate text-center", className)}
      {...props}
    />
  );
}

function TerminalActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-actions"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

function TerminalBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-body"
      className={cn("overflow-x-auto p-4 leading-6", className)}
      {...props}
    />
  );
}

function TerminalLine({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-line"
      className={cn("flex min-w-max items-start", className)}
      {...props}
    />
  );
}

function TerminalPrompt({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="terminal-prompt"
      aria-hidden="true"
      className={cn(
        "mr-2 shrink-0 text-[var(--code-success,#9ece6a)] select-none",
        className,
      )}
      {...props}
    />
  );
}

function TerminalCommand({
  className,
  ...props
}: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="terminal-command"
      className={cn("whitespace-pre text-[var(--code-fg,#c0caf5)]", className)}
      {...props}
    />
  );
}

function TerminalOutput({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-output"
      className={cn(
        "whitespace-pre-wrap text-[var(--code-muted,#565f89)]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Terminal,
  TerminalActions,
  TerminalBody,
  TerminalCommand,
  TerminalControls,
  TerminalHeader,
  TerminalLine,
  TerminalOutput,
  TerminalPrompt,
  TerminalTitle,
};
