"use client";

import { Tooltip, TooltipProvider } from "@cloudflare/kumo/components/tooltip";
import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type ComponentProps,
} from "react";

type KumoTooltipProps = ComponentProps<typeof Tooltip>;

/** Mantém a composição Kumo com a descrição acessível do gatilho explícita. */
export function KumoTooltip({
  content,
  render,
  children,
  asChild,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: KumoTooltipProps) {
  const descriptionId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const visible = open ?? internalOpen;
  const target =
    render ?? (asChild && isValidElement(children) ? children : undefined);
  const accessibleRender: KumoTooltipProps["render"] =
    typeof target === "function" ? (
      (triggerProps, state) =>
        target(
          {
            ...triggerProps,
            "aria-describedby":
              [
                triggerProps["aria-describedby"],
                visible ? descriptionId : undefined,
              ]
                .filter(Boolean)
                .join(" ") || undefined,
          },
          state,
        )
    ) : isValidElement<Record<string, unknown>>(target) ? (
      cloneElement(target, {
        "aria-describedby":
          [
            target.props["aria-describedby"],
            visible ? descriptionId : undefined,
          ]
            .filter(Boolean)
            .join(" ") || undefined,
      })
    ) : (
      <button aria-describedby={visible ? descriptionId : undefined} />
    );
  return (
    <Tooltip
      {...props}
      open={visible}
      onOpenChange={(next, details) => {
        onOpenChange?.(next, details);
        if (!details.isCanceled) setInternalOpen(next);
      }}
      content={
        <span role="tooltip" id={descriptionId}>
          {content}
        </span>
      }
      render={accessibleRender}
    >
      {asChild ? undefined : children}
    </Tooltip>
  );
}

export { TooltipProvider as KumoTooltipProvider };
