import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { PixelBlast } from "./pixel-blast";

describe("PixelBlast", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  });

  afterEach(() => vi.restoreAllMocks());

  test("é decorativo e cobre a tela por padrão", async () => {
    const tela = await render(<PixelBlast />);
    const fundo = tela.container.firstElementChild as HTMLElement;
    const canvas = fundo.querySelector("canvas");

    expect(fundo.getAttribute("aria-hidden")).toBe("true");
    expect(fundo.classList.contains("fixed")).toBe(true);
    expect(fundo.classList.contains("inset-0")).toBe(true);
    expect(canvas).not.toBeNull();
    await expect.poll(() => getComputedStyle(canvas!).display).toBe("none");
  });

  test("usa a superfície primary como fallback quando WebGL não existe", async () => {
    const tela = await render(<PixelBlast />);
    const fundo = tela.container.firstElementChild as HTMLElement;

    expect(fundo.classList.contains("bg-primary")).toBe(true);
    expect(getComputedStyle(fundo).backgroundColor).not.toBe(
      "rgba(0, 0, 0, 0)",
    );
  });

  test("aceita geometria local no lugar do posicionamento padrão", async () => {
    const tela = await render(
      <PixelBlast className="relative h-24 w-40 overflow-hidden" />,
    );
    const fundo = tela.container.firstElementChild as HTMLElement;

    expect(fundo.classList.contains("relative")).toBe(true);
    expect(fundo.classList.contains("fixed")).toBe(false);
    expect(getComputedStyle(fundo).position).toBe("relative");
  });
});
