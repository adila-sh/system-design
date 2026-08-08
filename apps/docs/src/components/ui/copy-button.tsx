"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

type CopyButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick" | "value"
> & {
  value: string;
  copiedLabel?: string;
  label?: string;
  resetDelay?: number;
  onCopy?: (value: string) => void;
};

function CopyButton({
  value,
  label = "Copiar",
  copiedLabel = "Copiado",
  resetDelay = 2000,
  onCopy,
  children,
  variant = "outline",
  size = "sm",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCopy?.(value);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), resetDelay);
  }

  return (
    <Button
      data-slot="copy-button"
      variant={variant}
      size={size}
      onClick={copy}
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {children ?? (copied ? copiedLabel : label)}
    </Button>
  );
}

export { CopyButton, type CopyButtonProps };
