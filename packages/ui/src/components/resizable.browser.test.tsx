import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";
import { MINIMO, contrasteDoPreenchimento } from "../../test/contrast";
import { TEMAS } from "../../test/variantes";

const HANDLE_ABAIXO_DO_MINIMO = new Map([
  ["light", 1.23],
  ["dark", 1.36],
]);

function Exemplo({ orientation }: { orientation: "horizontal" | "vertical" }) {
  return (
    <div className="h-40 w-80">
      <ResizablePanelGroup orientation={orientation}>
        <ResizablePanel defaultSize={50}>Painel A</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>Painel B</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

describe.each(TEMAS)("Resizable no tema %s", (tema) => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test.each(["horizontal", "vertical"] as const)(
    "orientation=%s expõe a alça e preserva seu piso",
    async (orientation) => {
      document.documentElement.classList.toggle("dark", tema === "dark");
      const tela = await render(<Exemplo orientation={orientation} />);
      const grupo = tela.container.querySelector(
        '[data-slot="resizable-panel-group"]',
      );
      const handle = tela.getByRole("separator").element();
      const contraste = contrasteDoPreenchimento(handle);

      expect(getComputedStyle(grupo!).flexDirection).toBe(
        orientation === "horizontal" ? "row" : "column",
      );
      expect(handle.getAttribute("aria-orientation")).toBe(
        orientation === "horizontal" ? "vertical" : "horizontal",
      );
      expect(handle.querySelector("div")).not.toBeNull();
      expect(contraste).toBeGreaterThanOrEqual(
        HANDLE_ABAIXO_DO_MINIMO.get(tema)!,
      );
      expect(contraste).toBeLessThan(MINIMO.naoTexto);
    },
  );
});
