"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useTheme } from "./theme-provider";

import type { ReactNode } from "react";

interface ThemeToggleLabels {
  light: ReactNode;
  dark: ReactNode;
  system: ReactNode;
}

interface ThemeToggleProps {
  /** Textos apresentados no menu. */
  labels?: Partial<ThemeToggleLabels>;
  /** Nome acessível do botão que abre o menu. */
  triggerLabel?: string;
  /** Alinhamento do menu em relação ao botão. */
  align?: "start" | "center" | "end";
}

const DEFAULT_LABELS: ThemeToggleLabels = {
  light: "Claro",
  dark: "Escuro",
  system: "Sistema",
};

function ThemeToggle({
  labels,
  triggerLabel = "Alternar tema",
  align = "end",
}: ThemeToggleProps) {
  const { theme = "system", setTheme } = useTheme();
  const text = { ...DEFAULT_LABELS, ...labels };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" aria-label={triggerLabel} />
        }
      >
        <SunIcon className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            {text.light}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            {text.dark}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            {text.system}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ThemeToggle };
export type { ThemeToggleLabels, ThemeToggleProps };
