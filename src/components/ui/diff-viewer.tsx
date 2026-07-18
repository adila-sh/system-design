"use client";

import * as React from "react";
import { MultiFileDiff } from "@pierre/diffs/react";

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
      theme: { light: "pierre-light", dark: "pierre-dark" },
      themeType: "system" as const,
      overflow: "scroll" as const,
    }),
    [expandUnchanged, layout],
  );

  return (
    <div
      data-slot="diff-viewer"
      className={cn("overflow-hidden rounded-lg border bg-card", className)}
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
