"use client";

import {
  LinkButton,
  type LinkButtonProps,
} from "@cloudflare/kumo/components/button";
import {
  forwardRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";

export type KumoLinkButtonProps = LinkButtonProps;

export const KumoLinkButton: ForwardRefExoticComponent<
  KumoLinkButtonProps & RefAttributes<HTMLAnchorElement>
> = forwardRef<HTMLAnchorElement, KumoLinkButtonProps>(function KumoLinkButton(
  { variant = "ghost", style, ...props },
  ref,
) {
  const emphasis = variant === "primary" || variant === "destructive";
  const token = variant === "destructive" ? "--destructive" : "--primary";
  const emphasisStyle = emphasis
    ? ({
        "--kumo-button-emphasis-bg": `oklch(from var(${token}) min(l, 0.45) c h)`,
        "--kumo-button-emphasis-gradient-start": `oklch(from var(${token}) min(l, 0.5) c h)`,
        "--kumo-button-emphasis-gradient-end": `oklch(from var(${token}) min(l, 0.42) c h)`,
      } as CSSProperties)
    : undefined;
  return (
    <LinkButton
      {...props}
      ref={ref}
      variant={variant}
      style={{ ...emphasisStyle, ...style }}
    />
  );
});
