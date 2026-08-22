import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { descreverContrasteDosTextos } from "../../test/textos";

const ABAIXO_DO_MINIMO = new Map<string, number>();

descreverContrasteDosTextos({
  nome: "ToggleGroup",
  montar: () => (
    <ToggleGroup defaultValue={["grade"]} aria-label="Visualização">
      <ToggleGroupItem value="grade">Grade</ToggleGroupItem>
      <ToggleGroupItem value="lista">Lista</ToggleGroupItem>
    </ToggleGroup>
  ),
  abaixoDoMinimo: ABAIXO_DO_MINIMO,
});

describe("ToggleGroup", () => {
  test("mantém seleção exclusiva por padrão", async () => {
    const tela = await render(
      <ToggleGroup defaultValue={["grade"]} aria-label="Visualização">
        <ToggleGroupItem value="grade">Grade</ToggleGroupItem>
        <ToggleGroupItem value="lista">Lista</ToggleGroupItem>
      </ToggleGroup>,
    );
    const grade = tela.getByRole("button", { name: "Grade" });
    const lista = tela.getByRole("button", { name: "Lista" });

    expect(grade.element().getAttribute("aria-pressed")).toBe("true");
    await lista.click();
    expect(grade.element().getAttribute("aria-pressed")).toBe("false");
    expect(lista.element().getAttribute("aria-pressed")).toBe("true");
  });

  test("orientation=vertical muda o fluxo renderizado", async () => {
    const tela = await render(
      <ToggleGroup orientation="vertical" spacing={0} aria-label="Formato">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    const grupo = tela.container.querySelector('[data-slot="toggle-group"]')!;

    expect(grupo.getAttribute("data-orientation")).toBe("vertical");
    expect(getComputedStyle(grupo).flexDirection).toBe("column");
  });
});
