"use client";

import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";

import type {
  ThemeProviderProps as NextThemesProviderProps,
  UseThemeProps,
} from "next-themes";

type ThemeProviderProps = NextThemesProviderProps;

/**
 * Provider de tema com os defaults do design system Adila.
 *
 * A classe do tema é aplicada no `<html>`, em linha com a variante
 * `dark` publicada no CSS do pacote. Todas as opções do `next-themes`
 * continuam disponíveis e podem sobrescrever estes defaults.
 */
function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

/** Lê e altera o tema fornecido pelo `ThemeProvider` do design system. */
function useTheme(): UseThemeProps {
  return useNextTheme();
}

export { ThemeProvider, useTheme };
export type { ThemeProviderProps, UseThemeProps };
