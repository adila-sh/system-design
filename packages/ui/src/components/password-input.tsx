"use client";

import * as React from "react";
import { EyeIcon, EyeSlashIcon, WarningIcon } from "@phosphor-icons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/input-group";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  showLabel?: string;
  hideLabel?: string;
  capsLockMessage?: string;
};

function PasswordInput({
  className,
  showLabel = "Mostrar senha",
  hideLabel = "Ocultar senha",
  capsLockMessage = "Caps Lock ativado",
  onKeyDown,
  onKeyUp,
  onBlur,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  const [capsLock, setCapsLock] = React.useState(false);

  function updateCapsLock(event: React.KeyboardEvent<HTMLInputElement>) {
    setCapsLock(event.getModifierState("CapsLock"));
  }

  return (
    <div data-slot="password-input" className={cn("space-y-1.5", className)}>
      <InputGroup>
        <InputGroupInput
          type={visible ? "text" : "password"}
          onKeyDown={(event) => {
            updateCapsLock(event);
            onKeyDown?.(event);
          }}
          onKeyUp={(event) => {
            updateCapsLock(event);
            onKeyUp?.(event);
          }}
          onBlur={(event) => {
            setCapsLock(false);
            onBlur?.(event);
          }}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={visible ? hideLabel : showLabel}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? <EyeSlashIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {capsLock ? (
        <p className="flex items-center gap-1 text-xs text-warning-foreground dark:text-warning">
          <WarningIcon aria-hidden="true" />
          {capsLockMessage}
        </p>
      ) : null}
    </div>
  );
}

export { PasswordInput, type PasswordInputProps };
