"use client";

import * as React from "react";
import { MultiFileDiff } from "@pierre/diffs/react";

import { useCodeTheme } from "@/components/code-theme";
import { cn } from "@/lib/utils";

type DiffViewerProps = Omit<React.ComponentProps<"div">, "children"> & {
  oldCode: string;
  newCode: string;
  filename?: string;
  oldFilename?: string;
  language?: string;
  layout?: "unified" | "split";
  expandUnchanged?: boolean;
};

function DiffViewer({
  oldCode,
  newCode,
  filename = "file.ts",
  oldFilename,
  language,
  layout = "unified",
  expandUnchanged = true,
  className,
  ...props
}: DiffViewerProps) {
  const { definition } = useCodeTheme();
  const oldFile = React.useMemo(
    () => ({
      name: oldFilename ?? filename,
      contents: oldCode,
      lang: language,
    }),
    [filename, language, oldCode, oldFilename],
  );
  const newFile = React.useMemo(
    () => ({ name: filename, contents: newCode, lang: language }),
    [filename, language, newCode],
  );
  const options = React.useMemo(
    () => ({
      diffStyle: layout,
      diffIndicators: "bars" as const,
      expandUnchanged,
      theme: definition.shikiTheme,
      themeType: definition.mode,
      overflow: "scroll" as const,
    }),
    [definition.mode, definition.shikiTheme, expandUnchanged, layout],
  );

  return (
    <div
      data-slot="diff-viewer"
      className={cn("overflow-hidden rounded-md border bg-card", className)}
      {...props}
    >
      <MultiFileDiff
        oldFile={oldFile}
        newFile={newFile}
        options={options}
        disableWorkerPool
      />
    </div>
  );
}

export { DiffViewer, type DiffViewerProps };
