import { describe, expect, it, vi } from "vitest";
import {
  appNavigation,
  getPageMetadata,
  handleCommandMenuShortcut,
  isActiveNavigation,
} from "./app-shell";

function keyboardEvent(
  key: string,
  modifiers: { meta?: boolean; ctrl?: boolean },
) {
  return {
    key,
    metaKey: modifiers.meta ?? false,
    ctrlKey: modifiers.ctrl ?? false,
    preventDefault: vi.fn(),
  };
}

describe("atalho do command menu", () => {
  it.each([{ meta: true }, { ctrl: true }])(
    "abre com K e o modificador $meta$ctrl",
    (modifiers) => {
      const event = keyboardEvent("K", modifiers);
      const toggle = vi.fn();

      expect(handleCommandMenuShortcut(event, toggle)).toBe(true);
      expect(event.preventDefault).toHaveBeenCalledOnce();
      expect(toggle).toHaveBeenCalledOnce();
    },
  );

  it("ignora uma tecla sem modificador", () => {
    const event = keyboardEvent("k", {});
    const toggle = vi.fn();

    expect(handleCommandMenuShortcut(event, toggle)).toBe(false);
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(toggle).not.toHaveBeenCalled();
  });
});

describe("navegação do shell", () => {
  it("mantém Clientes navegável e ativo na rota correspondente", () => {
    const clientes = appNavigation.find((item) => item.title === "Clientes");

    expect(clientes?.href).toBe("/clientes");
    expect(isActiveNavigation("/clientes", clientes?.href ?? "")).toBe(true);
    expect(getPageMetadata("/clientes")).toEqual({
      title: "Clientes",
      description: "Contas e relacionamentos",
    });
  });

  it("usa a visão geral como metadata de fallback", () => {
    expect(getPageMetadata("/rota-inexistente").title).toBe("Visão geral");
  });
});
