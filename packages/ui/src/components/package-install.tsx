"use client";

import * as React from "react";

import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
type PackageCommands = Partial<Record<PackageManager, string>>;

type PackageInstallProps = Omit<React.ComponentProps<"div">, "children"> & {
  commands: PackageCommands;
  defaultManager?: PackageManager;
  manager?: PackageManager;
  onManagerChange?: (manager: PackageManager) => void;
};

const managers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

function PackageInstall({
  commands,
  defaultManager = "npm",
  manager,
  onManagerChange,
  className,
  ...props
}: PackageInstallProps) {
  const available = managers.filter((item) => commands[item]);
  const fallback = available.includes(defaultManager)
    ? defaultManager
    : available[0];
  const [internalManager, setInternalManager] = React.useState(fallback);
  const activeManager = manager ?? internalManager;
  const command = commands[activeManager ?? "npm"] ?? "";

  function select(nextManager: PackageManager) {
    if (manager === undefined) setInternalManager(nextManager);
    onManagerChange?.(nextManager);
  }

  return (
    <div
      data-slot="package-install"
      className={cn(
        "overflow-hidden rounded-lg border border-[var(--code-border,#292e42)] bg-[var(--code-bg,#1a1b26)] transition-colors",
        className,
      )}
      {...props}
    >
      <div
        role="tablist"
        aria-label="Gerenciador de pacotes"
        className="flex items-center border-b border-[var(--code-border,#292e42)] px-2"
      >
        {available.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={activeManager === item}
            onClick={() => select(item)}
            className="relative h-10 px-3 font-mono text-xs text-[var(--code-muted,#565f89)] transition-colors hover:text-[var(--code-fg,#c0caf5)] aria-selected:text-[var(--code-fg,#c0caf5)] aria-selected:after:absolute aria-selected:after:right-2 aria-selected:after:bottom-0 aria-selected:after:left-2 aria-selected:after:h-0.5 aria-selected:after:bg-[var(--code-accent,#7aa2f7)]"
          >
            {item}
          </button>
        ))}
        <CopyButton
          value={command}
          variant="ghost"
          size="icon-xs"
          aria-label="Copiar comando de instalação"
          className="ml-auto text-[var(--code-muted,#565f89)] hover:bg-[var(--code-selection,#283457)] hover:text-[var(--code-fg,#c0caf5)]"
        />
      </div>
      <div role="tabpanel" className="overflow-x-auto p-4">
        <code className="font-mono text-[13px] whitespace-pre text-[var(--code-fg,#c0caf5)]">
          <span
            className="mr-2 text-[var(--code-success,#9ece6a)]"
            aria-hidden="true"
          >
            $
          </span>
          {command}
        </code>
      </div>
    </div>
  );
}

export {
  PackageInstall,
  type PackageCommands,
  type PackageInstallProps,
  type PackageManager,
};
