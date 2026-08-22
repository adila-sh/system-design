import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { DirectionProvider, useDirection } from "./direction";

function LeitorDeDirecao() {
  const direction = useDirection();
  return <output data-slot="direction-value">{direction}</output>;
}

describe("DirectionProvider", () => {
  test("usa ltr quando não há provider", async () => {
    const tela = await render(<LeitorDeDirecao />);
    expect(tela.container.textContent).toBe("ltr");
  });

  test.each(["ltr", "rtl"] as const)(
    "propaga direction=%s",
    async (direction) => {
      const tela = await render(
        <DirectionProvider direction={direction}>
          <LeitorDeDirecao />
        </DirectionProvider>,
      );

      expect(
        tela.container.querySelector('[data-slot="direction-value"]')
          ?.textContent,
      ).toBe(direction);
    },
  );
});
