"use client";

import * as React from "react";
import { FileIcon, UploadSimpleIcon, XIcon } from "@phosphor-icons/react";

import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

type FileUploadProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  accept?: string;
  disabled?: boolean;
  maxSize?: number;
  multiple?: boolean;
  value?: File[];
  defaultValue?: File[];
  onFilesChange?: (files: File[]) => void;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function acceptsFile(file: File, accept?: string) {
  if (!accept) return true;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return accept.split(",").some((specifier) => {
    const rule = specifier.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith(".")) return fileName.endsWith(rule);
    if (rule.endsWith("/*")) return fileType.startsWith(rule.slice(0, -1));
    return fileType === rule;
  });
}

function FileUpload({
  className,
  accept,
  disabled = false,
  maxSize = 10 * 1024 * 1024,
  multiple = false,
  value,
  defaultValue = [],
  onFilesChange,
  ...props
}: FileUploadProps) {
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalFiles, setInternalFiles] = React.useState(defaultValue);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const files = value ?? internalFiles;

  function commit(nextFiles: File[]) {
    if (value === undefined) setInternalFiles(nextFiles);
    onFilesChange?.(nextFiles);
  }

  function add(incoming: FileList | File[]) {
    const next = Array.from(incoming);
    const unsupported = next.find((file) => !acceptsFile(file, accept));
    if (unsupported) {
      setError(`${unsupported.name} não corresponde aos formatos aceitos.`);
      return;
    }
    const oversized = next.find((file) => file.size > maxSize);
    if (oversized) {
      setError(`${oversized.name} excede o limite de ${formatBytes(maxSize)}.`);
      return;
    }
    setError(undefined);
    commit(multiple ? [...files, ...next] : next.slice(0, 1));
  }

  return (
    <div
      data-slot="file-upload"
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      className={cn("space-y-3", className)}
      {...props}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          if (event.target.files) add(event.target.files);
          event.target.value = "";
        }}
      />
      <div
        data-slot="file-upload-dropzone"
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) add(event.dataTransfer.files);
        }}
        className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-6 text-center transition-colors data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UploadSimpleIcon className="size-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Arraste arquivos para cá</p>
          <p className="text-xs text-muted-foreground">
            ou selecione no seu dispositivo · até {formatBytes(maxSize)}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Selecionar {multiple ? "arquivos" : "arquivo"}
        </Button>
      </div>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
      {files.length ? (
        <ul data-slot="file-upload-list" className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.lastModified}-${index}`}
              className="flex items-center gap-3 rounded-md border px-3 py-2"
            >
              <FileIcon className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Remover ${file.name}`}
                onClick={() =>
                  commit(files.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { FileUpload, type FileUploadProps };
