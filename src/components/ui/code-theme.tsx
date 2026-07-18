"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type CodeThemeName =
  | "github-light"
  | "min-light"
  | "solarized-light"
  | "tokyo-night"
  | "github-dark"
  | "dracula";

type CodeThemeDefinition = {
  label: string;
  mode: "light" | "dark";
  shikiTheme: CodeThemeName;
};

const codeThemes: Record<CodeThemeName, CodeThemeDefinition> = {
  "github-light": {
    label: "GitHub Light",
    mode: "light",
    shikiTheme: "github-light",
  },
  "min-light": { label: "Min Light", mode: "light", shikiTheme: "min-light" },
  "solarized-light": {
    label: "Solarized Light",
    mode: "light",
    shikiTheme: "solarized-light",
  },
  "tokyo-night": {
    label: "Tokyo Night",
    mode: "dark",
    shikiTheme: "tokyo-night",
  },
  "github-dark": {
    label: "GitHub Dark",
    mode: "dark",
    shikiTheme: "github-dark",
  },
  dracula: { label: "Dracula", mode: "dark", shikiTheme: "dracula" },
};

const themeClasses: Record<CodeThemeName, string> = {
  "github-light":
    "[--code-bg:#ffffff] [--code-fg:#24292f] [--code-muted:#57606a] [--code-border:#d0d7de] [--code-comment:#6e7781] [--code-keyword:#cf222e] [--code-string:#0a3069] [--code-function:#8250df] [--code-number:#0550ae] [--code-accent:#0969da] [--code-success:#1a7f37] [--code-selection:#ddf4ff]",
  "min-light":
    "[--code-bg:#ffffff] [--code-fg:#2a2b33] [--code-muted:#70717d] [--code-border:#dedee3] [--code-comment:#9293a1] [--code-keyword:#d73a49] [--code-string:#032f62] [--code-function:#6f42c1] [--code-number:#005cc5] [--code-accent:#005cc5] [--code-success:#22863a] [--code-selection:#e8f1ff]",
  "solarized-light":
    "[--code-bg:#fdf6e3] [--code-fg:#657b83] [--code-muted:#93a1a1] [--code-border:#eee8d5] [--code-comment:#93a1a1] [--code-keyword:#859900] [--code-string:#2aa198] [--code-function:#268bd2] [--code-number:#d33682] [--code-accent:#268bd2] [--code-success:#859900] [--code-selection:#eee8d5]",
  "tokyo-night":
    "[--code-bg:#1a1b26] [--code-fg:#c0caf5] [--code-muted:#565f89] [--code-border:#292e42] [--code-comment:#565f89] [--code-keyword:#bb9af7] [--code-string:#9ece6a] [--code-function:#7aa2f7] [--code-number:#ff9e64] [--code-accent:#7aa2f7] [--code-success:#9ece6a] [--code-selection:#283457]",
  "github-dark":
    "[--code-bg:#0d1117] [--code-fg:#e6edf3] [--code-muted:#8b949e] [--code-border:#30363d] [--code-comment:#8b949e] [--code-keyword:#ff7b72] [--code-string:#a5d6ff] [--code-function:#d2a8ff] [--code-number:#79c0ff] [--code-accent:#58a6ff] [--code-success:#7ee787] [--code-selection:#1f3b5d]",
  dracula:
    "[--code-bg:#282a36] [--code-fg:#f8f8f2] [--code-muted:#6272a4] [--code-border:#44475a] [--code-comment:#6272a4] [--code-keyword:#ff79c6] [--code-string:#f1fa8c] [--code-function:#50fa7b] [--code-number:#bd93f9] [--code-accent:#8be9fd] [--code-success:#50fa7b] [--code-selection:#44475a]",
};

type CodeThemeContextValue = {
  theme: CodeThemeName;
  definition: CodeThemeDefinition;
  setTheme: (theme: CodeThemeName) => void;
};

const CodeThemeContext = React.createContext<CodeThemeContextValue | null>(
  null,
);

type CodeThemeProviderProps = React.ComponentProps<"div"> & {
  defaultTheme?: CodeThemeName;
  theme?: CodeThemeName;
  onThemeChange?: (theme: CodeThemeName) => void;
};

function CodeThemeProvider({
  defaultTheme = "tokyo-night",
  theme: controlledTheme,
  onThemeChange,
  className,
  children,
  ...props
}: CodeThemeProviderProps) {
  const [internalTheme, setInternalTheme] = React.useState(defaultTheme);
  const theme = controlledTheme ?? internalTheme;

  function setTheme(nextTheme: CodeThemeName) {
    if (controlledTheme === undefined) setInternalTheme(nextTheme);
    onThemeChange?.(nextTheme);
  }

  return (
    <CodeThemeContext.Provider
      value={{ theme, definition: codeThemes[theme], setTheme }}
    >
      <div
        data-slot="code-theme-provider"
        data-code-theme={theme}
        data-code-theme-mode={codeThemes[theme].mode}
        className={cn(themeClasses[theme], className)}
        {...props}
      >
        {children}
      </div>
    </CodeThemeContext.Provider>
  );
}

function useCodeTheme() {
  const context = React.useContext(CodeThemeContext);
  return (
    context ?? {
      theme: "tokyo-night" as const,
      definition: codeThemes["tokyo-night"],
      setTheme: () => undefined,
    }
  );
}

function CodeThemeSelect({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectTrigger>, "children">) {
  const { theme, setTheme } = useCodeTheme();

  return (
    <Select
      value={theme}
      onValueChange={(value) => setTheme(value as CodeThemeName)}
      items={Object.fromEntries(
        Object.entries(codeThemes).map(([value, definition]) => [
          value,
          definition.label,
        ]),
      )}
    >
      <SelectTrigger
        data-slot="code-theme-select"
        className={cn("w-44", className)}
        {...props}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Temas claros</SelectLabel>
          {(["github-light", "min-light", "solarized-light"] as const).map(
            (value) => (
              <SelectItem key={value} value={value}>
                {codeThemes[value].label}
              </SelectItem>
            ),
          )}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Temas escuros</SelectLabel>
          {(["tokyo-night", "github-dark", "dracula"] as const).map((value) => (
            <SelectItem key={value} value={value}>
              {codeThemes[value].label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export {
  CodeThemeProvider,
  CodeThemeSelect,
  codeThemes,
  useCodeTheme,
  type CodeThemeDefinition,
  type CodeThemeName,
  type CodeThemeProviderProps,
};
