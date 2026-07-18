"use client";

import * as React from "react";

import { CopyButton } from "@/components/ui/copy-button";
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
        "overflow-hidden rounded-lg border bg-[#0d1117]",
        className,
      )}
      {...props}
    >
      <div
        role="tablist"
        aria-label="Gerenciador de pacotes"
        className="flex items-center border-b border-white/10 px-2"
      >
        {available.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={activeManager === item}
            onClick={() => select(item)}
            className="relative h-10 px-3 font-mono text-xs text-[#8b949e] transition-colors hover:text-white aria-selected:text-white aria-selected:after:absolute aria-selected:after:right-2 aria-selected:after:bottom-0 aria-selected:after:left-2 aria-selected:after:h-0.5 aria-selected:after:bg-primary"
          >
            {item}
          </button>
        ))}
        <CopyButton
          value={command}
          variant="ghost"
          size="icon-xs"
          aria-label="Copiar comando de instalação"
          className="ml-auto text-[#8b949e] hover:bg-white/10 hover:text-white"
        />
      </div>
      <div role="tabpanel" className="overflow-x-auto p-4">
        <code className="font-mono text-[13px] whitespace-pre text-[#e6edf3]">
          <span className="mr-2 text-[#7ee787]" aria-hidden="true">
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
