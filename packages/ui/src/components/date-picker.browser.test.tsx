import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DatePicker } from "./date-picker";

// `id` no gatilho é o que permite <Label htmlFor> apontar para o campo; sem
// ele, quem consome precisa recorrer a aria-labelledby num wrapper.
describe("DatePicker com id", () => {
  test("repassa o id para o botão do gatilho", async () => {
    const tela = await render(<DatePicker id="due-date" />);

    expect(tela.getByRole("button").element().id).toBe("due-date");
  });

  test("um <label htmlFor> passa a rotular o campo", async () => {
    const tela = await render(
      <>
        <label htmlFor="due-date">Prazo</label>
        <DatePicker id="due-date" />
      </>,
    );

    await expect.element(tela.getByLabelText("Prazo")).toBeInTheDocument();
  });
});

describe("DatePicker com showToday", () => {
  test("não mostra o atalho por padrão", async () => {
    const tela = await render(<DatePicker />);
    await tela.getByRole("button").click();

    expect(tela.container.ownerDocument.body.textContent).not.toContain("Hoje");
  });

  test("seleciona a data de hoje pelo atalho", async () => {
    const aoMudar = vi.fn();
    const tela = await render(<DatePicker showToday onValueChange={aoMudar} />);

    await tela.getByRole("button").click();
    await tela.getByRole("button", { name: "Hoje" }).click();

    expect(aoMudar).toHaveBeenCalledTimes(1);
    const escolhida = aoMudar.mock.calls[0]![0] as Date;
    const hoje = new Date();
    expect(escolhida.toDateString()).toBe(hoje.toDateString());
    // Zerado: o valor representa o dia, não o instante do clique.
    expect(escolhida.getHours()).toBe(0);
    expect(escolhida.getMinutes()).toBe(0);
  });

  test("desabilita o atalho quando hoje está fora da janela permitida", async () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);

    const tela = await render(<DatePicker showToday fromDate={amanha} />);
    await tela.getByRole("button").click();

    await expect
      .element(tela.getByRole("button", { name: "Hoje" }))
      .toBeDisabled();
  });
});
