import { describe, expect, test } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  test("junta classes soltas", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  test("a última classe conflitante vence", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  test("descarta valores condicionais falsos", () => {
    const oculto = false;
    expect(cn("px-2", oculto && "hidden", undefined, null)).toBe("px-2");
  });

  test("aceita objeto e array", () => {
    expect(cn(["px-2", { hidden: true, block: false }])).toBe("px-2 hidden");
  });

  test("resolve conflito entre atalho e propriedade específica", () => {
    // p-4 é sobrescrito só no eixo declarado depois, não inteiro
    expect(cn("p-4", "px-2")).toBe("p-4 px-2");
    expect(cn("px-2", "p-4")).toBe("p-4");
  });
});
